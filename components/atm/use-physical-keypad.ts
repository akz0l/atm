"use client";

import { useEffect, useEffectEvent } from "react";

interface KeypadHandlers {
  onDigit: (digit: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onConfirm: () => void;
}

/** Mirrors the on-screen keypad on the physical keyboard: digits, Backspace, Escape, Enter. */
export function usePhysicalKeypad(enabled: boolean, handlers: KeypadHandlers) {
  const handleKey = useEffectEvent((event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      handlers.onDigit(event.key);
    } else if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      handlers.onDelete();
    } else if (event.key === "Escape") {
      handlers.onClear();
    } else if (event.key === "Enter") {
      // A focused button handles Enter itself; avoid triggering it twice.
      if (event.target instanceof HTMLButtonElement) return;
      event.preventDefault();
      handlers.onConfirm();
    }
  });

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [enabled]);
}
