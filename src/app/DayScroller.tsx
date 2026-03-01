"use client";

import { useRouter } from "next/navigation";

interface Props {
  /** Formatted date string to display, e.g. "Sunday 1 March" */
  displayDate: string;
  /** ISO date (YYYY-MM-DD) for the previous day, or "today" to go to "/" */
  prevParam: string;
  /** ISO date (YYYY-MM-DD) for the next day, or "today" to go to "/" */
  nextParam: string;
  /** Menu week number (1, 2, or 3) */
  menuWeek: number;
}

export function DayScroller({ displayDate, prevParam, nextParam, menuWeek }: Props) {
  const router = useRouter();

  function go(param: string) {
    router.push(param === "today" ? "/" : `/?date=${param}`, { scroll: false });
  }

  return (
    <div className="flex items-center gap-2 mt-5">
      <button
        onClick={() => go(prevParam)}
        className="flex-none w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 flex items-center justify-center text-white transition-colors"
        aria-label="Previous day"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div className="flex-1 text-center">
        <p className="text-white text-[16px] font-medium">{displayDate}</p>
        <p className="text-white/40 text-[10px] font-sans uppercase tracking-widest mt-0.5">
          Week {menuWeek}
        </p>
      </div>

      <button
        onClick={() => go(nextParam)}
        className="flex-none w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 flex items-center justify-center text-white transition-colors"
        aria-label="Next day"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
