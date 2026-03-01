import menuData from './menuData.json' assert { type: 'json' };

// Lent 2026 term week schedule.
// Each entry maps a calendar week (Mon–Sun) to its rotation week number.
// Note: the spec lists Week 3 as commencing "15 Mar" but 15 Mar 2026 is a
// Sunday — using 16 Mar (the Monday of that week) to keep weeks Mon-aligned.
const TERM_WEEKS = [
  { week: 1, start: new Date(2026, 0, 19) }, // 19 Jan (Mon)
  { week: 2, start: new Date(2026, 0, 26) }, // 26 Jan (Mon)
  { week: 3, start: new Date(2026, 1,  2) }, //  2 Feb (Mon)
  { week: 1, start: new Date(2026, 1,  9) }, //  9 Feb (Mon)
  { week: 2, start: new Date(2026, 1, 16) }, // 16 Feb (Mon)
  { week: 3, start: new Date(2026, 1, 23) }, // 23 Feb (Mon)
  { week: 1, start: new Date(2026, 2,  2) }, //  2 Mar (Mon)
  { week: 2, start: new Date(2026, 2,  9) }, //  9 Mar (Mon)
  { week: 3, start: new Date(2026, 2, 16) }, // 16 Mar (Mon)
];

const DAY_NAMES = [
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
];

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

/**
 * Returns the trough menu for the given date, or null outside of term.
 *
 * @param {Date} date
 * @returns {{
 *   week: 1|2|3,
 *   day: string,
 *   isWeekend: boolean,
 *   menu: object
 * } | null}
 */
export function getMenu(date = new Date()) {
  // Normalise to midnight local time so comparisons are date-only.
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const termWeek = TERM_WEEKS.find(({ start }) => {
    const end = new Date(start.getTime() + MS_PER_WEEK);
    return today >= start && today < end;
  });

  if (!termWeek) return null;

  const day = DAY_NAMES[today.getDay()];
  const isWeekend = day === 'saturday' || day === 'sunday';

  return {
    week: termWeek.week,
    day,
    isWeekend,
    menu: menuData[`week${termWeek.week}`][day],
  };
}
