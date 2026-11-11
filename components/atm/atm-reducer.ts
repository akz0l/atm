import { popDigit, pushDigit } from "@/lib/amount-entry";
import { PIN_LENGTH } from "@/lib/validations/pin";
import type { AccountSession, AccountSummary, TransactionRecord } from "@/types/atm";

export type Screen =
  | "welcome"
  | "inserting"
  | "pin"
  | "menu"
  | "balance"
  | "withdraw"
  | "deposit"
  | "receipt"
  | "history"
  | "ejecting";

export type MenuDestination = "menu" | "balance" | "withdraw" | "deposit" | "history";

export interface AtmState {
  screen: Screen;
  /** Card currently in the machine (kept during ejection so it can be handed back). */
  card: AccountSummary | null;
  /** Present only after a successful PIN check. */
  session: AccountSession | null;
  /** Digits typed on the keypad: the PIN or an amount in cents. */
  entry: string;
  pending: boolean;
  error: string | null;
  /** Increments on every rejected PIN so the error animation can replay. */
  failedAttempts: number;
  receipt: TransactionRecord | null;
}

export type AtmAction =
  | { type: "insertCard"; card: AccountSummary }
  | { type: "cardReady" }
  | { type: "keyDigit"; digit: string }
  | { type: "keyDelete" }
  | { type: "keyClear" }
  | { type: "presetAmount"; dollars: number }
  | { type: "submitStarted" }
  | { type: "submitFailed"; message: string; pinRejected?: boolean }
  | { type: "pinAccepted"; session: AccountSession }
  | { type: "transactionCompleted"; receipt: TransactionRecord }
  | { type: "balanceRefreshed"; balance: string }
  | { type: "navigate"; to: MenuDestination }
  | { type: "ejectCard" }
  | { type: "reset" };

export const initialAtmState: AtmState = {
  screen: "welcome",
  card: null,
  session: null,
  entry: "",
  pending: false,
  error: null,
  failedAttempts: 0,
  receipt: null,
};

export function isEntryScreen(screen: Screen): screen is "pin" | "withdraw" | "deposit" {
  return screen === "pin" || screen === "withdraw" || screen === "deposit";
}

export function atmReducer(state: AtmState, action: AtmAction): AtmState {
  switch (action.type) {
    case "insertCard":
      return state.screen === "welcome" ? { ...initialAtmState, screen: "inserting", card: action.card } : state;

    case "cardReady":
      return state.screen === "inserting" ? { ...state, screen: "pin" } : state;

    case "keyDigit": {
      if (state.pending || !isEntryScreen(state.screen)) return state;
      if (state.screen === "pin") {
        if (state.session || state.entry.length >= PIN_LENGTH) return state;
        return { ...state, entry: state.entry + action.digit, error: null };
      }
      return { ...state, entry: pushDigit(state.entry, action.digit), error: null };
    }

    case "keyDelete":
      if (state.pending || !isEntryScreen(state.screen)) return state;
      return { ...state, entry: popDigit(state.entry), error: null };

    case "keyClear":
      if (state.pending || !isEntryScreen(state.screen)) return state;
      return { ...state, entry: "", error: null };

    case "presetAmount":
      if (state.pending || state.screen !== "withdraw") return state;
      return { ...state, entry: String(action.dollars * 100), error: null };

    case "submitStarted":
      return { ...state, pending: true, error: null };

    case "submitFailed":
      return {
        ...state,
        pending: false,
        error: action.message,
        entry: state.screen === "pin" ? "" : state.entry,
        failedAttempts: action.pinRejected ? state.failedAttempts + 1 : state.failedAttempts,
      };

    case "pinAccepted":
      // Stay on the PIN screen briefly so the vault ring can open before the menu appears.
      return { ...state, session: action.session, pending: false, error: null };

    case "transactionCompleted":
      if (!state.session) return state;
      return {
        ...state,
        screen: "receipt",
        receipt: action.receipt,
        session: { ...state.session, balance: action.receipt.balanceAfter },
        entry: "",
        pending: false,
        error: null,
      };

    case "balanceRefreshed":
      if (!state.session) return state;
      return { ...state, session: { ...state.session, balance: action.balance } };

    case "navigate":
      if (!state.session) return state;
      return { ...state, screen: action.to, entry: "", pending: false, error: null, receipt: null };

    case "ejectCard":
      // The session is cleared immediately; only the card stays so the slot can hand it back.
      return { ...initialAtmState, screen: "ejecting", card: state.card };

    case "reset":
      return initialAtmState;
  }
}
