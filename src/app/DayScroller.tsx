"use client";

import { useRouter } from "next/navigation";

const DAYS: { key: string; label: string }[] = [
  { key: "monday",    label: "Mon" },
  { key: "tuesday",   label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday",  label: "Thu" },
  { key: "friday",    label: "Fri" },
  { key: "saturday",  label: "Sat" },
  { key: "sunday",    label: "Sun" },
];

interface Props {
  /** The day currently being displayed. */
  activeDay: string;
  /** The actual calendar day (shows a dot indicator). */
  todayDay: string;
}

export function DayScroller({ activeDay, todayDay }: Props) {
  const router = useRouter();

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-1 pt-0.5">
      {DAYS.map(({ key, label }) => {
        const isActive = key === activeDay;
        const isToday  = key === todayDay;

        return (
          <button
            key={key}
            onClick={() =>
              // Navigating back to today cleans up the URL
              router.push(key === todayDay ? "/" : `/?day=${key}`, {
                scroll: false,
              })
            }
            className={[
              "flex-none rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors whitespace-nowrap",
              isActive
                ? "bg-white text-navy"
                : "bg-white/10 border border-white/25 text-white/70 active:bg-white/20",
            ].join(" ")}
          >
            {label}
            {/* Dot marks the real calendar day */}
            {isToday && (
              <span
                className={`ml-0.5 text-[7px] align-middle ${
                  isActive ? "text-navy/40" : "text-white/40"
                }`}
              >
                ●
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
