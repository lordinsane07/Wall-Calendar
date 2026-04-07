/**
 * Indian Public Holidays — multi-year data.
 * Includes gazetted holidays and restricted holidays (major ones).
 */

export interface Holiday {
  /** Date string in YYYY-MM-DD format */
  date: string;
  /** Holiday name */
  name: string;
  /** Category for color coding */
  type: 'national' | 'religious' | 'regional' | 'observance';
}

/**
 * Returns holidays for a given year. Covers 2025–2027.
 * Falls back to 2026 data for unknown years (dates shift but names stay).
 */
export function getHolidaysForYear(year: number): Holiday[] {
  const data = holidaysByYear[year] ?? holidaysByYear[2026] ?? [];
  return data;
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

const holidaysByYear: Record<number, Holiday[]> = {
  2025: [
    { date: '2025-01-01', name: 'New Year\'s Day', type: 'observance' },
    { date: '2025-01-14', name: 'Makar Sankranti / Pongal', type: 'regional' },
    { date: '2025-01-26', name: 'Republic Day', type: 'national' },
    { date: '2025-02-26', name: 'Maha Shivaratri', type: 'religious' },
    { date: '2025-03-14', name: 'Holi', type: 'religious' },
    { date: '2025-03-30', name: 'Eid-ul-Fitr', type: 'religious' },
    { date: '2025-03-31', name: 'Idul Fitr', type: 'religious' },
    { date: '2025-04-06', name: 'Ram Navami', type: 'religious' },
    { date: '2025-04-10', name: 'Mahavir Jayanti', type: 'religious' },
    { date: '2025-04-14', name: 'Dr. Ambedkar Jayanti', type: 'national' },
    { date: '2025-04-18', name: 'Good Friday', type: 'religious' },
    { date: '2025-05-01', name: 'May Day / Labour Day', type: 'national' },
    { date: '2025-05-12', name: 'Buddha Purnima', type: 'religious' },
    { date: '2025-06-07', name: 'Eid-ul-Adha (Bakrid)', type: 'religious' },
    { date: '2025-07-06', name: 'Muharram', type: 'religious' },
    { date: '2025-08-09', name: 'Janmashtami', type: 'religious' },
    { date: '2025-08-15', name: 'Independence Day', type: 'national' },
    { date: '2025-08-16', name: 'Parsi New Year', type: 'religious' },
    { date: '2025-09-05', name: 'Milad-un-Nabi', type: 'religious' },
    { date: '2025-10-02', name: 'Gandhi Jayanti', type: 'national' },
    { date: '2025-10-02', name: 'Dussehra', type: 'religious' },
    { date: '2025-10-20', name: 'Diwali', type: 'religious' },
    { date: '2025-10-21', name: 'Diwali (Day 2)', type: 'religious' },
    { date: '2025-10-22', name: 'Govardhan Puja', type: 'religious' },
    { date: '2025-10-23', name: 'Bhai Dooj', type: 'religious' },
    { date: '2025-11-01', name: 'Kannada Rajyotsava', type: 'regional' },
    { date: '2025-11-05', name: 'Guru Nanak Jayanti', type: 'religious' },
    { date: '2025-12-25', name: 'Christmas Day', type: 'religious' },
  ],
  2026: [
    { date: '2026-01-01', name: 'New Year\'s Day', type: 'observance' },
    { date: '2026-01-14', name: 'Makar Sankranti / Pongal', type: 'regional' },
    { date: '2026-01-26', name: 'Republic Day', type: 'national' },
    { date: '2026-02-15', name: 'Maha Shivaratri', type: 'religious' },
    { date: '2026-03-04', name: 'Holi', type: 'religious' },
    { date: '2026-03-20', name: 'Eid-ul-Fitr', type: 'religious' },
    { date: '2026-03-26', name: 'Ram Navami', type: 'religious' },
    { date: '2026-03-31', name: 'Mahavir Jayanti', type: 'religious' },
    { date: '2026-04-03', name: 'Good Friday', type: 'religious' },
    { date: '2026-04-14', name: 'Dr. Ambedkar Jayanti', type: 'national' },
    { date: '2026-05-01', name: 'May Day / Labour Day', type: 'national' },
    { date: '2026-05-31', name: 'Buddha Purnima', type: 'religious' },
    { date: '2026-05-27', name: 'Eid-ul-Adha (Bakrid)', type: 'religious' },
    { date: '2026-06-26', name: 'Muharram', type: 'religious' },
    { date: '2026-08-14', name: 'Janmashtami', type: 'religious' },
    { date: '2026-08-15', name: 'Independence Day', type: 'national' },
    { date: '2026-08-25', name: 'Milad-un-Nabi', type: 'religious' },
    { date: '2026-09-26', name: 'Parsi New Year', type: 'regional' },
    { date: '2026-10-02', name: 'Gandhi Jayanti', type: 'national' },
    { date: '2026-10-19', name: 'Dussehra', type: 'religious' },
    { date: '2026-11-08', name: 'Diwali', type: 'religious' },
    { date: '2026-11-09', name: 'Govardhan Puja', type: 'religious' },
    { date: '2026-11-10', name: 'Bhai Dooj', type: 'religious' },
    { date: '2026-11-24', name: 'Guru Nanak Jayanti', type: 'religious' },
    { date: '2026-12-25', name: 'Christmas Day', type: 'religious' },
  ],
  2027: [
    { date: '2027-01-01', name: 'New Year\'s Day', type: 'observance' },
    { date: '2027-01-14', name: 'Makar Sankranti / Pongal', type: 'regional' },
    { date: '2027-01-26', name: 'Republic Day', type: 'national' },
    { date: '2027-02-04', name: 'Maha Shivaratri', type: 'religious' },
    { date: '2027-03-22', name: 'Holi', type: 'religious' },
    { date: '2027-03-10', name: 'Eid-ul-Fitr', type: 'religious' },
    { date: '2027-03-15', name: 'Ram Navami', type: 'religious' },
    { date: '2027-03-26', name: 'Good Friday', type: 'religious' },
    { date: '2027-04-14', name: 'Dr. Ambedkar Jayanti', type: 'national' },
    { date: '2027-04-19', name: 'Mahavir Jayanti', type: 'religious' },
    { date: '2027-05-01', name: 'May Day / Labour Day', type: 'national' },
    { date: '2027-05-17', name: 'Eid-ul-Adha (Bakrid)', type: 'religious' },
    { date: '2027-05-20', name: 'Buddha Purnima', type: 'religious' },
    { date: '2027-06-16', name: 'Muharram', type: 'religious' },
    { date: '2027-08-15', name: 'Independence Day', type: 'national' },
    { date: '2027-08-25', name: 'Janmashtami', type: 'religious' },
    { date: '2027-08-15', name: 'Milad-un-Nabi', type: 'religious' },
    { date: '2027-10-02', name: 'Gandhi Jayanti', type: 'national' },
    { date: '2027-10-08', name: 'Dussehra', type: 'religious' },
    { date: '2027-10-29', name: 'Diwali', type: 'religious' },
    { date: '2027-10-30', name: 'Govardhan Puja', type: 'religious' },
    { date: '2027-10-31', name: 'Bhai Dooj', type: 'religious' },
    { date: '2027-11-14', name: 'Guru Nanak Jayanti', type: 'religious' },
    { date: '2027-12-25', name: 'Christmas Day', type: 'religious' },
  ],
};
