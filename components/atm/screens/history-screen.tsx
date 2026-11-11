"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/ui/money";
import { StatusMessage } from "@/components/ui/status-message";
import { atmApi } from "@/lib/api-client";
import { formatDateTime } from "@/lib/format";
import type { AccountSession, AccountSummary } from "@/types/atm";
import { SessionLayout } from "../session-layout";
import { useRemoteData } from "../use-remote-data";

interface HistoryScreenProps {
  card: AccountSummary;
  session: AccountSession;
  onBack: () => void;
  onEject: () => void;
}

export function HistoryScreen({ card, session, onBack, onEject }: HistoryScreenProps) {
  const { state, retry } = useRemoteData(() => atmApi.listTransactions(session.id), session.id);

  return (
    <SessionLayout
      card={card}
      balance={session.balance}
      onEject={onEject}
      title="Transaction history"
      description={`Latest activity for the card ending in ${card.cardLast4}, newest first.`}
    >
      <div className="min-h-0 flex-1" aria-live="polite" aria-busy={state.status === "loading"}>
        {state.status === "loading" ? (
          <ul className="space-y-2" aria-label="Loading transactions">
            {Array.from({ length: 5 }, (_, index) => (
              <li key={index} className="h-14 animate-pulse rounded-xl bg-steel-3" />
            ))}
          </ul>
        ) : null}

        {state.status === "error" ? (
          <div className="flex flex-col items-start gap-4">
            <StatusMessage tone="error">{state.message}</StatusMessage>
            <Button variant="secondary" onClick={retry}>
              <RotateCcw aria-hidden className="size-4" />
              Try again
            </Button>
          </div>
        ) : null}

        {state.status === "ready" && state.data.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-steel-5 p-8">
            <p className="font-medium">No transactions yet</p>
            <p className="mt-1 text-steel-8">Deposits and withdrawals made with this card will appear here.</p>
          </div>
        ) : null}

        {state.status === "ready" && state.data.length > 0 ? (
          <div className="max-h-[26rem] overflow-auto rounded-2xl border border-steel-5">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead className="sticky top-0 bg-steel-4 text-steel-8">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Date and time</th>
                  <th scope="col" className="px-4 py-3 font-medium">Type</th>
                  <th scope="col" className="px-4 py-3 font-medium">Transaction ID</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Amount</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Balance after</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-4">
                {state.data.map((transaction) => {
                  const isDeposit = transaction.type === "DEPOSIT";
                  return (
                    <tr key={transaction.id} className="bg-steel-3">
                      <td className="px-4 py-3 text-steel-8">{formatDateTime(transaction.createdAt)}</td>
                      <td className="px-4 py-3">
                        <span className={`engraved text-[0.625rem] ${isDeposit ? "text-success" : "text-ink"}`}>{transaction.type}</span>
                      </td>
                      <td className="max-w-[8.5rem] px-4 py-3 font-mono text-xs break-all text-steel-8">{transaction.id}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <span className="num-small">{isDeposit ? "+" : "−"}</span>
                        <Money amount={transaction.amount} step="small" />
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <Money amount={transaction.balanceAfter} step="small" className="text-steel-8" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
      <div className="mt-8">
        <Button onClick={onBack}>Back to menu</Button>
      </div>
    </SessionLayout>
  );
}
