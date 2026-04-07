/**
 * Zustand store — centralized state for navigation, selection, and notes.
 * Handles localStorage persistence for all user data.
 */

import { create } from 'zustand';
import { isSameDay, isBefore, isAfter } from 'date-fns';
import type {
  SelectionState,
  DateRange,
  Note,
  WeekStart,
  PersistedSelection,
} from '../lib/calendarTypes';
import { generateNoteId, isInRange, safeParse, formatDate } from '../lib/dateUtils';

/** Load typed value from localStorage */
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Save value to localStorage */
function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full or unavailable — degrade silently
  }
}

interface CalendarStore {
  // Navigation
  viewMonth: number;
  viewYear: number;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToMonth: (month: number, year: number) => void;

  // Selection state machine
  selectionState: SelectionState;
  range: DateRange;
  hoverDate: Date | null;
  handleDayClick: (date: Date) => void;
  handleDayHover: (date: Date | null) => void;
  clearSelection: () => void;

  // Notes
  notes: Note[];
  activeNote: Note | null;
  saveNote: (title: string, content: string) => void;
  deleteNote: (id: string) => void;
  loadNoteForRange: (start: Date, end: Date) => void;
  clearActiveNote: () => void;

  // Settings
  weekStart: WeekStart;
  setWeekStart: (ws: WeekStart) => void;

  // Notes panel visibility (mobile)
  notesPanelOpen: boolean;
  setNotesPanelOpen: (open: boolean) => void;
  toggleNotesPanel: () => void;
}

const now = new Date();

/** Restore persisted selection from localStorage */
function restoreSelection(): { state: SelectionState; range: DateRange } {
  const persisted = loadFromStorage<PersistedSelection | null>('cal_selection', null);
  if (!persisted) return { state: 'idle', range: { start: null, end: null } };

  const start = safeParse(persisted.start);
  const end = safeParse(persisted.end);

  if (start && end) {
    return { state: 'selected', range: { start, end } };
  }
  if (start) {
    return { state: 'selecting', range: { start, end: null } };
  }
  return { state: 'idle', range: { start: null, end: null } };
}

const restored = restoreSelection();

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  // Navigation
  viewMonth: now.getMonth(),
  viewYear: now.getFullYear(),

  goToPrevMonth: () =>
    set((s) => {
      const m = s.viewMonth === 0 ? 11 : s.viewMonth - 1;
      const y = s.viewMonth === 0 ? s.viewYear - 1 : s.viewYear;
      return { viewMonth: m, viewYear: y };
    }),

  goToNextMonth: () =>
    set((s) => {
      const m = s.viewMonth === 11 ? 0 : s.viewMonth + 1;
      const y = s.viewMonth === 11 ? s.viewYear + 1 : s.viewYear;
      return { viewMonth: m, viewYear: y };
    }),

  goToMonth: (month, year) => set({ viewMonth: month, viewYear: year }),

  // Selection state machine
  selectionState: restored.state,
  range: restored.range,
  hoverDate: null,

  handleDayClick: (date: Date) => {
    const { selectionState, range, notes } = get();

    switch (selectionState) {
      case 'idle': {
        // Start new selection
        const newRange = { start: date, end: null };
        set({ selectionState: 'selecting', range: newRange, hoverDate: null });
        persistSelection(newRange);
        break;
      }

      case 'selecting': {
        if (range.start && isSameDay(date, range.start)) {
          // Click same date → cancel
          set({ selectionState: 'idle', range: { start: null, end: null }, hoverDate: null });
          persistSelection({ start: null, end: null });
        } else {
          // Complete selection (always sort min→max)
          const start = range.start!;
          const newRange = {
            start: isBefore(date, start) ? date : start,
            end: isAfter(date, start) ? date : start,
          };
          set({ selectionState: 'selected', range: newRange, hoverDate: null });
          persistSelection(newRange);

          // Auto-load existing note for this range
          const noteId = generateNoteId(newRange.start!, newRange.end!);
          const existing = notes.find((n) => n.id === noteId);
          if (existing) {
            set({ activeNote: existing });
          }
        }
        break;
      }

      case 'selected': {
        const { start, end } = range;
        if (start && end && isInRange(date, start, end)) {
          // Click inside range → open note editor
          const noteId = generateNoteId(start, end);
          const existing = notes.find((n) => n.id === noteId);
          set({
            activeNote: existing ?? null,
            notesPanelOpen: true,
          });
        } else {
          // Click outside range → start new selection
          const newRange = { start: date, end: null };
          set({
            selectionState: 'selecting',
            range: newRange,
            hoverDate: null,
            activeNote: null,
          });
          persistSelection(newRange);
        }
        break;
      }
    }
  },

  handleDayHover: (date) => set({ hoverDate: date }),

  clearSelection: () => {
    set({
      selectionState: 'idle',
      range: { start: null, end: null },
      hoverDate: null,
      activeNote: null,
    });
    persistSelection({ start: null, end: null });
  },

  // Notes
  notes: loadFromStorage<Note[]>('cal_notes', []),
  activeNote: null,

  saveNote: (title: string, content: string) => {
    const { range, notes } = get();
    if (!range.start || !range.end) return;

    const id = generateNoteId(range.start, range.end);
    const existingIndex = notes.findIndex((n) => n.id === id);
    const timestamp = Date.now();

    let updatedNotes: Note[];

    if (existingIndex >= 0) {
      // Update existing
      updatedNotes = notes.map((n, i) =>
        i === existingIndex
          ? { ...n, title, content, updatedAt: timestamp }
          : n
      );
    } else {
      // Create new
      const newNote: Note = {
        id,
        rangeStart: formatDate(range.start),
        rangeEnd: formatDate(range.end),
        title,
        content,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      updatedNotes = [...notes, newNote];
    }

    set({ notes: updatedNotes, activeNote: updatedNotes.find((n) => n.id === id) ?? null });
    saveToStorage('cal_notes', updatedNotes);
  },

  deleteNote: (id: string) => {
    const { notes } = get();
    const updated = notes.filter((n) => n.id !== id);
    set({ notes: updated, activeNote: null });
    saveToStorage('cal_notes', updated);
  },

  loadNoteForRange: (start: Date, end: Date) => {
    const { notes } = get();
    const id = generateNoteId(start, end);
    const existing = notes.find((n) => n.id === id);
    set({ activeNote: existing ?? null });
  },

  clearActiveNote: () => set({ activeNote: null }),

  // Settings
  weekStart: loadFromStorage<WeekStart>('cal_week_start', 'mon'),

  setWeekStart: (ws: WeekStart) => {
    set({ weekStart: ws });
    saveToStorage('cal_week_start', ws);
  },

  // Notes panel
  notesPanelOpen: false,
  setNotesPanelOpen: (open) => set({ notesPanelOpen: open }),
  toggleNotesPanel: () => set((s) => ({ notesPanelOpen: !s.notesPanelOpen })),
}));

/** Persist selection to localStorage */
function persistSelection(range: DateRange): void {
  const persisted: PersistedSelection = {
    start: range.start ? formatDate(range.start) : null,
    end: range.end ? formatDate(range.end) : null,
    savedAt: Date.now(),
  };
  saveToStorage('cal_selection', persisted);
}
