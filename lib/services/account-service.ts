import { db } from "@/lib/db";
import { AtmError, accountNotFound } from "@/lib/errors";
import { parsePin } from "@/lib/validations/pin";
import type { AccountSession, AccountSummary, BalanceSnapshot } from "@/types/atm";

/** Cards for the welcome screen, in brand order (Visa Gold, Amex Platinum, Mastercard Black). */
export async function listAccounts(): Promise<AccountSummary[]> {
  const accounts = await db.account.findMany({ orderBy: { cardType: "asc" } });

  return accounts.map((account) => ({
    id: account.id,
    cardType: account.cardType,
    cardHolder: account.cardHolder,
    cardLast4: account.cardNumber.slice(-4),
    demoPin: account.pin,
  }));
}

export async function verifyPin(accountId: string, pin: unknown): Promise<AccountSession> {
  const parsedPin = parsePin(pin);
  if (!parsedPin.ok) {
    throw new AtmError("INVALID_REQUEST", parsedPin.message);
  }

  const account = await db.account.findUnique({ where: { id: accountId } });
  if (!account) {
    throw accountNotFound();
  }
  if (account.pin !== parsedPin.value) {
    throw new AtmError("INVALID_PIN", "Incorrect PIN. Please try again.");
  }

  return {
    id: account.id,
    cardType: account.cardType,
    cardHolder: account.cardHolder,
    cardLast4: account.cardNumber.slice(-4),
    balance: account.balance.toFixed(2),
  };
}

export async function getBalance(accountId: string): Promise<BalanceSnapshot> {
  const account = await db.account.findUnique({ where: { id: accountId }, select: { balance: true } });
  if (!account) {
    throw accountNotFound();
  }

  return { accountId, balance: account.balance.toFixed(2), asOf: new Date().toISOString() };
}
