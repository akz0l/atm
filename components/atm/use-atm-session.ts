"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { ApiRequestError, atmApi } from "@/lib/api-client";
import { digitsToAmount } from "@/lib/amount-entry";
import { PIN_LENGTH } from "@/lib/validations/pin";
import type { AccountSummary } from "@/types/atm";
import { type MenuDestination, atmReducer, initialAtmState } from "./atm-reducer";

/** Durations of the physical moments, matched by the CSS animations. */
export const CARD_INSERT_MS = 900;
export const VAULT_OPEN_MS = 900;
export const CARD_EJECT_MS = 2600;

function messageOf(error: unknown): string {
  return error instanceof ApiRequestError ? error.message : "Something went wrong. Please try again.";
}

/** The ATM session state machine plus the commands that talk to the bank's API. */
export function useAtmSession() {
  const [state, dispatch] = useReducer(atmReducer, initialAtmState);
  const timers = useRef<number[]>([]);

  const later = useCallback((callback: () => void, delay: number) => {
    timers.current.push(window.setTimeout(callback, delay));
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  function insertCard(card: AccountSummary) {
    dispatch({ type: "insertCard", card });
    later(() => dispatch({ type: "cardReady" }), CARD_INSERT_MS);
  }

  async function confirm() {
    const { screen, card, entry, pending, session } = state;
    if (pending || !card) return;

    if (screen === "pin") {
      if (session || entry.length !== PIN_LENGTH) return;
      dispatch({ type: "submitStarted" });
      try {
        const verified = await atmApi.validatePin(card.id, entry);
        dispatch({ type: "pinAccepted", session: verified });
        later(() => dispatch({ type: "navigate", to: "menu" }), VAULT_OPEN_MS);
      } catch (error) {
        dispatch({
          type: "submitFailed",
          message: messageOf(error),
          pinRejected: error instanceof ApiRequestError && error.code === "INVALID_PIN",
        });
      }
      return;
    }

    if ((screen === "withdraw" || screen === "deposit") && session && entry) {
      dispatch({ type: "submitStarted" });
      try {
        const amount = digitsToAmount(entry);
        const receipt =
          screen === "withdraw" ? await atmApi.withdraw(session.id, amount) : await atmApi.deposit(session.id, amount);
        dispatch({ type: "transactionCompleted", receipt });
      } catch (error) {
        dispatch({ type: "submitFailed", message: messageOf(error) });
      }
    }
  }

  function ejectCard() {
    dispatch({ type: "ejectCard" });
    later(() => dispatch({ type: "reset" }), CARD_EJECT_MS);
  }

  return {
    state,
    insertCard,
    confirm,
    ejectCard,
    pressDigit: (digit: string) => dispatch({ type: "keyDigit", digit }),
    pressDelete: () => dispatch({ type: "keyDelete" }),
    pressClear: () => dispatch({ type: "keyClear" }),
    choosePreset: (dollars: number) => dispatch({ type: "presetAmount", dollars }),
    navigate: (to: MenuDestination) => dispatch({ type: "navigate", to }),
    balanceRefreshed: (balance: string) => dispatch({ type: "balanceRefreshed", balance }),
  };
}

export type AtmSession = ReturnType<typeof useAtmSession>;
