/**
 * CalendarGrid — 7×N day grid with drag-to-select support.
 * Uses Pointer Events API for unified mouse/touch handling.
 */

import { memo, useCallback, useRef, useState, useMemo } from 'react';
import { useCalendarStore } from '../../store/calendarStore';
import { getCalendarDays, formatDate } from '../../lib/dateUtils';
import { getHolidaysForMonth } from '../../data/holidays';
import type { Holiday } from '../../data/holidays';
import DayCell from './DayCell';
import WeekdayLabels from './WeekdayLabels';
import styles from '../../styles/calendar.module.css';

const CalendarGrid = memo(function CalendarGrid() {
  const viewMonth = useCalendarStore((s) => s.viewMonth);
  const viewYear = useCalendarStore((s) => s.viewYear);
  const weekStart = useCalendarStore((s) => s.weekStart);
  const notes = useCalendarStore((s) => s.notes);
  const events = useCalendarStore((s) => s.events);
  const handleDayClick = useCalendarStore((s) => s.handleDayClick);
  const handleDayHover = useCalendarStore((s) => s.handleDayHover);

  const days = getCalendarDays(viewYear, viewMonth, weekStart);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartDate = useRef<Date | null>(null);

  const hoveredNoteId = useCalendarStore((s) => s.hoveredNoteId);
  const hoveredNote = useMemo(() => notes.find(n => n.id === hoveredNoteId), [notes, hoveredNoteId]);

  // Build a set of date strings that have notes
  const datesWithMultiDayNotes = useMemo(() => {
    const set = new Set<string>();
    for (const note of notes) {
      if (note.rangeStart !== note.rangeEnd) {
        const start = new Date(note.rangeStart + 'T00:00:00');
        const end = new Date(note.rangeEnd + 'T00:00:00');
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          set.add(formatDate(d));
        }
      }
    }
    return set;
  }, [notes]);

  const datesWithSingleDayNotes = useMemo(() => {
    const set = new Set<string>();
    for (const note of notes) {
      if (note.rangeStart === note.rangeEnd) {
        set.add(note.rangeStart);
      }
    }
    return set;
  }, [notes]);

  // Build holiday lookup map for current month
  const holidayMap = useMemo(() => {
    const holidays = getHolidaysForMonth(viewMonth, viewYear);
    const map = new Map<string, Holiday>();
    for (const h of holidays) {
      map.set(h.date, h);
    }
    return map;
  }, [viewMonth, viewYear]);

  // Build event count map for current month
  const eventCountMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const evt of events) {
      map.set(evt.date, (map.get(evt.date) ?? 0) + 1);
    }
    return map;
  }, [events]);

  // Drag-to-select: pointer down
  const handlePointerDown = useCallback(
    (date: Date, e: React.PointerEvent) => {
      if (!gridRef.current) return;
      setIsDragging(true);
      dragStartDate.current = date;

      // Capture pointer for drag across cells
      gridRef.current.setPointerCapture(e.pointerId);
      handleDayClick(date);
    },
    [handleDayClick]
  );

  // Drag-to-select: pointer move
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !gridRef.current) return;

      // Find which cell is under the pointer
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (!element) return;

      const cellEl = element.closest('[data-date]');
      if (!cellEl) return;

      const dateStr = cellEl.getAttribute('data-date');
      if (!dateStr) return;

      const date = new Date(dateStr);
      handleDayHover(date);
    },
    [isDragging, handleDayHover]
  );

  // Drag-to-select: pointer up
  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !gridRef.current) return;

      setIsDragging(false);
      gridRef.current.releasePointerCapture(e.pointerId);

      // Find the cell under pointer and finalize
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (!element) return;

      const cellEl = element.closest('[data-date]');
      if (!cellEl) return;

      const dateStr = cellEl.getAttribute('data-date');
      if (!dateStr) return;

      const endDate = new Date(dateStr);
      if (dragStartDate.current && endDate.getTime() !== dragStartDate.current.getTime()) {
        handleDayClick(endDate);
      }

      dragStartDate.current = null;
    },
    [isDragging, handleDayClick]
  );

  return (
    <div className={styles.calendarBody}>
      <WeekdayLabels />
      <div
        ref={gridRef}
        className={styles.calendarGrid}
        role="grid"
        aria-label="Calendar dates"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        {days.map((day) => {
          const dateKey = formatDate(day.date);
          const hasMultiNote = datesWithMultiDayNotes.has(dateKey);
          const hasSingleNote = datesWithSingleDayNotes.has(dateKey);
          const holiday = holidayMap.get(dateKey);
          const eventCount = eventCountMap.get(dateKey) ?? 0;
          
          let isHoveredNote = false;
          if (hoveredNote) {
            const hStart = new Date(hoveredNote.rangeStart + 'T00:00:00');
            const hEnd = new Date(hoveredNote.rangeEnd + 'T23:59:59');
            isHoveredNote = day.date >= hStart && day.date <= hEnd;
          }

          return (
            <DayCell
              key={day.date.toISOString()}
              day={day}
              hasMultiNote={hasMultiNote}
              hasSingleNote={hasSingleNote}
              isHoveredNote={isHoveredNote}
              holiday={holiday}
              eventCount={eventCount}
              onPointerDown={handlePointerDown}
            />
          );
        })}
      </div>
    </div>
  );
});

export default CalendarGrid;
