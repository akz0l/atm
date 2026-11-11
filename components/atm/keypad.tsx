import { Delete, LoaderCircle } from "lucide-react";

interface KeypadProps {
  enabled: boolean;
  pending: boolean;
  canConfirm: boolean;
  confirmLabel: string;
  onDigit: (digit: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onConfirm: () => void;
}

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

const KEY_CLASS =
  "flex h-14 items-center justify-center rounded-xl border border-steel-5 bg-steel-4 text-ink transition-[background-color,transform] duration-150 hover:bg-steel-5 active:translate-y-px active:bg-steel-6 disabled:border-steel-4 disabled:bg-steel-3 disabled:text-steel-6";

export function Keypad({ enabled, pending, canConfirm, confirmLabel, onDigit, onDelete, onClear, onConfirm }: KeypadProps) {
  const keysDisabled = !enabled || pending;

  return (
    <div className="rounded-2xl border border-steel-4 bg-steel-2 p-5" role="group" aria-label="Keypad">
      <div className="grid grid-cols-3 gap-2.5">
        {DIGITS.map((digit) => (
          <button key={digit} type="button" className={`${KEY_CLASS} text-2xl tabular-nums`} disabled={keysDisabled} onClick={() => onDigit(digit)}>
            {digit}
          </button>
        ))}
        <button type="button" className={`${KEY_CLASS} engraved text-[0.6875rem]`} disabled={keysDisabled} onClick={onClear}>
          Clear
        </button>
        <button type="button" className={`${KEY_CLASS} text-2xl tabular-nums`} disabled={keysDisabled} onClick={() => onDigit("0")}>
          0
        </button>
        <button type="button" className={KEY_CLASS} disabled={keysDisabled} onClick={onDelete} aria-label="Delete last digit">
          <Delete aria-hidden className="size-5" strokeWidth={1.75} />
        </button>
      </div>
      <button
        type="button"
        onClick={onConfirm}
        disabled={keysDisabled || !canConfirm}
        className="mt-2.5 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gold text-[0.9375rem] font-semibold text-steel-1 transition-colors duration-200 hover:bg-gold-bright disabled:bg-steel-3 disabled:text-steel-6"
      >
        {pending ? <LoaderCircle aria-hidden className="size-5 animate-spin" /> : null}
        {pending ? "Processing…" : confirmLabel}
      </button>
      <p className="mt-3 text-center text-xs text-steel-7">
        {enabled ? "Keyboard works too: digits, Backspace, Esc, Enter" : "Keypad is inactive on this screen"}
      </p>
    </div>
  );
}
