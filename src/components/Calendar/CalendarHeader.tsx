/**
 * CalendarHeader — Month name, year, navigation arrows, Today button,
 * Year view toggle, theme toggle, and settings.
 */

import { memo, useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { useCalendarStore } from '../../store/calendarStore';
import ThemeToggle from './ThemeToggle';
import styles from '../../styles/calendar.module.css';

interface CalendarHeaderProps {
  onMonthChange: () => void;
}

const CalendarHeader = memo(function CalendarHeader({ onMonthChange }: CalendarHeaderProps) {
  const viewMonth = useCalendarStore((s) => s.viewMonth);
  const viewYear = useCalendarStore((s) => s.viewYear);
  const goToPrevMonth = useCalendarStore((s) => s.goToPrevMonth);
  const goToNextMonth = useCalendarStore((s) => s.goToNextMonth);
  const goToToday = useCalendarStore((s) => s.goToToday);
  const weekStart = useCalendarStore((s) => s.weekStart);
  const setWeekStart = useCalendarStore((s) => s.setWeekStart);
  const viewMode = useCalendarStore((s) => s.viewMode);
  const toggleViewMode = useCalendarStore((s) => s.toggleViewMode);

  const monthName = format(new Date(viewYear, viewMonth, 1), 'MMMM');
  const now = useMemo(() => new Date(), []);

  // Check if we're on current month
  const isCurrentMonth = viewMonth === now.getMonth() && viewYear === now.getFullYear();

  // Distance from today in months
  const monthDistance = useMemo(() => {
    const diff = (viewYear - now.getFullYear()) * 12 + (viewMonth - now.getMonth());
    if (diff === 0) return '';
    return diff > 0 ? `+${diff}` : `${diff}`;
  }, [viewMonth, viewYear, now]);

  const handlePrev = useCallback(() => {
    if (viewMode === 'year') {
      // In year mode, just change the year directly (don't call goToMonth which forces month view)
      useCalendarStore.setState({ viewYear: viewYear - 1 });
    } else {
      goToPrevMonth();
    }
    onMonthChange();
  }, [goToPrevMonth, onMonthChange, viewMode, viewMonth, viewYear]);

  const handleNext = useCallback(() => {
    if (viewMode === 'year') {
      useCalendarStore.setState({ viewYear: viewYear + 1 });
    } else {
      goToNextMonth();
    }
    onMonthChange();
  }, [goToNextMonth, onMonthChange, viewMode, viewMonth, viewYear]);

  const toggleWeekStart = useCallback(() => {
    setWeekStart(weekStart === 'mon' ? 'sun' : 'mon');
  }, [weekStart, setWeekStart]);

  const handleTodayClick = useCallback(() => {
    goToToday();
    onMonthChange();
  }, [goToToday, onMonthChange]);

  return (
    <div className={styles.calendarHeader}>
      <div className={styles.headerLeft}>
        <span className={styles.monthTitle}>
          {viewMode === 'year' ? viewYear : monthName}
        </span>
        {viewMode === 'month' && (
          <span className={styles.yearLabel}>{viewYear}</span>
        )}
      </div>
      <div className={styles.headerRight}>
        {/* Today button — only when not on current month */}
        {!isCurrentMonth && viewMode === 'month' && (
          <button
            className={styles.todayButton}
            onClick={handleTodayClick}
            aria-label="Jump to today"
            title="Jump to today"
          >
            Today
            {monthDistance && (
              <span className={styles.todayBadge}>{monthDistance}</span>
            )}
          </button>
        )}

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Year/Month view toggle */}
        <button
          className={styles.settingsToggle}
          onClick={toggleViewMode}
          aria-label={viewMode === 'month' ? 'Switch to year view' : 'Switch to month view'}
          title={viewMode === 'month' ? 'Year view' : 'Month view'}
        >
          {viewMode === 'month' ? 'Year' : 'Month'}
        </button>

        {/* Week start toggle */}
        {viewMode === 'month' && (
          <button
            className={styles.settingsToggle}
            onClick={toggleWeekStart}
            aria-label={`Week starts on ${weekStart === 'mon' ? 'Monday' : 'Sunday'}`}
            title={`Week start: ${weekStart === 'mon' ? 'Mon' : 'Sun'}`}
          >
            {weekStart === 'mon' ? 'Mon' : 'Sun'}
          </button>
        )}

        {/* Navigation */}
        <button
          className={styles.navButton}
          onClick={handlePrev}
          aria-label={viewMode === 'year' ? 'Previous year' : 'Previous month'}
        >
          ‹
        </button>
        <button
          className={styles.navButton}
          onClick={handleNext}
          aria-label={viewMode === 'year' ? 'Next year' : 'Next month'}
        >
          ›
        </button>
      </div>
    </div>
  );
});

export default CalendarHeader;
