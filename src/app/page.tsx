// Always render server-side at request time so the date is never stale.
export const dynamic = "force-dynamic";

import Image from "next/image";
import { getMenu, getAdjacentTermDate, type MealService } from "@/lib/getMenu";
import { DayScroller } from "./DayScroller";

// ── helpers ─────────────────────────────────────────────────────────────────

/** Format a Date as YYYY-MM-DD using local time (avoids UTC shift). */
function toISO(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parse a YYYY-MM-DD string into a local midnight Date, or return null. */
function parseISO(str: string): Date | null {
  const parts = str.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

// ── ui components ────────────────────────────────────────────────────────────

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
    <div
      className="mt-3 bg-white border-x border-b border-stone-200 px-4 overflow-hidden shadow-sm"
      style={{ borderTop: "3px solid #1c2d58" }}
    >
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
  times,
  service,
  showExtras = false,
}: {
  title: string;
  times?: string;
  service: MealService;
  showExtras?: boolean;
}) {
  return (
    <section>
      <h2 className="font-display text-xl text-navy mb-0.5">{title}</h2>
      {times && (
        <p className="text-[11px] text-stone-400 font-sans mb-2">{times}</p>
      )}
      <div
        className="bg-white border-x border-b border-stone-200 px-4 overflow-hidden shadow-sm"
        style={{ borderTop: "3px solid #1c2d58" }}
      >
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
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;

  const now = new Date();
  const todayISO = toISO(now);

  // Resolve which date to display.
  const selectedDate =
    dateParam ? (parseISO(dateParam) ?? now) : now;

  // Get the menu for the selected date (null if outside term).
  const menuResult = getMenu(selectedDate);

  // Compute prev / next in-term dates for the arrows.
  // Use the sentinel "today" so the URL stays clean when landing on today.
  const prevDate   = getAdjacentTermDate(selectedDate, -1);
  const nextDate   = getAdjacentTermDate(selectedDate,  1);
  const prevParam  = toISO(prevDate) === todayISO ? "today" : toISO(prevDate);
  const nextParam  = toISO(nextDate) === todayISO ? "today" : toISO(nextDate);

  // Format for the centred date display, e.g. "Sunday 1 March".
  const displayDate = selectedDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const isWeekend =
    selectedDate.getDay() === 0 || selectedDate.getDay() === 6;

  // Sunday dinner is 5.30–6.30pm; every other day is 5.45–6.45pm.
  const dinnerTimes =
    selectedDate.getDay() === 0 ? "5.30pm – 6.30pm" : "5.45pm – 6.45pm";

  return (
    <main className="min-h-screen">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="bg-navy relative overflow-hidden">
        {/* Pembroke illustration */}
        <div className="absolute inset-y-0 right-0 w-3/4 pointer-events-none">
          <Image
            src="/pem-illustration.jpg"
            alt=""
            fill
            className="object-cover object-left opacity-25"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy from-30% via-navy/85 to-navy/40 pointer-events-none" />

        <div className="relative px-5 pt-12 pb-6 max-w-lg mx-auto">
          <h1 className="font-display text-5xl text-white leading-none">
            trough
          </h1>
          <p className="text-pem-blue text-[13px] mt-2 tracking-wide">
            Pembroke College, Cambridge
          </p>

          {/* Day navigation — only shown during term */}
          {menuResult ? (
            <DayScroller
              displayDate={displayDate}
              prevParam={prevParam}
              nextParam={nextParam}
              menuWeek={menuResult.week}
            />
          ) : (
            /* Outside term: just show today's date, no arrows */
            <p className="text-white/70 text-[14px] mt-5 font-medium">
              {now.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          )}
        </div>
      </div>

      <div className="px-4 py-6 pb-10 max-w-lg mx-auto">
        {/* ── No menu ─────────────────────────────────────────────── */}
        {!menuResult && (
          <div
            className="bg-white border-stone-200 shadow-sm px-5 py-10 text-center border"
            style={{ borderTop: "3px solid #1c2d58" }}
          >
            <p className="text-3xl mb-3">🍽️</p>
            <p className="font-semibold text-stone-700 font-sans">
              No menu today
            </p>
            <p className="text-[13px] text-stone-400 mt-1 font-sans">
              The trough is closed outside of term.
            </p>
          </div>
        )}

        {/* ── Menu ────────────────────────────────────────────────── */}
        {menuResult && (
          <div className="space-y-5">
            {isWeekend ? (
              <>
                <section>
                  <h2 className="font-display text-xl text-navy mb-0.5">
                    Brunch
                  </h2>
                  <p className="text-[11px] text-stone-400 font-sans mb-2">10am – 1.15pm</p>
                  <div
                    className="bg-white border-x border-b border-stone-200 px-4 py-4 shadow-sm"
                    style={{ borderTop: "3px solid #1c2d58" }}
                  >
                    <p className="text-[15px] text-stone-400 italic">
                      Standard brunch menu
                    </p>
                  </div>
                </section>
                <MealBlock
                  title="Dinner"
                  times={dinnerTimes}
                  service={menuResult.menu.dinner}
                  showExtras
                />
              </>
            ) : (
              <>
                {menuResult.menu.lunch && (
                  <MealBlock
                    title="Lunch"
                    times="11.45am – 1.30pm"
                    service={menuResult.menu.lunch}
                  />
                )}
                <MealBlock
                  title="Dinner"
                  times={dinnerTimes}
                  service={menuResult.menu.dinner}
                  showExtras
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="pb-8 text-center text-[11px] text-stone-400 font-sans space-y-1">
        <p>
          <a
            href="https://www.pem.cam.ac.uk/college/catering/information-students/formal-hall-menu"
            className="underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Formal Hall menus →
          </a>
        </p>
        <p>
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
        </p>
      </footer>
    </main>
  );
}
