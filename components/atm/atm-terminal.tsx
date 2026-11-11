"use client";

import type { AccountSummary } from "@/types/atm";
import { isEntryScreen } from "./atm-reducer";
import { CardSlot, type SlotPhase } from "./card-slot";
import { Keypad } from "./keypad";
import { AmountScreen } from "./screens/amount-screen";
import { BalanceScreen } from "./screens/balance-screen";
import { EjectingScreen } from "./screens/ejecting-screen";
import { HistoryScreen } from "./screens/history-screen";
import { MenuScreen } from "./screens/menu-screen";
import { PinScreen } from "./screens/pin-screen";
import { ReceiptScreen } from "./screens/receipt-screen";
import { WelcomeScreen } from "./screens/welcome-screen";
import { TopRail } from "./top-rail";
import { type AtmSession, useAtmSession } from "./use-atm-session";
import { usePhysicalKeypad } from "./use-physical-keypad";

const CONFIRM_LABELS = { pin: "Confirm PIN", withdraw: "Confirm withdrawal", deposit: "Confirm deposit" } as const;

function slotPhase(screen: AtmSession["state"]["screen"]): SlotPhase {
  if (screen === "welcome") return "awaiting";
  if (screen === "inserting") return "reading";
  if (screen === "ejecting") return "ejecting";
  return "inserted";
}

/** The ATM fascia: top rail, display, and the hardware column with card slot and keypad. */
export function AtmTerminal({ accounts }: { accounts: AccountSummary[] }) {
  const atm = useAtmSession();
  const { state } = atm;

  const entryScreen = isEntryScreen(state.screen) ? state.screen : null;
  // During the vault-opening moment the PIN screen no longer accepts input.
  const keypadEnabled = entryScreen !== null && !(entryScreen === "pin" && state.session);
  const canConfirm = entryScreen === "pin" ? state.entry.length === 4 : state.entry.length > 0;

  usePhysicalKeypad(keypadEnabled && !state.pending, {
    onDigit: atm.pressDigit,
    onDelete: atm.pressDelete,
    onClear: atm.pressClear,
    onConfirm: () => void atm.confirm(),
  });

  return (
    <div className="flex min-h-dvh flex-col">
      <TopRail />
      <main className="grid flex-1 gap-6 p-4 sm:p-8 lg:grid-cols-[1fr_22rem] lg:px-12 lg:py-8">
        <section aria-label="ATM screen" className="relative min-h-[36rem] overflow-hidden rounded-3xl border border-steel-4 bg-steel-2 p-6 sm:p-10 lg:p-12">
          {/* Inserting keeps the welcome screen mounted so the card can finish flying into the slot. */}
          <div key={state.screen === "inserting" ? "welcome" : state.screen} className="h-full animate-screen-in">
            <ScreenView atm={atm} accounts={accounts} />
          </div>
        </section>
        <aside aria-label="Card slot and keypad" className="flex flex-col gap-6">
          <CardSlot phase={slotPhase(state.screen)} card={state.card} />
          <Keypad
            enabled={keypadEnabled}
            pending={state.pending}
            canConfirm={canConfirm}
            confirmLabel={entryScreen ? CONFIRM_LABELS[entryScreen] : "Confirm"}
            onDigit={atm.pressDigit}
            onDelete={atm.pressDelete}
            onClear={atm.pressClear}
            onConfirm={() => void atm.confirm()}
          />
        </aside>
      </main>
    </div>
  );
}

function ScreenView({ atm, accounts }: { atm: AtmSession; accounts: AccountSummary[] }) {
  const { state } = atm;
  const { card, session } = state;
  const backToMenu = () => atm.navigate("menu");

  if (state.screen === "welcome" || state.screen === "inserting") {
    return <WelcomeScreen accounts={accounts} insertingId={card?.id ?? null} onInsert={atm.insertCard} />;
  }
  if (state.screen === "ejecting") {
    return <EjectingScreen card={card} />;
  }
  if (!card) return null;
  if (state.screen === "pin") {
    return <PinScreen state={state} card={card} onCancel={atm.ejectCard} />;
  }
  if (!session) return null;

  switch (state.screen) {
    case "menu":
      return <MenuScreen card={card} session={session} onNavigate={atm.navigate} onEject={atm.ejectCard} />;
    case "balance":
      return <BalanceScreen card={card} session={session} onBalance={atm.balanceRefreshed} onBack={backToMenu} onEject={atm.ejectCard} />;
    case "withdraw":
    case "deposit":
      return (
        <AmountScreen
          mode={state.screen}
          card={card}
          session={session}
          entry={state.entry}
          error={state.error}
          pending={state.pending}
          onPreset={atm.choosePreset}
          onBack={backToMenu}
          onEject={atm.ejectCard}
        />
      );
    case "receipt":
      return state.receipt ? (
        <ReceiptScreen card={card} session={session} receipt={state.receipt} onBack={backToMenu} onEject={atm.ejectCard} />
      ) : null;
    case "history":
      return <HistoryScreen card={card} session={session} onBack={backToMenu} onEject={atm.ejectCard} />;
  }
}
