import menuData from "@/data/menuData.json";
import formalHallData from "@/data/formalHallData.json";

// ---------------------------------------------------------------------------
// Term week schedule — Lent 2026
// Each entry maps a Mon-Sun window to its rotation week number (1, 2, or 3).
// Note: the spec lists Week 3 as commencing "15 Mar" but 15 Mar 2026 is a
// Sunday; 16 Mar (the Monday of that week) is used to keep weeks Mon-aligned.
// ---------------------------------------------------------------------------
const TERM_WEEKS: { week: 1 | 2 | 3; start: Date }[] = [
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
  "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday",
] as const;

type DayName = (typeof DAY_NAMES)[number];

export interface MealService {
  studentSpecial: string;
  alternativeDish: string;
  allergenFriendly: string;
  pudding?: string;
  sides?: string[];
}

export interface DayMenu {
  lunch?: MealService;
  brunch?: MealService;
  dinner: MealService;
}

export interface MenuResult {
  week: 1 | 2 | 3;
  day: DayName;
  isWeekend: boolean;
  menu: DayMenu;
}

const MS_PER_DAY  =     24 * 60 * 60 * 1000;
const MS_PER_WEEK = 7 * MS_PER_DAY;

/** Every calendar date that is in-term, in chronological order. */
function getAllTermDates(): Date[] {
  const dates: Date[] = [];
  for (const { start } of TERM_WEEKS) {
    for (let i = 0; i < 7; i++) {
      dates.push(new Date(start.getTime() + i * MS_PER_DAY));
    }
  }
  return dates;
}

/**
 * Returns the next (+1) or previous (−1) in-term calendar date relative to
 * the given date. Wraps: the day after the last term day is the first term day,
 * and vice versa. If the given date is outside term, returns the first term day.
 */
export function getAdjacentTermDate(date: Date, dir: 1 | -1): Date {
  const termDates = getAllTermDates();
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const idx = termDates.findIndex((td) => td.getTime() === d.getTime());
  if (idx === -1) return termDates[0]; // outside term → wrap to start
  const newIdx = (idx + dir + termDates.length) % termDates.length;
  return termDates[newIdx];
}

/**
 * Returns the trough menu for the given date, or null outside of term.
 * Strips the time component so it is safe to call at any hour of the day.
 */
// ---------------------------------------------------------------------------
// Café '84 menu — Mon–Fri only, 9 am – 4.30 pm
// ---------------------------------------------------------------------------

const CAFE_DAILY = [
  "Cookie of the day",
  "Loaf of the day",
  "Cake of the day",
  "Small treat / muffin of the day",
  "Salad or soup of the day",
];

const CAFE_HOT: Record<1 | 2 | 3, Record<string, [string, string]>> = {
  1: {
    monday:    ["Ham and cheese croissant", "Cheese and tomato croissant"],
    tuesday:   ["Chicken, peppers and cheese quesadilla", "Refried beans, peppers and onion quesadilla"],
    wednesday: ["Spinach and Cheddar swirl", "Cheese and bacon swirl"],
    thursday:  ["Trout, tomato and rocket bagel", "Smoked tofu, tomatoes and rocket bagel"],
    friday:    ["Chicken and bacon toastie", "Tomato, basil and Cheddar toastie"],
  },
  2: {
    monday:    ["Sausage roll", "Vegan sausage roll"],
    tuesday:   ["Parma ham, mozzarella and tomato panini", "Greens, tabasco and Cheddar panini"],
    wednesday: ["Cheese and chive scone", "Bacon and cheese scone"],
    thursday:  ["Chicken Caesar wrap", "Hummus, roasted red pepper and sun-dried tomato wrap"],
    friday:    ["Chicken, chorizo and peppers quesadilla", "Sweet potato, chili, goat cheese and spring onion quesadilla"],
  },
  3: {
    monday:    ["Tomato Spanish puff pastry", "Tuna and tomato Spanish puff pastry"],
    tuesday:   ["Pastrami, gherkins, mustard and cheese bagel", "Grilled halloumi, spinach and tomato bagel"],
    wednesday: ["Pulled pork, mixed peppers and cheese quesadilla", "Spicy mixed peppers and courgette quesadilla"],
    thursday:  ["BBQ beef brisket, peppers and cheese panini", "Tuna and sweetcorn melt panini"],
    friday:    ["Ham and cheese toastie", "Onion and Cheddar toastie"],
  },
};

export interface CafeMenu {
  dailyOptions: string[];
  hotFood: [string, string];
}

export function getCafeMenu(date: Date): CafeMenu | null {
  const result = getMenu(date);
  if (!result) return null;
  // Café is only open Mon–Fri
  const dayIdx = date.getDay();
  if (dayIdx === 0 || dayIdx === 6) return null;
  const hot = CAFE_HOT[result.week][result.day];
  if (!hot) return null;
  return { dailyOptions: CAFE_DAILY, hotFood: hot };
}

// ---------------------------------------------------------------------------
// Formal Hall menu — date-keyed, not on a rotation
// ---------------------------------------------------------------------------

export interface FormalHallCourse {
  dish?: string;
  description?: string;
  vegDish?: string;
  vegDescription?: string;
}

export interface FormalHallMenu {
  event: string;
  courses: FormalHallCourse[];
}

export function getFormalHall(date: Date): FormalHallMenu | null {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const key = `${y}-${m}-${day}`;
  const entry = (formalHallData as Record<string, FormalHallMenu>)[key];
  return entry ?? null;
}

export function getMenu(date: Date = new Date()): MenuResult | null {
  // Normalise to midnight local time — comparisons are date-only.
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const termWeek = TERM_WEEKS.find(({ start }) => {
    const end = new Date(start.getTime() + MS_PER_WEEK);
    return today >= start && today < end;
  });

  if (!termWeek) return null;

  const day = DAY_NAMES[today.getDay()];
  const isWeekend = day === "saturday" || day === "sunday";
  const weekKey = `week${termWeek.week}` as keyof typeof menuData;

  return {
    week: termWeek.week,
    day,
    isWeekend,
    menu: menuData[weekKey][day as keyof (typeof menuData)[typeof weekKey]] as unknown as DayMenu,
  };
}
