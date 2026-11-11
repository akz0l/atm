import { BanknoteArrowDown, BanknoteArrowUp, ChevronRight, ScrollText, Vault } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { firstName } from "@/lib/cards";
import type { AccountSession, AccountSummary } from "@/types/atm";
import type { MenuDestination } from "../atm-reducer";
import { SessionLayout } from "../session-layout";

const OPERATIONS: { to: MenuDestination; title: string; detail: string; Icon: LucideIcon }[] = [
  { to: "balance", title: "Check Balance", detail: "See your available balance.", Icon: Vault },
  { to: "withdraw", title: "Withdraw Money", detail: "From $20 to $500, or any amount.", Icon: BanknoteArrowUp },
  { to: "deposit", title: "Deposit Money", detail: "Add funds to your account.", Icon: BanknoteArrowDown },
  { to: "history", title: "Transaction History", detail: "Review deposits and withdrawals.", Icon: ScrollText },
];

interface MenuScreenProps {
  card: AccountSummary;
  session: AccountSession;
  onNavigate: (to: MenuDestination) => void;
  onEject: () => void;
}

export function MenuScreen({ card, session, onNavigate, onEject }: MenuScreenProps) {
  return (
    <SessionLayout
      card={card}
      balance={session.balance}
      onEject={onEject}
      title={`Welcome back, ${firstName(session.cardHolder)}.`}
      description="What would you like to do today?"
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {OPERATIONS.map(({ to, title, detail, Icon }) => (
          <li key={to} className="flex">
            <button
              type="button"
              onClick={() => onNavigate(to)}
              className="group flex w-full items-center gap-4 rounded-2xl border border-steel-5 bg-steel-3 p-5 text-left transition-colors duration-200 hover:border-steel-6 hover:bg-steel-4 sm:p-6"
            >
              <Icon aria-hidden className="size-7 shrink-0 text-steel-8 transition-colors group-hover:text-ink" strokeWidth={1.5} />
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-semibold">{title}</span>
                <span className="mt-0.5 block text-sm text-steel-8">{detail}</span>
              </span>
              <ChevronRight aria-hidden className="size-5 text-steel-7 transition-transform group-hover:translate-x-0.5" />
            </button>
          </li>
        ))}
      </ul>
    </SessionLayout>
  );
}
