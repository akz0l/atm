import { StatusMessage } from "@/components/ui/status-message";
import { BoltRing } from "../bolt-ring";
import { SessionLayout } from "../session-layout";
import type { AtmState } from "../atm-reducer";
import type { AccountSummary } from "@/types/atm";

interface PinScreenProps {
  state: AtmState;
  card: AccountSummary;
  onCancel: () => void;
}

export function PinScreen({ state, card, onCancel }: PinScreenProps) {
  const unlocked = state.session !== null;

  return (
    <SessionLayout
      card={card}
      onEject={onCancel}
      ejectLabel="Cancel and eject"
      title={unlocked ? "PIN accepted" : "Enter your PIN"}
      description={unlocked ? "Opening your account…" : "Use the keypad or your keyboard, then press Confirm."}
    >
      <BoltRing digits={state.entry.length} open={unlocked} failedAttempts={state.failedAttempts} hasError={Boolean(state.error)} />
      <p className="sr-only" aria-live="polite">
        {state.entry.length} of 4 digits entered
      </p>
      <div className="mx-auto mt-8 flex w-full max-w-sm flex-col items-center gap-4 text-center">
        {state.error ? <StatusMessage tone="error">{state.error}</StatusMessage> : null}
        <p className="rounded-xl border border-steel-5 bg-steel-3 px-4 py-2.5 text-sm text-steel-8">
          Demo PIN for this card: <span className="font-semibold tracking-[0.3em] text-ink tabular-nums">{card.demoPin}</span>
        </p>
      </div>
    </SessionLayout>
  );
}
