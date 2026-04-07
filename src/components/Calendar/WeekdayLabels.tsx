/**
 * WeekdayLabels — Column headers: MON TUE WED THU FRI SAT SUN
 * All-caps, small, letter-spaced. Weekend days in accent red.
 */

import { memo } from 'react';
import { useCalendarStore } from '../../store/calendarStore';
import { getWeekdayLabels } from '../../lib/dateUtils';
import styles from '../../styles/calendar.module.css';

const WeekdayLabels = memo(function WeekdayLabels() {
  const weekStart = useCalendarStore((s) => s.weekStart);
  const labels = getWeekdayLabels(weekStart);

  return (
    <div className={styles.weekdayLabels} role="row" aria-label="Weekday headers">
      {labels.map((label) => {
        const isWeekend = label === 'SAT' || label === 'SUN';
        return (
          <div
            key={label}
            className={`${styles.weekdayLabel} ${isWeekend ? styles.weekend : ''}`}
            role="columnheader"
            aria-label={label}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
});

export default WeekdayLabels;
