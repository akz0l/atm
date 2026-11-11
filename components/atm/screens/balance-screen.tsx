"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/ui/money";
import { StatusMessage } from "@/components/ui/status-message";
import { atmApi } from "@/lib/api-client";
import type { AccountSession, AccountSummary } from "@/types/atm";
import { SessionLayout } from "../session-layout";
import { useRemoteData } from "../use-remote-data";

const timeFormatter = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" });

interface BalanceScreenProps {
  card: AccountSummary;
  session: AccountSession;
  onBalance: (balance: string) => void;
  onBack: () => void;
  onEject: () => void;
}

export function BalanceScreen({ card, session, onBalance, onBack, onEject }: BalanceScreenProps) {
  const { state, retry } = useRemoteData(async () => {
    const snapshot = await atmApi.getBalance(session.id);
    onBalance(snapshot.balance);
    return snapshot;
  }, session.id);

  return (
    <SessionLayout card={card} balance={session.balance} onEject={onEject} title="Check balance" description="Read live from the Northmere ledger.">
      <div className="rounded-2xl border border-steel-5 bg-steel-3 p-8 sm:p-10" aria-live="polite" aria-busy={state.status === "loading"}>
        <p className="engraved text-[0.6875rem] text-steel-8">Available balance</p>
        {state.status === "loading" ? (
          <div className="mt-4">
            <div className="h-16 w-72 max-w-full animate-pulse rounded-lg bg-steel-5" />
            <p className="mt-4 text-sm text-steel-8">Checking your balance…</p>
          </div>
        ) : null}
        {state.status === "ready" ? (
          <div className="mt-3 animate-screen-in">
            <Money amount={state.data.balance} step="display" />
            <p className="mt-4 text-sm text-steel-8">As of {timeFormatter.format(new Date(state.data.asOf))}</p>
          </div>
        ) : null}
        {state.status === "error" ? (
          <div className="mt-4 flex flex-col items-start gap-4">
            <StatusMessage tone="error">{state.message}</StatusMessage>
            <Button variant="secondary" onClick={retry}>
              <RotateCcw aria-hidden className="size-4" />
              Try again
            </Button>
          </div>
        ) : null}
      </div>
      <div className="mt-8">
        <Button onClick={onBack}>Back to menu</Button>
      </div>
    </SessionLayout>
  );
}
