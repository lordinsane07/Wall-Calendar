/**
 * Calendar — Root component that composes all calendar elements.
 * Handles page-flip animation, year/month toggle, keyboard navigation,
 * swipe gestures, dominant color extraction, and ink cursor system.
 */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useCalendarStore } from '../../store/calendarStore';
import { getHeroImage } from '../../data/heroImages';
import { useDominantColor } from '../../hooks/useDominantColor';
import { getTimeOfDayShadow, getWallShadow, PEN_CURSOR } from '../../lib/materialUtils';
import WallMount from './WallMount';
import CoilGraphic from './CoilGraphic';
import CalendarHeader from './CalendarHeader';
import HeroImage from './HeroImage';
import HolidaySummary from './HolidaySummary';
import CalendarGrid from './CalendarGrid';
import YearView from './YearView';
import styles from '../../styles/calendar.module.css';

const SWIPE_THRESHOLD = 50;

const Calendar = function Calendar() {
  const viewMonth = useCalendarStore((s) => s.viewMonth);
  const viewYear = useCalendarStore((s) => s.viewYear);
  const viewMode = useCalendarStore((s) => s.viewMode);
  const goToPrevMonth = useCalendarStore((s) => s.goToPrevMonth);
  const goToNextMonth = useCalendarStore((s) => s.goToNextMonth);

  const [isFlipping, setIsFlipping] = useState(false);
  const [isWobbling, setIsWobbling] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Swipe tracking
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Dynamic palette from hero image
  const hero = getHeroImage(viewMonth);
  useDominantColor(hero.url);

  // Time-of-day shadow
  const timeBasedShadow = useMemo(() => {
    const hour = new Date().getHours();
    return getTimeOfDayShadow(hour);
  }, []);

  const calendarShadow = useMemo(() => {
    return `${getWallShadow()}, ${timeBasedShadow}`;
  }, [timeBasedShadow]);

  // Month change handler — triggers page flip + wobble
  const handleMonthChange = useCallback(() => {
    setIsFlipping(true);
    setIsTransitioning(true);

    setTimeout(() => {
      setIsFlipping(false);
      setIsWobbling(true);
      setTimeout(() => setIsWobbling(false), 350);
    }, 400);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 400);
  }, []);

  // ---- KEYBOARD NAVIGATION ----
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture if user is typing in an input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      switch (e.key) {
        case 'Escape':
          useCalendarStore.getState().clearSelection();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevMonth();
          handleMonthChange();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNextMonth();
          handleMonthChange();
          break;
        case 't':
        case 'T':
          useCalendarStore.getState().goToToday();
          handleMonthChange();
          break;
        case 'y':
        case 'Y':
          useCalendarStore.getState().toggleViewMode();
          break;
        case 'p':
        case 'P':
          if (e.ctrlKey || e.metaKey) {
            // Allow browser print
            return;
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevMonth, goToNextMonth, handleMonthChange]);

  // ---- SWIPE GESTURES ----
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const touch = e.changedTouches[0];
    if (!touch) return;

    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    // Only register horizontal swipes (more X than Y movement)
    if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        goToPrevMonth();
      } else {
        goToNextMonth();
      }
      handleMonthChange();
    }

    touchStartX.current = null;
    touchStartY.current = null;
  }, [goToPrevMonth, goToNextMonth, handleMonthChange]);

  // ---- PARALLAX EFFECT ----
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!calendarRef.current) return;
    const rect = calendarRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    calendarRef.current.style.setProperty('--mouse-x', x.toFixed(3));
    calendarRef.current.style.setProperty('--mouse-y', y.toFixed(3));
  }, []);

  const rootClasses = [styles.calendarRoot];
  if (isWobbling) rootClasses.push(styles.wobble);

  return (
    <div className={styles.wallMount}>
      {/* Mounting pins */}
      <WallMount />

      {/* Calendar body */}
      <div
        ref={calendarRef}
        className={rootClasses.join(' ')}
        style={{
          boxShadow: calendarShadow,
          cursor: viewMode === 'month' ? PEN_CURSOR : 'default',
        }}
        role="application"
        aria-label={`Calendar for ${viewMonth + 1}/${viewYear}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseMove={handleMouseMove}
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
            {viewMode === 'month' ? (
              <>
                {/* Hero image */}
                <HeroImage month={viewMonth} isTransitioning={isTransitioning} />

                {/* Holiday summary strip */}
                <HolidaySummary />

                {/* Header */}
                <CalendarHeader onMonthChange={handleMonthChange} />

                {/* Grid */}
                <CalendarGrid />

                {/* Legend */}
                <div className={styles.legend}>
                  <span className={styles.legendItem}>
                    <span className={styles.legendTriangle} />
                    Multi-day Note
                  </span>
                  <span className={styles.legendItem}>
                    <span className={styles.legendCircle} />
                    Single-day Note / Event
                  </span>
                  <span className={styles.legendItem}>
                    <span className={styles.legendDiamond} />
                    <span style={{ fontSize: '0.9em', opacity: 0.9 }}>Task created today</span>
                  </span>
                </div>
              </>
            ) : (
              <>
                {/* Header (year mode) */}
                <CalendarHeader onMonthChange={handleMonthChange} />

                {/* Year overview */}
                <YearView />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
