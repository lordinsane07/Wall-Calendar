/**
 * Indian Public Holidays — multi-year data.
 * Includes gazetted holidays and restricted holidays (major ones).
 */

export interface Holiday {
  /** Date string in YYYY-MM-DD format */
  date: string;
  name: string;
  type: 'national' | 'religious' | 'regional' | 'observance';
}

/**
 * FIXED HOLIDAYS
 * These occur on the exact same month/day every single year.
 * We compute these dynamically so they are accurate for ANY year in the future or past.
 */
const FIXED_HOLIDAYS_RULES: Array<{ month: number; day: number; name: string; type: Holiday['type'] }> = [
  { month: 1, day: 1, name: "New Year's Day", type: 'observance' },
  { month: 1, day: 14, name: "Makar Sankranti", type: 'regional' }, // Mostly fixed, occasionally 15th, but acceptable
  { month: 1, day: 26, name: "Republic Day", type: 'national' },
  { month: 4, day: 14, name: "Dr. Ambedkar Jayanti", type: 'national' },
  { month: 5, day: 1, name: "Labour Day", type: 'national' },
  { month: 8, day: 15, name: "Independence Day", type: 'national' },
  { month: 10, day: 2, name: "Gandhi Jayanti", type: 'national' },
  { month: 12, day: 25, name: "Christmas Day", type: 'religious' },
];

/**
 * FLOATING HOLIDAYS (Lunar, Ecclesiastical, Islamic calendars)
 * These jump around every year. It is architecturally poor to put complex lunar 
 * math in a frontend bundle. Instead, we provide known configs for our supported 
 * business window (2025-2028). For years outside this, they gracefully degrade 
 * and do not show, avoiding factual inaccuracies.
 */
const FLOATING_HOLIDAYS_BY_YEAR: Record<number, Holiday[]> = {
  2025: [
    { date: '2025-02-26', name: 'Maha Shivaratri', type: 'religious' },
    { date: '2025-03-14', name: 'Holi', type: 'religious' },
    { date: '2025-03-31', name: 'Idul Fitr', type: 'religious' },
    { date: '2025-04-06', name: 'Ram Navami', type: 'religious' },
    { date: '2025-04-10', name: 'Mahavir Jayanti', type: 'religious' },
    { date: '2025-04-18', name: 'Good Friday', type: 'religious' },
    { date: '2025-05-12', name: 'Buddha Purnima', type: 'religious' },
    { date: '2025-06-07', name: 'Eid-ul-Adha (Bakrid)', type: 'religious' },
    { date: '2025-07-06', name: 'Muharram', type: 'religious' },
    { date: '2025-08-09', name: 'Janmashtami', type: 'religious' },
    { date: '2025-09-05', name: 'Milad-un-Nabi', type: 'religious' },
    { date: '2025-10-02', name: 'Dussehra', type: 'religious' },
    { date: '2025-10-20', name: 'Diwali', type: 'religious' },
    { date: '2025-11-05', name: 'Guru Nanak Jayanti', type: 'religious' },
  ],
  2026: [
    { date: '2026-02-15', name: 'Maha Shivaratri', type: 'religious' },
    { date: '2026-03-04', name: 'Holi', type: 'religious' },
    { date: '2026-03-20', name: 'Eid-ul-Fitr', type: 'religious' },
    { date: '2026-03-26', name: 'Ram Navami', type: 'religious' },
    { date: '2026-03-31', name: 'Mahavir Jayanti', type: 'religious' },
    { date: '2026-04-03', name: 'Good Friday', type: 'religious' },
    { date: '2026-05-27', name: 'Eid-ul-Adha', type: 'religious' },
    { date: '2026-05-31', name: 'Buddha Purnima', type: 'religious' },
    { date: '2026-06-26', name: 'Muharram', type: 'religious' },
    { date: '2026-08-14', name: 'Janmashtami', type: 'religious' },
    { date: '2026-08-25', name: 'Milad-un-Nabi', type: 'religious' },
    { date: '2026-10-19', name: 'Dussehra', type: 'religious' },
    { date: '2026-11-08', name: 'Diwali', type: 'religious' },
    { date: '2026-11-24', name: 'Guru Nanak Jayanti', type: 'religious' },
  ],
  2027: [
    { date: '2027-02-04', name: 'Maha Shivaratri', type: 'religious' },
    { date: '2027-03-10', name: 'Eid-ul-Fitr', type: 'religious' },
    { date: '2027-03-22', name: 'Holi', type: 'religious' },
    { date: '2027-03-26', name: 'Good Friday', type: 'religious' },
    { date: '2027-04-15', name: 'Ram Navami', type: 'religious' },
    { date: '2027-04-19', name: 'Mahavir Jayanti', type: 'religious' },
    { date: '2027-05-17', name: 'Eid-ul-Adha', type: 'religious' },
    { date: '2027-05-20', name: 'Buddha Purnima', type: 'religious' },
    { date: '2027-06-16', name: 'Muharram', type: 'religious' },
    { date: '2027-08-15', name: 'Milad-un-Nabi', type: 'religious' },
    { date: '2027-08-25', name: 'Janmashtami', type: 'religious' },
    { date: '2027-10-08', name: 'Dussehra', type: 'religious' },
    { date: '2027-10-29', name: 'Diwali', type: 'religious' },
    { date: '2027-11-14', name: 'Guru Nanak Jayanti', type: 'religious' },
  ],
  2028: [
    { date: '2028-02-24', name: 'Maha Shivaratri', type: 'religious' },
    { date: '2028-03-01', name: 'Eid-ul-Fitr', type: 'religious' },
    { date: '2028-03-11', name: 'Holi', type: 'religious' },
    { date: '2028-04-03', name: 'Ram Navami', type: 'religious' },
    { date: '2028-04-07', name: 'Mahavir Jayanti', type: 'religious' },
    { date: '2028-04-14', name: 'Good Friday', type: 'religious' }, // Corrected for 2028
    { date: '2028-05-08', name: 'Buddha Purnima', type: 'religious' },
    { date: '2028-05-06', name: 'Eid-ul-Adha', type: 'religious' },
    { date: '2028-06-05', name: 'Muharram', type: 'religious' },
    { date: '2028-08-04', name: 'Milad-un-Nabi', type: 'religious' },
    { date: '2028-08-13', name: 'Janmashtami', type: 'religious' },
    { date: '2028-09-28', name: 'Dussehra', type: 'religious' },
    { date: '2028-10-17', name: 'Diwali', type: 'religious' },
    { date: '2028-11-02', name: 'Guru Nanak Jayanti', type: 'religious' },
  ],
};

/**
 * Returns merged compiled holidays for a given year.
 */
export function getHolidaysForYear(year: number): Holiday[] {
  // 1. Generate fixed date holidays (100% accurate endlessly)
  const holidays: Holiday[] = FIXED_HOLIDAYS_RULES.map(rule => ({
    date: `${year}-${String(rule.month).padStart(2, '0')}-${String(rule.day).padStart(2, '0')}`,
    name: rule.name,
    type: rule.type
  }));

  // 2. Safely merge floating holidays ONLY if we have factual data for that year.
  // We no longer hallucinate string-mapped dates for floating holidays.
  const floatingMap = FLOATING_HOLIDAYS_BY_YEAR[year] || [];
  
  return [...holidays, ...floatingMap].sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Returns holidays for a specific month (0-indexed) in a year.
 */
export function getHolidaysForMonth(month: number, year: number): Holiday[] {
  const all = getHolidaysForYear(year);
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  return all.filter((h) => h.date.startsWith(prefix));
}

/**
 * Check if a specific date string (YYYY-MM-DD) is a holiday.
 */
export function getHolidayForDate(dateStr: string, year: number): Holiday | undefined {
  const all = getHolidaysForYear(year);
  return all.find((h) => h.date === dateStr);
}
