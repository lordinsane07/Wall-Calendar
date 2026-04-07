/**
 * Calendar — Root component that composes all calendar elements.
 * Handles page-flip animation, paper wobble, time-of-day shadow,
 * dominant color extraction, and ink cursor system.
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useCalendarStore } from '../../store/calendarStore';
import { getHeroImage } from '../../data/heroImages';
import { useDominantColor } from '../../hooks/useDominantColor';
import { getTimeOfDayShadow, getWallShadow, PEN_CURSOR } from '../../lib/materialUtils';
import WallMount from './WallMount';
import CoilGraphic from './CoilGraphic';
import CalendarHeader from './CalendarHeader';
import HeroImage from './HeroImage';
import CalendarGrid from './CalendarGrid';
import styles from '../../styles/calendar.module.css';

const Calendar = function Calendar() {
  const viewMonth = useCalendarStore((s) => s.viewMonth);
  const viewYear = useCalendarStore((s) => s.viewYear);

  const [isFlipping, setIsFlipping] = useState(false);
  const [isWobbling, setIsWobbling] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Dynamic palette from hero image
  const hero = getHeroImage(viewMonth);
  useDominantColor(hero.url);

  // Time-of-day shadow — computed once on mount
  const timeBasedShadow = useMemo(() => {
    const hour = new Date().getHours();
    return getTimeOfDayShadow(hour);
  }, []);

  // Combined shadow: wall shadow + time-based overlay
  const calendarShadow = useMemo(() => {
    return `${getWallShadow()}, ${timeBasedShadow}`;
  }, [timeBasedShadow]);

  // Month change handler — triggers page flip + wobble
  const handleMonthChange = useCallback(() => {
    setIsFlipping(true);
    setIsTransitioning(true);

    setTimeout(() => {
      setIsFlipping(false);
      // Trigger paper settle wobble after flip completes
      setIsWobbling(true);
      setTimeout(() => setIsWobbling(false), 350);
    }, 400);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 400);
  }, []);

  // Keyboard escape to clear selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        useCalendarStore.getState().clearSelection();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const rootClasses = [styles.calendarRoot];
  if (isWobbling) rootClasses.push(styles.wobble);

  return (
    <div className={styles.wallMount}>
      {/* Mounting pins */}
      <WallMount />

      {/* Calendar body */}
      <div
        className={rootClasses.join(' ')}
        style={{
          boxShadow: calendarShadow,
          cursor: PEN_CURSOR,
        }}
        role="application"
        aria-label={`Calendar for ${viewMonth + 1}/${viewYear}`}
      >
        {/* Coil */}
        <div className={styles.coilArea}>
          <CoilGraphic />
        </div>

        {/* Page flip wrapper */}
        <div className={styles.pageFlipContainer}>
          <div
            className={`${styles.pageFlipInner} ${isFlipping ? styles.flipping : ''}`}
          >
            {/* Hero image */}
            <HeroImage month={viewMonth} isTransitioning={isTransitioning} />

            {/* Header */}
            <CalendarHeader onMonthChange={handleMonthChange} />

            {/* Grid (includes weekday labels) */}
            <CalendarGrid />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
