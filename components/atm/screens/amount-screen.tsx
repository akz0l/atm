import { Button } from "@/components/ui/button";
import { Money } from "@/components/ui/money";
import { StatusMessage } from "@/components/ui/status-message";
import { digitsToAmount } from "@/lib/amount-entry";
import type { AccountSession, AccountSummary } from "@/types/atm";
import { SessionLayout } from "../session-layout";

export const WITHDRAWAL_PRESETS = [20, 40, 60, 100, 200, 500];

interface AmountScreenProps {
  mode: "withdraw" | "deposit";
  card: AccountSummary;
  session: AccountSession;
  entry: string;
  error: string | null;
  pending: boolean;
  onPreset: (dollars: number) => void;
  onBack: () => void;
  onEject: () => void;
}

/** Shared by withdrawals (with presets) and deposits (custom amount only). */
export function AmountScreen({ mode, card, session, entry, error, pending, onPreset, onBack, onEject }: AmountScreenProps) {
  const isWithdraw = mode === "withdraw";
  const amount = digitsToAmount(entry);

  return (
    <SessionLayout
      card={card}
      balance={session.balance}
      onEject={onEject}
      title={isWithdraw ? "Withdraw money" : "Deposit money"}
      description={
        isWithdraw
          ? "Choose an amount or type a custom one on the keypad."
          : "Type the amount on the keypad. This is a digital deposit: no cash or envelope needed."
      }
    >
      {isWithdraw ? (
        <div className="grid grid-cols-3 gap-3" role="group" aria-label="Quick amounts">
          {WITHDRAWAL_PRESETS.map((dollars) => {
            const selected = entry === String(dollars * 100);
            return (
              <button
                key={dollars}
                type="button"
                disabled={pending}
                aria-pressed={selected}
                onClick={() => onPreset(dollars)}
                className={`h-16 rounded-xl border text-xl font-medium tabular-nums transition-colors duration-200 disabled:opacity-50 ${
                  selected ? "border-gold bg-steel-4 text-ink" : "border-steel-5 bg-steel-3 text-ink hover:border-steel-6 hover:bg-steel-4"
                }`}
              >
                ${dollars}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className={`rounded-2xl border border-steel-5 bg-steel-3 p-6 sm:p-8 ${isWithdraw ? "mt-6" : ""}`}>
        <p className="engraved text-[0.6875rem] text-steel-8">{isWithdraw ? "Amount to withdraw" : "Amount to deposit"}</p>
        <p className="mt-3 flex items-end justify-between gap-4" aria-live="polite">
          <Money amount={amount} step="large" className={entry ? "text-ink" : "text-steel-7"} />
          <span className="pb-2 text-sm text-steel-8">Press Confirm or Enter</span>
        </p>
      </div>

      {error ? <StatusMessage tone="error" className="mt-5">{error}</StatusMessage> : null}

      <div className="mt-auto pt-8">
        <Button variant="secondary" onClick={onBack} disabled={pending}>
          Back to menu
        </Button>
      </div>
    </SessionLayout>
  );
}
