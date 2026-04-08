/**
 * Date math utilities for the Wall Calendar.
 * All date calculations are centralized here — no date math in components.
 * Uses date-fns for reliability and tree-shaking.
 */

import {
  getDaysInMonth as dfnsGetDaysInMonth,
  startOfMonth,
  getDay,
  format,
  isToday as dfnsIsToday,
  isSameDay,
  isWeekend as dfnsIsWeekend,
  isBefore,
  isAfter,
  addMonths,
  subMonths,
  eachDayOfInterval,
  parseISO,
} from 'date-fns';

import type { CalendarDay, WeekStart } from './calendarTypes';

/**
 * Get the number of days in a given month.
 * @param year - Full year (e.g. 2026)
 * @param month - Month index (0-11)
 */
export function getDaysInMonth(year: number, month: number): number {
  return dfnsGetDaysInMonth(new Date(year, month, 1));
}

/**
 * Get the day-of-week offset for the first day of a month.
 * Returns 0-6 where 0 = first column in the grid.
 * @param year - Full year
 * @param month - Month index (0-11)
 * @param weekStart - Whether weeks start on Monday or Sunday
 */
export function getFirstDayOffset(
  year: number,
  month: number,
  weekStart: WeekStart = 'mon'
): number {
  const firstDay = startOfMonth(new Date(year, month, 1));
  const dow = getDay(firstDay); // 0=Sun, 1=Mon, ...6=Sat

  if (weekStart === 'mon') {
    return dow === 0 ? 6 : dow - 1;
  }
  return dow;
}

/**
 * Check if a date falls within a range (inclusive).
 * Handles null values and reversed ranges gracefully.
 */
export function isInRange(
  date: Date,
  start: Date | null,
  end: Date | null
): boolean {
  if (!start || !end) return false;

  const rangeStart = isBefore(start, end) ? start : end;
  const rangeEnd = isAfter(start, end) ? start : end;

  return (
    (isAfter(date, rangeStart) || isSameDay(date, rangeStart)) &&
    (isBefore(date, rangeEnd) || isSameDay(date, rangeEnd))
  );
}

/**
 * Check if a date is the start of a range.
 */
export function isRangeStart(
  date: Date,
  start: Date | null,
  end: Date | null
): boolean {
  if (!start) return false;
  if (!end) return isSameDay(date, start);
  const realStart = isBefore(start, end) ? start : end;
  return isSameDay(date, realStart);
}

/**
 * Check if a date is the end of a range.
 */
export function isRangeEnd(
  date: Date,
  start: Date | null,
  end: Date | null
): boolean {
  if (!end) return false;
  if (!start) return isSameDay(date, end);
  const realEnd = isAfter(start, end) ? start : end;
  return isSameDay(date, realEnd);
}

/**
 * Format a date for display.
 * @param date - Date to format
 * @param formatStr - Format string (date-fns syntax)
 */
export function formatDate(date: Date, formatStr: string = 'yyyy-MM-dd'): string {
  return format(date, formatStr);
}

/**
 * Format a date range as a human-readable label.
 * E.g., "Apr 7 – Apr 14" or "Apr 7" for single-day.
 */
export function formatRangeLabel(start: Date | null, end: Date | null): string {
  if (!start) return '';
  if (!end || isSameDay(start, end)) {
    return format(start, 'MMM d');
  }
  const realStart = isBefore(start, end) ? start : end;
  const realEnd = isAfter(start, end) ? start : end;

  const currentYear = new Date().getFullYear();
  
  if (realStart.getFullYear() === realEnd.getFullYear()) {
    const showYear = realStart.getFullYear() !== currentYear;
    const yearSuffix = showYear ? ', yyyy' : '';
    
    if (realStart.getMonth() === realEnd.getMonth()) {
      return `${format(realStart, `MMM d${yearSuffix}`)} – ${format(realEnd, 'd')}`;
    }
    return `${format(realStart, `MMM d${yearSuffix}`)} – ${format(realEnd, `MMM d`)}`;
  }
  return `${format(realStart, 'MMM d, yyyy')} – ${format(realEnd, 'MMM d, yyyy')}`;
}

/**
 * Generate a note ID from a date range.
 */
export function generateNoteId(start: Date, end: Date): string {
  const s = isBefore(start, end) ? start : end;
  const e = isAfter(start, end) ? start : end;
  return `note_${format(s, 'yyyy-MM-dd')}_${format(e, 'yyyy-MM-dd')}`;
}

/**
 * Build the full calendar grid for a given month.
 * Includes overflow days from adjacent months.
 */
export function getCalendarDays(
  year: number,
  month: number,
  weekStart: WeekStart = 'mon'
): CalendarDay[] {
  const days: CalendarDay[] = [];
  const today = new Date();
  const offset = getFirstDayOffset(year, month, weekStart);
  const daysInMonth = getDaysInMonth(year, month);

  // Previous month overflow days
  const prevMonth = subMonths(new Date(year, month, 1), 1);
  const daysInPrevMonth = getDaysInMonth(
    prevMonth.getFullYear(),
    prevMonth.getMonth()
  );

  for (let i = offset - 1; i >= 0; i--) {
    const date = new Date(
      prevMonth.getFullYear(),
      prevMonth.getMonth(),
      daysInPrevMonth - i
    );
    days.push({
      date,
      dayOfMonth: daysInPrevMonth - i,
      isCurrentMonth: false,
      isToday: dfnsIsToday(date),
      isWeekend: dfnsIsWeekend(date),
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    days.push({
      date,
      dayOfMonth: d,
      isCurrentMonth: true,
      isToday: dfnsIsToday(date),
      isWeekend: dfnsIsWeekend(date),
    });
  }

  // Next month overflow days — fill to complete rows (6 rows × 7 = 42)
  const nextMonth = addMonths(new Date(year, month, 1), 1);
  const totalCells = Math.ceil(days.length / 7) * 7;
  const remaining = totalCells - days.length;

  for (let d = 1; d <= remaining; d++) {
    const date = new Date(
      nextMonth.getFullYear(),
      nextMonth.getMonth(),
      d
    );
    days.push({
      date,
      dayOfMonth: d,
      isCurrentMonth: false,
      isToday: dfnsIsToday(date),
      isWeekend: dfnsIsWeekend(date),
    });
  }

  return days;
}

/**
 * Get weekday labels based on week start preference.
 */
export function getWeekdayLabels(weekStart: WeekStart = 'mon'): string[] {
  if (weekStart === 'mon') {
    return ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  }
  return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
}

/**
 * Get all dates in a range as an array.
 */
export function getDatesInRange(start: Date, end: Date): Date[] {
  const s = isBefore(start, end) ? start : end;
  const e = isAfter(start, end) ? start : end;
  return eachDayOfInterval({ start: s, end: e });
}

/**
 * Parse an ISO date string safely.
 */
export function safeParse(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  try {
    return parseISO(dateStr);
  } catch {
    return null;
  }
}

/**
 * Check if two dates are the same day.
 */
export { isSameDay, dfnsIsToday as isToday, isBefore, isAfter };
