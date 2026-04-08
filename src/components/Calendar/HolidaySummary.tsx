/**
 * HolidaySummary — Scrollable horizontal strip showing all holidays in the current month.
 * Click a holiday to highlight/scroll to that date.
 */

import { memo, useMemo } from 'react';
import { useCalendarStore } from '../../store/calendarStore';
import { getHolidaysForMonth } from '../../data/holidays';
import styles from '../../styles/calendar.module.css';

const HolidaySummary = memo(function HolidaySummary() {
  const viewMonth = useCalendarStore((s) => s.viewMonth);
  const viewYear = useCalendarStore((s) => s.viewYear);

  const holidays = useMemo(
    () => getHolidaysForMonth(viewMonth, viewYear),
    [viewMonth, viewYear]
  );

  if (holidays.length === 0) return null;

  return (
    <div className={styles.holidaySummaryBar} role="list" aria-label="Holidays this month">
      {holidays.map((h) => {
        const dayNum = parseInt(h.date.split('-')[2]!, 10);
        const typeClass =
          h.type === 'national' ? styles.hsBadgeNational :
          h.type === 'religious' ? styles.hsBadgeReligious :
          h.type === 'regional' ? styles.hsBadgeRegional :
          styles.hsBadgeObservance;

        return (
          <span
            key={h.date + h.name}
            className={`${styles.hsBadge} ${typeClass}`}
            role="listitem"
            title={h.name}
          >
            <span className={styles.hsBadgeDay}>{dayNum}</span>
            <span className={styles.hsBadgeName}>{h.name}</span>
          </span>
        );
      })}
    </div>
  );
});

export default HolidaySummary;
