import { PaymentCard } from "@/components/cards/payment-card";
import type { AccountSummary } from "@/types/atm";

export type SlotPhase = "awaiting" | "reading" | "inserted" | "ejecting";

const STATUS: Record<SlotPhase, string> = {
  awaiting: "Insert your card",
  reading: "Reading card…",
  inserted: "Card inserted",
  ejecting: "Please take your card",
};

interface CardSlotProps {
  phase: SlotPhase;
  card: AccountSummary | null;
}

export function CardSlot({ phase, card }: CardSlotProps) {
  const lit = phase !== "inserted";

  return (
    <div className="rounded-2xl border border-steel-4 bg-steel-2 px-5 pt-5 pb-4" data-card-slot>
      <div className="flex items-center justify-between">
        <span className="engraved text-[0.6875rem] text-steel-8">Card slot</span>
        <span className="text-xs text-steel-8" aria-live="polite">
          {STATUS[phase]}
          {phase === "inserted" && card ? ` ····${card.cardLast4}` : ""}
        </span>
      </div>

      {/* The ejected card rises out of the slot, clipped at the slot line. */}
      <div className="relative mt-3 h-16 overflow-hidden">
        {phase === "ejecting" && card ? (
          <div className="absolute inset-x-6 top-1 animate-card-eject">
            <PaymentCard cardType={card.cardType} cardHolder={card.cardHolder} cardLast4={card.cardLast4} decorative />
          </div>
        ) : null}
      </div>
      <div className="relative h-3.5 overflow-hidden rounded-full border border-steel-5 bg-steel-0" data-card-slot-mouth>
        {lit ? (
          <span
            aria-hidden
            className={`absolute top-1 h-1 rounded-full bg-gold ${
              phase === "reading" ? "left-0 w-1/3 animate-slot-read" : "left-1/4 w-1/2 animate-slot-pulse"
            }`}
          />
        ) : null}
      </div>
    </div>
  );
}
