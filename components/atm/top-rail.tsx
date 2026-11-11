"use client";

import { useSyncExternalStore } from "react";

/** Minute-resolution clock shared by the rail. The server renders no time, so hydration never mismatches. */
let currentMinute = 0;
const listeners = new Set<() => void>();
let interval: number | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    const tick = () => {
      currentMinute = Math.floor(Date.now() / 60_000) * 60_000;
      listeners.forEach((notify) => notify());
    };
    tick();
    interval = window.setInterval(tick, 15_000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.clearInterval(interval);
  };
}

const timeFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export function TopRail() {
  const minute = useSyncExternalStore(subscribe, () => currentMinute, () => 0);

  return (
    <header className="flex h-16 items-center justify-between border-b border-steel-4 px-4 sm:px-8 lg:px-12">
      <div className="flex items-center gap-3">
        <VaultMonogram />
        <span className="engraved text-base tracking-[0.34em] text-ink">Northmere</span>
      </div>
      <div className="flex items-center gap-4 text-xs text-steel-8">
        <span className="hidden tabular-nums sm:inline" suppressHydrationWarning>
          {minute ? timeFormatter.format(minute) : ""}
        </span>
        <span className="rounded-full border border-steel-5 px-3 py-1 whitespace-nowrap"><span className="hidden sm:inline">Fictional bank · </span>Demo data</span>
      </div>
    </header>
  );
}

function VaultMonogram() {
  return (
    <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
      <circle cx="16" cy="16" r="14.5" fill="none" stroke="var(--color-gold)" strokeWidth="1.25" />
      {Array.from({ length: 12 }, (_, index) => (
        <rect key={index} x="15.25" y="2.6" width="1.5" height="3" rx="0.75" fill="var(--color-steel-7)" transform={`rotate(${index * 30} 16 16)`} />
      ))}
      <path d="M11 21.5V10.5L21 21.5V10.5" fill="none" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
