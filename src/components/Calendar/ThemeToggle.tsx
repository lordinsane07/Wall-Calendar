/**
 * ThemeToggle — Cycles through light, dark, and auto (seasonal) themes.
 * Applies data-theme attribute to document for CSS variable overrides.
 */

import { memo, useEffect } from 'react';
import { useCalendarStore } from '../../store/calendarStore';
import styles from '../../styles/calendar.module.css';

/** Get seasonal theme based on month */
function getSeasonalTheme(month: number): string {
  // Winter: Dec, Jan, Feb
  if (month === 11 || month <= 1) return 'winter';
  // Spring: Mar, Apr
  if (month >= 2 && month <= 4) return 'spring';
  // Summer: May, Jun, Jul
  if (month >= 5 && month <= 7) return 'summer';
  // Autumn: Aug, Sep, Oct, Nov
  return 'autumn';
}

const THEME_ICONS: Record<string, string> = {
  light: '☀️',
  dark: '🌙',
  auto: '🎨',
};

const THEME_LABELS: Record<string, string> = {
  light: 'Light theme',
  dark: 'Dark theme',
  auto: 'Seasonal theme',
};

const ThemeToggle = memo(function ThemeToggle() {
  const theme = useCalendarStore((s) => s.theme);
  const cycleTheme = useCalendarStore((s) => s.cycleTheme);
  const viewMonth = useCalendarStore((s) => s.viewMonth);

  // Apply theme to document root
  useEffect(() => {
    const resolved = theme === 'auto' ? getSeasonalTheme(viewMonth) : theme;
    document.documentElement.setAttribute('data-theme', resolved);
  }, [theme, viewMonth]);

  return (
    <button
      className={styles.themeToggle}
      onClick={cycleTheme}
      aria-label={THEME_LABELS[theme]}
      title={THEME_LABELS[theme]}
    >
      {THEME_ICONS[theme]}
    </button>
  );
});

export default ThemeToggle;
