import { useEffect, useState } from "react";
import { Clock3, Globe2 } from "lucide-react";

const timeZones = [
  { city: "الدار البيضاء", country: "المغرب", zone: "Africa/Casablanca" },
  { city: "باريس", country: "فرنسا", zone: "Europe/Paris" },
  { city: "نيويورك", country: "الولايات المتحدة", zone: "America/New_York" },
  { city: "طوكيو", country: "اليابان", zone: "Asia/Tokyo" },
];

function getTime(zone, options) {
  return new Intl.DateTimeFormat("ar-MA", { timeZone: zone, ...options }).format(new Date());
}

export default function WorldClock() {
  const [now, setNow] = useState(() => Date.now());
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const date = new Intl.DateTimeFormat("ar-MA", {
    timeZone: "Africa/Casablanca",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  return (
    <aside className="fixed bottom-4 left-4 z-40 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/70 bg-white/95 text-right shadow-[0_18px_55px_rgba(20,40,32,.2)] backdrop-blur-xl sm:bottom-6 sm:left-6" dir="rtl" aria-label="الساعة العالمية">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right transition hover:bg-[#f8f7f2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#c49a62]"
        aria-expanded={expanded}
        aria-controls="world-clock-list"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#245c4b] text-white"><Clock3 className="h-5 w-5" aria-hidden="true" /></span>
          <span className="min-w-0">
            <span className="block text-xs font-medium text-[#788078]">الوقت الآن · الدار البيضاء</span>
            <span className="mt-0.5 block font-mono text-2xl font-semibold tracking-wider text-[#23332d]" aria-live="off">
              {getTime("Africa/Casablanca", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
            </span>
          </span>
        </span>
        <Globe2 className="h-5 w-5 shrink-0 text-[#b76d54]" aria-hidden="true" />
      </button>

      <div className="border-t border-[#eeeae1] px-5 py-3">
        <p className="text-xs text-[#788078]">{date}</p>
      </div>

      {expanded && (
        <div id="world-clock-list" className="border-t border-[#eeeae1] px-5 pb-2" role="region" aria-label="الوقت في مدن العالم">
          {timeZones.slice(1).map(({ city, country, zone }) => (
            <div key={zone} className="flex items-center justify-between gap-3 border-b border-[#f0ede7] py-3 last:border-0">
              <div>
                <p className="text-sm font-semibold text-[#23332d]">{city}</p>
                <p className="mt-0.5 text-xs text-[#788078]">{country} · {getTime(zone, { timeZoneName: "short" })}</p>
              </div>
              <time className="font-mono text-lg font-semibold tabular-nums text-[#245c4b]" dateTime={new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(now)}>
                {getTime(zone, { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
              </time>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
