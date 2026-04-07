/**
 * Core TypeScript interfaces for the Wall Calendar application.
 * All shared types live here — no type definitions scattered in components.
 */

/** Represents a single day cell in the calendar grid */
export interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

/** State machine states for date range selection */
export type SelectionState = 'idle' | 'selecting' | 'selected';

/** A date range with nullable start and end */
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

/** Persisted selection in localStorage */
export interface PersistedSelection {
  start: string | null;
  end: string | null;
  savedAt: number;
}

/** A user note attached to a date range */
export interface Note {
  id: string;
  rangeStart: string;
  rangeEnd: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

/** Week start preference */
export type WeekStart = 'mon' | 'sun';

/** Dominant color palette extracted from hero image */
export interface DominantPalette {
  primary: string;
  light: string;
  dark: string;
  contrastText: string;
}

/** Weather condition categories */
export type WeatherCondition = 'sunny' | 'rainy' | 'snowy' | 'foggy' | 'cloudy' | 'clear';

/** Weather data from wttr.in */
export interface WeatherData {
  tempC: string;
  condition: WeatherCondition;
  description: string;
  icon: string;
}

/** Time-of-day categories for shadow computation */
export type TimeOfDay = 'morning' | 'midday' | 'afternoon' | 'evening';

/** Hero image entry keyed by month index (0-11) */
export interface HeroImageEntry {
  url: string;
  alt: string;
  credit: string;
}
