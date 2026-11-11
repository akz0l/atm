"use client";

import { RotateCcw, TriangleExclamationPoint } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TerminalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-dvh place-items-center px-6">
      <div className="w-full max-w-lg rounded-2xl border border-steel-5 bg-steel-2 p-10 text-center">
        <TriangleExclamationPoint aria-hidden className="mx-auto size-10 text-danger" strokeWidth={1.5} />
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">This ATM is temporarily out of service</h1>
        <p className="mt-3 text-steel-8">
          We couldn&apos;t reach the bank&apos;s ledger. Make sure the database is running with{" "}
          <code className="font-mono text-ink">docker compose up -d</code>, then try again.
        </p>
        <Button className="mt-8" onClick={reset}>
          <RotateCcw aria-hidden className="size-4" />
          Try again
        </Button>
      </div>
    </main>
  );
}
