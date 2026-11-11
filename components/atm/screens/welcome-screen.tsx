"use client";

import { PaymentCard } from "@/components/cards/payment-card";
import { CARD_NAMES } from "@/lib/cards";
import type { AccountSummary } from "@/types/atm";

interface WelcomeScreenProps {
  accounts: AccountSummary[];
  insertingId: string | null;
  onInsert: (account: AccountSummary) => void;
}

/** Flies the chosen card into the slot; skipped when the visitor prefers reduced motion. */
function animateIntoSlot(cardElement: HTMLElement) {
  const slot = document.querySelector("[data-card-slot-mouth]");
  if (!slot || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const from = cardElement.getBoundingClientRect();
  const to = slot.getBoundingClientRect();
  const scale = Math.min(1, (to.width * 0.8) / from.width);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top - (from.top + from.height / 2);

  cardElement.animate(
    [
      { transform: "none", opacity: 1 },
      { transform: `translate(${dx}px, ${dy - 40}px) scale(${scale})`, opacity: 1, offset: 0.7 },
      { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0 },
    ],
    { duration: 850, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" },
  );
}

export function WelcomeScreen({ accounts, insertingId, onInsert }: WelcomeScreenProps) {
  return (
    <div className="flex h-full flex-col">
      <h1 className="max-w-2xl text-4xl leading-[1.05] font-light tracking-[-0.02em] sm:text-5xl lg:text-6xl">
        Welcome to <span className="font-semibold">Northmere</span>.
      </h1>
      <p className="mt-4 text-lg text-steel-8 sm:text-xl">
        <span className="font-medium text-ink">Insert your card to get started.</span> Choose one of the demo cards below.
      </p>

      {accounts.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-steel-5 p-8 text-steel-8">
          <p className="font-medium text-ink">No cards are loaded in this ATM yet.</p>
          <p className="mt-2">
            Seed the demo accounts with <code className="font-mono text-ink">npx prisma db seed</code> and refresh the page.
          </p>
        </div>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 lg:mt-auto">
          {accounts.map((account) => {
            const inserting = insertingId === account.id;
            const dimmed = insertingId !== null && !inserting;
            return (
              <li key={account.id} className={`transition-opacity duration-300 ${dimmed ? "opacity-30" : ""}`}>
                <button
                  type="button"
                  disabled={insertingId !== null}
                  onClick={(event) => {
                    const cardElement = event.currentTarget.querySelector<HTMLElement>("[data-card-face]");
                    if (cardElement) animateIntoSlot(cardElement);
                    onInsert(account);
                  }}
                  aria-label={`Insert ${CARD_NAMES[account.cardType]} card ending in ${account.cardLast4}, ${account.cardHolder}`}
                  className="group w-full rounded-2xl text-left"
                >
                  <div data-card-face className="transition-transform duration-300 ease-out-expo group-enabled:group-hover:-translate-y-1.5">
                    <PaymentCard cardType={account.cardType} cardHolder={account.cardHolder} cardLast4={account.cardLast4} decorative />
                  </div>
                  <div className="mt-4 px-1">
                    <span className="block font-semibold">{CARD_NAMES[account.cardType]}</span>
                    <span className="block text-sm text-steel-8">{account.cardHolder}</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
