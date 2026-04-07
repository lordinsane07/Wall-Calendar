/**
 * DayCell — Individual day cell with all visual states.
 * Handles: start/end circles, in-range pills, hover preview,
 * today diamond dot, note indicators, tap animation.
 */

import { memo, useState, useCallback } from 'react';
import { isSameDay } from 'date-fns';
import { useCalendarStore } from '../../store/calendarStore';
import { isInRange, isRangeStart, isRangeEnd } from '../../lib/dateUtils';
import type { CalendarDay } from '../../lib/calendarTypes';
import styles from '../../styles/calendar.module.css';

interface DayCellProps {
  day: CalendarDay;
  hasNote: boolean;
  onPointerDown?: (date: Date, e: React.PointerEvent) => void;
  onPointerEnter?: (date: Date) => void;
}

const DayCell = memo(function DayCell({
  day,
  hasNote,
  onPointerDown,
  onPointerEnter,
}: DayCellProps) {
  const { date, dayOfMonth, isCurrentMonth, isToday, isWeekend } = day;

  const selectionState = useCalendarStore((s) => s.selectionState);
  const range = useCalendarStore((s) => s.range);
  const hoverDate = useCalendarStore((s) => s.hoverDate);
  const handleDayClick = useCalendarStore((s) => s.handleDayClick);
  const handleDayHover = useCalendarStore((s) => s.handleDayHover);

  const [tapped, setTapped] = useState(false);

  // Compute visual states
  const { start, end } = range;
  const isStart = isRangeStart(date, start, end);
  const isEnd = isRangeEnd(date, start, end);
  const inRange = isInRange(date, start, end);
  const isSingleDay = start && end && isSameDay(start, end) && isSameDay(date, start);

  // Hover preview during SELECTING
  const isHoverPreview =
    selectionState === 'selecting' &&
    start &&
    hoverDate &&
    !isSameDay(date, start) &&
    isInRange(date, start, hoverDate);

  // Build class list
  const classes = [styles.dayCell];
  if (!isCurrentMonth) classes.push(styles.otherMonth);
  if (isWeekend && isCurrentMonth) classes.push(styles.weekend);
  if (isStart && !isSingleDay) classes.push(styles.rangeStart);
  if (isEnd && !isSingleDay) classes.push(styles.rangeEnd);
  if (inRange && !isSingleDay) classes.push(styles.inRange);
  if (isSingleDay) classes.push(styles.singleDay);
  if (isHoverPreview) classes.push(styles.hoverPreview);
  if (tapped) classes.push(styles.tapped);

  const handleClick = useCallback(() => {
    if (!isCurrentMonth) return;

    setTapped(true);
    setTimeout(() => setTapped(false), 200);

    handleDayClick(date);
  }, [date, isCurrentMonth, handleDayClick]);

  const handleMouseEnter = useCallback(() => {
    if (!isCurrentMonth) return;
    handleDayHover(date);
    onPointerEnter?.(date);
  }, [date, isCurrentMonth, handleDayHover, onPointerEnter]);

  const handleMouseLeave = useCallback(() => {
    handleDayHover(null);
  }, [handleDayHover]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!isCurrentMonth) return;
      onPointerDown?.(date, e);
    },
    [date, isCurrentMonth, onPointerDown]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  return (
    <div
      className={classes.join(' ')}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      role="gridcell"
      tabIndex={isCurrentMonth ? 0 : -1}
      aria-label={`${dayOfMonth}${isToday ? ', today' : ''}${inRange ? ', selected' : ''}`}
      aria-selected={inRange || isStart || isEnd}
      data-date={date.toISOString()}
    >
      <span className={styles.dayNumber}>{dayOfMonth}</span>
      {isToday && isCurrentMonth && (
        <div className={styles.todayDot} aria-hidden="true" />
      )}
      {hasNote && isCurrentMonth && (
        <div className={styles.noteDot} aria-label="Has note" />
      )}
    </div>
  );
});

export default DayCell;
