import { describe, expect, it } from "vitest";
import { type AtmState, atmReducer, initialAtmState } from "@/components/atm/atm-reducer";
import type { AccountSession, AccountSummary } from "@/types/atm";

const card: AccountSummary = { id: "acc_1", cardType: "VISA_GOLD", cardHolder: "Eleanor Whitfield", cardLast4: "7342", demoPin: "1234" };
const session: AccountSession = { id: "acc_1", cardType: "VISA_GOLD", cardHolder: "Eleanor Whitfield", cardLast4: "7342", balance: "100.00" };

function run(state: AtmState, ...actions: Parameters<typeof atmReducer>[1][]) {
  return actions.reduce(atmReducer, state);
}

describe("atmReducer", () => {
  it("accepts at most four PIN digits", () => {
    const state = run(initialAtmState, { type: "insertCard", card }, { type: "cardReady" },
      ...["1", "2", "3", "4", "5"].map((digit) => ({ type: "keyDigit" as const, digit })));

    expect(state.screen).toBe("pin");
    expect(state.entry).toBe("1234");
  });

  it("clears the PIN and counts the attempt when it is rejected", () => {
    const state = run(initialAtmState, { type: "insertCard", card }, { type: "cardReady" },
      { type: "keyDigit", digit: "9" }, { type: "submitStarted" },
      { type: "submitFailed", message: "Incorrect PIN. Please try again.", pinRejected: true });

    expect(state).toMatchObject({ entry: "", pending: false, error: "Incorrect PIN. Please try again.", failedAttempts: 1 });
  });

  it("updates the session balance after a transaction", () => {
    const state = run({ ...initialAtmState, screen: "withdraw", card, session, entry: "6000" }, {
      type: "transactionCompleted",
      receipt: { id: "t1", accountId: "acc_1", type: "WITHDRAWAL", amount: "60.00", balanceAfter: "40.00", createdAt: "2026-11-11T16:00:00.000Z" },
    });

    expect(state.screen).toBe("receipt");
    expect(state.session?.balance).toBe("40.00");
    expect(state.entry).toBe("");
  });

  it("fills preset withdrawal amounts in cents", () => {
    const state = run({ ...initialAtmState, screen: "withdraw", card, session }, { type: "presetAmount", dollars: 200 });

    expect(state.entry).toBe("20000");
  });

  it("clears the session when the card is ejected, keeping only the card to hand back", () => {
    const state = run({ ...initialAtmState, screen: "menu", card, session, entry: "12" }, { type: "ejectCard" });

    expect(state).toEqual({ ...initialAtmState, screen: "ejecting", card });
    expect(run(state, { type: "reset" })).toEqual(initialAtmState);
  });

  it("refuses navigation without an authenticated session", () => {
    const state = run({ ...initialAtmState, screen: "pin", card }, { type: "navigate", to: "withdraw" });

    expect(state.screen).toBe("pin");
  });
});
