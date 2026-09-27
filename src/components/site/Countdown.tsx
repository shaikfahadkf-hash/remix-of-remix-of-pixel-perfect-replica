import { useEffect, useState } from "react";

const DEADLINE = new Date("2026-10-07T23:59:59+05:30").getTime();

function diff() {
  const ms = Math.max(0, DEADLINE - Date.now());
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

export function Countdown() {
  const [time, setTime] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setTime(diff());
    const id = setInterval(() => setTime(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  const units: [string, number][] = [
    ["Days", time?.days ?? 0],
    ["Hours", time?.hours ?? 0],
    ["Minutes", time?.minutes ?? 0],
    ["Seconds", time?.seconds ?? 0],
  ];

  return (
    <div className="glass surface-lift mx-auto w-full max-w-3xl rounded-3xl p-6 sm:p-8">
      <p className="section-label text-center">Applications close 7 October 2026</p>
      <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-4">
        {units.map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl bg-secondary/60 px-2 py-4 text-center sm:px-4"
          >
            <div className="font-display text-2xl font-bold tabular-nums sm:text-4xl">
              {time === null ? "--" : String(value).padStart(2, "0")}
            </div>
            <div className="mt-1 text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
