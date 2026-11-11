import { useId } from "react";

/** EMV chip drawn as geometry: a gold plate with its contact pads. */
export function CardChip({ className = "" }: { className?: string }) {
  const gradientId = useId();

  return (
    <svg viewBox="0 0 50 38" className={className} aria-hidden>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f1dfa6" />
          <stop offset="45%" stopColor="#c9a65a" />
          <stop offset="100%" stopColor="#8c6d2c" />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="49" height="37" rx="7" fill={`url(#${gradientId})`} stroke="rgba(40,28,6,0.35)" />
      <path
        d="M0 13h16M0 25h16M34 13h16M34 25h16M16 0v38M34 0v38M16 19h18"
        stroke="rgba(70,48,10,0.5)"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}
