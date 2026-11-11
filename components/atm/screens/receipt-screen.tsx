import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/ui/money";
import { StatusMessage } from "@/components/ui/status-message";
import { formatDateTime } from "@/lib/format";
import type { AccountSession, AccountSummary, TransactionRecord } from "@/types/atm";
import { SessionLayout } from "../session-layout";

interface ReceiptScreenProps {
  card: AccountSummary;
  session: AccountSession;
  receipt: TransactionRecord;
  onBack: () => void;
  onEject: () => void;
}

export function ReceiptScreen({ card, session, receipt, onBack, onEject }: ReceiptScreenProps) {
  const isWithdrawal = receipt.type === "WITHDRAWAL";
  const rows: [string, ReactNode][] = [
    ["Transaction type", isWithdrawal ? "Withdrawal" : "Deposit"],
    [isWithdrawal ? "Amount withdrawn" : "Amount deposited", <Money key="amount" amount={receipt.amount} step="small" />],
    [isWithdrawal ? "Remaining balance" : "Updated balance", <Money key="balance" amount={receipt.balanceAfter} step="small" />],
    ["Date and time", formatDateTime(receipt.createdAt)],
    ["Transaction ID", <span key="id" className="font-mono text-xs break-all">{receipt.id}</span>],
  ];

  return (
    <SessionLayout
      card={card}
      balance={session.balance}
      onEject={onEject}
      title={isWithdrawal ? "Withdrawal complete" : "Deposit complete"}
      description={<StatusMessage tone="success">Your transaction was successful and has been recorded.</StatusMessage>}
    >
      <article
        aria-label="Transaction receipt"
        className="w-full max-w-md animate-slip-print rounded-lg bg-paper px-7 py-6 text-paper-ink shadow-[0_24px_48px_-24px_rgba(0,0,0,0.9)]"
      >
        <header className="flex items-baseline justify-between border-b border-dashed border-paper-ink/30 pb-3">
          <span className="engraved text-xs">Northmere ATM</span>
          <span className="text-xs">Receipt</span>
        </header>
        <dl className="divide-y divide-dashed divide-paper-ink/20">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-6 py-3 text-sm">
              <dt className="shrink-0 text-paper-ink/70">{label}</dt>
              <dd className="text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        <footer className="border-t border-dashed border-paper-ink/30 pt-3 text-center text-xs text-paper-ink/70">
          Fictional bank · demonstration receipt
        </footer>
      </article>
      <div className="mt-8">
        <Button onClick={onBack}>Another transaction</Button>
      </div>
    </SessionLayout>
  );
}
