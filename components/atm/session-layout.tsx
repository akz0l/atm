import { Eject } from "lucide-react";
import type { ReactNode } from "react";
import { PaymentCard } from "@/components/cards/payment-card";
import { Money } from "@/components/ui/money";
import { CARD_NAMES } from "@/lib/cards";
import type { AccountSummary } from "@/types/atm";

interface SessionLayoutProps {
  card: AccountSummary;
  /** Shown once the PIN has been verified. */
  balance?: string;
  ejectLabel?: string;
  onEject: () => void;
  title: string;
  description?: ReactNode;
  children: ReactNode;
}

/** Every in-session screen keeps the inserted card at the same position and scale. */
export function SessionLayout({ card, balance, ejectLabel = "Eject card", onEject, title, description, children }: SessionLayoutProps) {
  return (
    <div className="grid h-full gap-8 lg:grid-cols-[17.5rem_1fr] lg:gap-12">
      <aside className="flex flex-col gap-5 lg:border-r lg:border-steel-4 lg:pr-10">
        <PaymentCard cardType={card.cardType} cardHolder={card.cardHolder} cardLast4={card.cardLast4} className="max-w-[17.5rem]" />
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          <div>
            <dt className="engraved text-[0.625rem] text-steel-8">Card holder</dt>
            <dd className="mt-1 font-medium">{card.cardHolder}</dd>
            <dd className="text-sm text-steel-8">{CARD_NAMES[card.cardType]}</dd>
          </div>
          {balance ? (
            <div>
              <dt className="engraved text-[0.625rem] text-steel-8">Available balance</dt>
              <dd className="mt-1">
                <Money amount={balance} step="medium" />
              </dd>
            </div>
          ) : null}
        </dl>
        <button
          type="button"
          onClick={onEject}
          className="mt-auto inline-flex h-11 items-center gap-2 self-start rounded-xl border border-steel-5 px-4 text-sm font-medium text-steel-8 transition-colors hover:border-steel-6 hover:text-ink"
        >
          <Eject aria-hidden className="size-4" strokeWidth={1.75} />
          {ejectLabel}
        </button>
      </aside>
      <section className="flex min-w-0 flex-col">
        <h2 ref={(element) => element?.focus()} tabIndex={-1} className="text-3xl font-semibold tracking-[-0.02em] outline-none sm:text-4xl">
          {title}
        </h2>
        {description ? <div className="mt-2 text-steel-8">{description}</div> : null}
        <div className="mt-8 flex flex-1 flex-col">{children}</div>
      </section>
    </div>
  );
}
