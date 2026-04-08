/**
 * YearView — 12 mini-calendar grids in a 4×3 layout.
 * Shows weekends, holidays, today, and events at a glance.
 * Click any month to zoom into month view.
 */

import { memo, useMemo } from 'react';
import { useCalendarStore } from '../../store/calendarStore';
import { getCalendarDays } from '../../lib/dateUtils';
import { getHolidaysForMonth } from '../../data/holidays';
import styles from '../../styles/calendar.module.css';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const YearView = memo(function YearView() {
  const viewYear = useCalendarStore((s) => s.viewYear);
  const goToMonth = useCalendarStore((s) => s.goToMonth);
  const weekStart = useCalendarStore((s) => s.weekStart);
  const events = useCalendarStore((s) => s.events);

  const today = useMemo(() => new Date(), []);

  return (
    <div className={styles.yearViewContainer}>
      <div className={styles.yearViewTitle}>{viewYear}</div>
      <div className={styles.yearGrid}>
        {Array.from({ length: 12 }, (_, monthIdx) => (
          <MiniMonth
            key={monthIdx}
            month={monthIdx}
            year={viewYear}
            weekStart={weekStart}
            today={today}
            events={events}
            onClick={() => goToMonth(monthIdx, viewYear)}
          />
        ))}
      </div>
    </div>
  );
});

interface MiniMonthProps {
  month: number;
  year: number;
  weekStart: string;
  today: Date;
  events: { date: string }[];
  onClick: () => void;
}

const MiniMonth = memo(function MiniMonth({
  month, year, weekStart, today, events, onClick,
}: MiniMonthProps) {
  const days = useMemo(
    () => getCalendarDays(year, month, weekStart as 'mon' | 'sun'),
    [year, month, weekStart]
  );

  const holidays = useMemo(
    () => new Set(getHolidaysForMonth(month, year).map((h) => h.date)),
    [month, year]
  );

  const eventDates = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    return new Set(events.filter((e) => e.date.startsWith(prefix)).map((e) => e.date));
  }, [events, month, year]);

  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

  return (
    <button
      className={`${styles.miniMonth} ${isCurrentMonth ? styles.miniMonthCurrent : ''}`}
      onClick={onClick}
      aria-label={`${MONTH_NAMES[month]} ${year}`}
    >
      <div className={styles.miniMonthName}>{MONTH_NAMES[month]}</div>
      <div className={styles.miniMonthHeader}>
        {DAY_LABELS.map((d, i) => (
          <span key={i} className={i >= 5 ? styles.miniWeekend : ''}>{d}</span>
        ))}
      </div>
      <div className={styles.miniMonthGrid}>
        {days.map((day, i) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day.dayOfMonth).padStart(2, '0')}`;
          const isToday = day.isToday && day.isCurrentMonth;
          const isHoliday = day.isCurrentMonth && holidays.has(dateStr);
          const hasEvent = day.isCurrentMonth && eventDates.has(dateStr);

          let cls = styles.miniDay;
          if (!day.isCurrentMonth) cls += ` ${styles.miniDayOther}`;
          if (isToday) cls += ` ${styles.miniDayToday}`;
          if (isHoliday) cls += ` ${styles.miniDayHoliday}`;
          if (day.isWeekend && day.isCurrentMonth) cls += ` ${styles.miniDayWeekend}`;
          if (hasEvent) cls += ` ${styles.miniDayEvent}`;

          return (
            <span key={i} className={cls}>
              {day.isCurrentMonth ? day.dayOfMonth : ''}
            </span>
          );
        })}
      </div>
    </button>
  );
});

export default YearView;
