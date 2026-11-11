import { firstName } from "@/lib/cards";
import type { AccountSummary } from "@/types/atm";
import { BoltRing } from "../bolt-ring";

export function EjectingScreen({ card }: { card: AccountSummary | null }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <BoltRing digits={0} open={false} failedAttempts={0} hasError={false} />
      <h2 ref={(element) => element?.focus()} tabIndex={-1} className="mt-8 text-3xl font-semibold tracking-[-0.02em] outline-none sm:text-4xl">
        {card ? `Thank you, ${firstName(card.cardHolder)}.` : "Thank you."}
      </h2>
      <p className="mt-3 text-lg text-steel-8">Please take your card. Your session has ended.</p>
    </div>
  );
}
