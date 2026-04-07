/**
 * CalendarHeader — Month name, year, navigation arrows, and settings toggle.
 * Typography: Playfair Display for month, DM Mono for year.
 */

import { memo, useCallback } from 'react';
import { format } from 'date-fns';
import { useCalendarStore } from '../../store/calendarStore';
import styles from '../../styles/calendar.module.css';

interface CalendarHeaderProps {
  onMonthChange: () => void;
}

const CalendarHeader = memo(function CalendarHeader({ onMonthChange }: CalendarHeaderProps) {
  const viewMonth = useCalendarStore((s) => s.viewMonth);
  const viewYear = useCalendarStore((s) => s.viewYear);
  const goToPrevMonth = useCalendarStore((s) => s.goToPrevMonth);
  const goToNextMonth = useCalendarStore((s) => s.goToNextMonth);
  const weekStart = useCalendarStore((s) => s.weekStart);
  const setWeekStart = useCalendarStore((s) => s.setWeekStart);

  const monthName = format(new Date(viewYear, viewMonth, 1), 'MMMM');

  const handlePrev = useCallback(() => {
    goToPrevMonth();
    onMonthChange();
  }, [goToPrevMonth, onMonthChange]);

  const handleNext = useCallback(() => {
    goToNextMonth();
    onMonthChange();
  }, [goToNextMonth, onMonthChange]);

  const toggleWeekStart = useCallback(() => {
    setWeekStart(weekStart === 'mon' ? 'sun' : 'mon');
  }, [weekStart, setWeekStart]);

  return (
    <div className={styles.calendarHeader}>
      <div className={styles.headerLeft}>
        <span className={styles.monthTitle}>{monthName}</span>
        <span className={styles.yearLabel}>{viewYear}</span>
      </div>
      <div className={styles.headerRight}>
        <button
          className={styles.settingsToggle}
          onClick={toggleWeekStart}
          aria-label={`Week starts on ${weekStart === 'mon' ? 'Monday' : 'Sunday'}. Click to toggle.`}
          title={`Week start: ${weekStart === 'mon' ? 'Mon' : 'Sun'}`}
        >
          {weekStart === 'mon' ? 'Mon' : 'Sun'}
        </button>
        <button
          className={styles.navButton}
          onClick={handlePrev}
          aria-label="Previous month"
        >
          ‹
        </button>
        <button
          className={styles.navButton}
          onClick={handleNext}
          aria-label="Next month"
        >
          ›
        </button>
      </div>
    </div>
  );
});

export default CalendarHeader;
