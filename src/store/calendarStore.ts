/**
 * Zustand store — centralized state for navigation, selection, notes, events, theme, and view mode.
 * Handles localStorage persistence for all user data.
 */

import { create } from 'zustand';
import { isSameDay, isBefore, isAfter } from 'date-fns';
import type {
  SelectionState,
  DateRange,
  Note,
  CalendarEvent,
  EventColor,
  WeekStart,
  ViewMode,
  ThemeMode,
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
  hoveredNoteId: string | null;

  // Actions
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToMonth: (month: number, year: number) => void;
  goToToday: () => void;
  setHoveredNoteId: (id: string | null) => void;

  // View mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;

  // Selection state machine
  selectionState: SelectionState;
  range: DateRange;
  hoverDate: Date | null;
  handleDayClick: (date: Date) => void;
  handleDayHover: (date: Date | null) => void;
  clearSelection: () => void;

  // Notes (range-based)
  notes: Note[];
  activeNote: Note | null;
  saveNote: (title: string, content: string) => void;
  deleteNote: (id: string) => void;
  loadNoteForRange: (start: Date, end: Date) => void;
  clearActiveNote: () => void;

  // Events (day-specific)
  events: CalendarEvent[];
  addEvent: (date: string, title: string, color: EventColor) => void;
  deleteEvent: (id: string) => void;
  getEventsForDate: (date: string) => CalendarEvent[];
  getEventsForMonth: (month: number, year: number) => CalendarEvent[];

  // Settings
  weekStart: WeekStart;
  setWeekStart: (ws: WeekStart) => void;

  // Theme
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  cycleTheme: () => void;

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

  goToMonth: (month, year) => set({ viewMonth: month, viewYear: year, viewMode: 'month' }),

  goToToday: () => set({
    viewMonth: now.getMonth(),
    viewYear: now.getFullYear(),
    viewMode: 'month',
  }),

  // View mode
  viewMode: 'month',
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleViewMode: () => set((s) => ({ viewMode: s.viewMode === 'month' ? 'year' : 'month' })),

  // Selection state machine
  selectionState: restored.state,
  range: restored.range,
  hoverDate: null,

  handleDayClick: (date: Date) => {
    const { selectionState, range, notes } = get();

    switch (selectionState) {
      case 'idle': {
        const newRange = { start: date, end: null };
        set({ selectionState: 'selecting', range: newRange, hoverDate: null });
        persistSelection(newRange);
        break;
      }

      case 'selecting': {
        if (range.start && isSameDay(date, range.start)) {
          set({ selectionState: 'idle', range: { start: null, end: null }, hoverDate: null });
          persistSelection({ start: null, end: null });
        } else {
          const start = range.start!;
          const newRange = {
            start: isBefore(date, start) ? date : start,
            end: isAfter(date, start) ? date : start,
          };
          set({ selectionState: 'selected', range: newRange, hoverDate: null });
          persistSelection(newRange);

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
          const noteId = generateNoteId(start, end);
          const existing = notes.find((n) => n.id === noteId);
          set({ activeNote: existing ?? null });
        } else {
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
  hoveredNoteId: null,
  
  setHoveredNoteId: (id) => set({ hoveredNoteId: id }),

  saveNote: (title: string, content: string) => {
    const { range, notes } = get();
    if (!range.start || !range.end) return;

    const id = generateNoteId(range.start, range.end);
    const existingIndex = notes.findIndex((n) => n.id === id);
    const timestamp = Date.now();

    let updatedNotes: Note[];

    if (existingIndex >= 0) {
      updatedNotes = notes.map((n, i) =>
        i === existingIndex
          ? { ...n, title, content, updatedAt: timestamp }
          : n
      );
    } else {
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

  // Events (day-specific)
  events: loadFromStorage<CalendarEvent[]>('cal_events', []),

  addEvent: (date: string, title: string, color: EventColor) => {
    const { events } = get();
    const newEvent: CalendarEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      date,
      title,
      color,
      createdAt: Date.now(),
    };
    const updated = [...events, newEvent];
    set({ events: updated });
    saveToStorage('cal_events', updated);
  },

  deleteEvent: (id: string) => {
    const { events } = get();
    const updated = events.filter((e) => e.id !== id);
    set({ events: updated });
    saveToStorage('cal_events', updated);
  },

  getEventsForDate: (date: string) => {
    return get().events.filter((e) => e.date === date);
  },

  getEventsForMonth: (month: number, year: number) => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    return get().events.filter((e) => e.date.startsWith(prefix));
  },

  // Settings
  weekStart: loadFromStorage<WeekStart>('cal_week_start', 'mon'),

  setWeekStart: (ws: WeekStart) => {
    set({ weekStart: ws });
    saveToStorage('cal_week_start', ws);
  },

  // Theme
  theme: loadFromStorage<ThemeMode>('cal_theme', 'light'),

  setTheme: (theme: ThemeMode) => {
    set({ theme });
    saveToStorage('cal_theme', theme);
  },

  cycleTheme: () => {
    const { theme } = get();
    const next: ThemeMode = theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light';
    set({ theme: next });
    saveToStorage('cal_theme', next);
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
