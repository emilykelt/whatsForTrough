// Always render server-side at request time so the date is never stale.
export const dynamic = "force-dynamic";

import Image from "next/image";
import { getMenu, type MealService } from "@/lib/getMenu";
import menuData from "@/data/menuData.json";
import { DayScroller } from "./DayScroller";

// ── types ────────────────────────────────────────────────────────────────────

// Date.getDay() order (0 = Sunday)
const ALL_DAYS = [
  "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday",
] as const;
type DayName = (typeof ALL_DAYS)[number];

type DayMenu = {
  lunch?: MealService;
  brunch?: MealService;
  dinner: MealService;
};

// ── helpers ─────────────────────────────────────────────────────────────────

function Dish({ label, name }: { label: string; name: string }) {
  return (
    <div className="py-3 border-b border-stone-100 last:border-0">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-pem-blue mb-0.5 font-sans">
        {label}
      </p>
      <p className="text-[15px] leading-snug text-stone-800">{name}</p>
    </div>
  );
}

function ExtrasBlock({ service }: { service: MealService }) {
  if (!service.pudding && !service.sides?.length) return null;
  return (
    <div className="mt-3 bg-white border-x border-b border-stone-200 px-4 overflow-hidden shadow-sm" style={{ borderTop: "3px solid #1c2d58" }}>
      {service.pudding && (
        <div className="py-3 border-b border-stone-100 last:border-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-pem-blue mb-0.5 font-sans">
            Pudding
          </p>
          <p className="text-[15px] text-stone-800">{service.pudding}</p>
        </div>
      )}
      {service.sides && service.sides.length > 0 && (
        <div className="py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-pem-blue mb-2 font-sans">
            Sides
          </p>
          <ul className="list-disc list-inside space-y-0.5">
            {service.sides.map((side) => (
              <li key={side} className="text-[14px] text-stone-700">
                {side}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MealBlock({
  title,
  service,
  showExtras = false,
}: {
  title: string;
  service: MealService;
  showExtras?: boolean;
}) {
  return (
    <section>
      <h2 className="font-display text-xl text-navy mb-2">
        {title}
      </h2>
      <div className="bg-white border-x border-b border-stone-200 px-4 overflow-hidden shadow-sm" style={{ borderTop: "3px solid #1c2d58" }}>
        <Dish label="Student Special" name={service.studentSpecial} />
        <Dish label="Alternative" name={service.alternativeDish} />
        <Dish label="Allergen Friendly" name={service.allergenFriendly} />
      </div>
      {showExtras && <ExtrasBlock service={service} />}
    </section>
  );
}

// ── page ────────────────────────────────────────────────────────────────────

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ day?: string }>;
}) {
  const { day: dayParam } = await searchParams;

  const now = new Date();

  // Always derive the week number from today's real date.
  const todayResult = getMenu(now);
  const todayDayName = ALL_DAYS[now.getDay()];

  // Validate the requested day; fall back to today.
  const requestedDay: DayName =
    dayParam && (ALL_DAYS as readonly string[]).includes(dayParam)
      ? (dayParam as DayName)
      : todayDayName;

  const isToday = requestedDay === todayDayName;

  // Look up the chosen day's menu from the current term week.
  let displayMenu: DayMenu | null = null;
  if (todayResult) {
    const weekKey = `week${todayResult.week}` as keyof typeof menuData;
    displayMenu = menuData[weekKey][
      requestedDay as keyof (typeof menuData)[typeof weekKey]
    ] as unknown as DayMenu;
  }

  const isWeekend = requestedDay === "saturday" || requestedDay === "sunday";

  // Header date string: full date for today, just the day name otherwise.
  const dateString = isToday
    ? now.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : requestedDay.charAt(0).toUpperCase() + requestedDay.slice(1);

  return (
    <main className="min-h-screen">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="bg-navy relative overflow-hidden">
        {/* Pembroke illustration — positioned right, fades into navy */}
        <div className="absolute inset-y-0 right-0 w-3/4 pointer-events-none">
          <Image
            src="/pem-illustration.jpg"
            alt=""
            fill
            className="object-cover object-left opacity-25"
            priority
          />
        </div>
        {/* Gradient: solid navy left → transparent right */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy from-30% via-navy/85 to-navy/40 pointer-events-none" />

        <div className="relative px-5 pt-12 pb-5 max-w-lg mx-auto">
          <h1 className="font-display text-5xl text-white leading-none">
            trough
          </h1>
          <p className="text-pem-blue text-[13px] mt-2 tracking-wide">
            Pembroke College, Cambridge
          </p>

          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-white/80 text-[13px] font-medium">
              {dateString}
            </span>
            {todayResult && (
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-white/10 text-white/60 px-2.5 py-0.5 rounded-full">
                Week {todayResult.week}
              </span>
            )}
          </div>

          {/* Day scroller — only shown during term */}
          {todayResult && (
            <div className="mt-4">
              <DayScroller
                activeDay={requestedDay}
                todayDay={todayDayName}
              />
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-6 pb-10 max-w-lg mx-auto">
        {/* ── No menu ─────────────────────────────────────────────── */}
        {!todayResult && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm px-5 py-10 text-center">
            <p className="text-3xl mb-3">🍽️</p>
            <p className="font-semibold text-stone-700 font-sans">No menu today</p>
            <p className="text-[13px] text-stone-400 mt-1 font-sans">
              The trough is closed outside of term.
            </p>
          </div>
        )}

        {/* ── Menu ────────────────────────────────────────────────── */}
        {todayResult && displayMenu && (
          <div className="space-y-5">
            {isWeekend ? (
              /* Weekend: standard brunch note, then full dinner service */
              <>
                <section>
                  <h2 className="font-display text-xl text-navy mb-2">
                    Brunch
                  </h2>
                  <div className="bg-white border-x border-b border-stone-200 px-4 py-4 shadow-sm" style={{ borderTop: "3px solid #1c2d58" }}>
                    <p className="text-[15px] text-stone-400 italic">Standard brunch menu</p>
                  </div>
                </section>
                {displayMenu.dinner && (
                  <MealBlock
                    title="Dinner"
                    service={displayMenu.dinner}
                    showExtras
                  />
                )}
              </>
            ) : (
              /* Weekday: lunch then dinner */
              <>
                {displayMenu.lunch && (
                  <MealBlock title="Lunch" service={displayMenu.lunch} />
                )}
                {displayMenu.dinner && (
                  <MealBlock
                    title="Dinner"
                    service={displayMenu.dinner}
                    showExtras
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="pb-8 text-center text-[11px] text-stone-400 font-sans">
        Menu data from{" "}
        <a
          href="https://www.pem.cam.ac.uk/catering"
          className="underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pembroke College Catering
        </a>
        . Not an official Pembroke service.
      </footer>
    </main>
  );
}
