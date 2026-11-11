/** Simplified network marks for the fictional demo cards. */

export function VisaMark() {
  return (
    <span className="text-[8.5cqw] leading-none font-black tracking-[-0.03em] text-[#1a1f71] italic" aria-hidden>
      VISA
    </span>
  );
}

export function AmexMark() {
  return (
    <span
      className="grid size-[15cqw] place-items-center rounded-[1cqw] bg-[#016fd0] text-center text-[2.5cqw] leading-[1.05] font-black tracking-[0.02em] text-white"
      aria-hidden
    >
      AMERICAN
      <br />
      EXPRESS
    </span>
  );
}

export function MastercardMark() {
  return (
    <svg viewBox="0 0 38 24" className="w-[15cqw]" aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#eb001b" />
      <circle cx="26" cy="12" r="12" fill="#f79e1b" />
      <path d="M19 2.25A12 12 0 0 1 19 21.75A12 12 0 0 1 19 2.25Z" fill="#ff5f00" />
    </svg>
  );
}
