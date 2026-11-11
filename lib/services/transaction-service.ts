import { db } from "@/lib/db";
import { AtmError, accountNotFound } from "@/lib/errors";
import { formatUsd } from "@/lib/format";
import type { Transaction } from "@/lib/generated/prisma/client";
import { parseAmount } from "@/lib/validations/amount";
import type { TransactionRecord } from "@/types/atm";

const HISTORY_LIMIT = 50;

/**
 * Adds money to the account and records the DEPOSIT in one database transaction.
 * The increment runs in SQL, so concurrent deposits never overwrite each other.
 */
export async function deposit(accountId: string, rawAmount: unknown): Promise<TransactionRecord> {
  const amount = requireValidAmount(rawAmount);

  return db.$transaction(async (tx) => {
    const { count } = await tx.account.updateMany({
      where: { id: accountId },
      data: { balance: { increment: amount } },
    });
    if (count === 0) {
      throw accountNotFound();
    }

    const { balance } = await tx.account.findUniqueOrThrow({ where: { id: accountId }, select: { balance: true } });
    const transaction = await tx.transaction.create({
      data: { accountId, type: "DEPOSIT", amount, balanceAfter: balance },
    });
    return toTransactionRecord(transaction);
  });
}

/**
 * Takes money out of the account and records the WITHDRAWAL in one database transaction.
 * The balance check and the decrement are a single conditional UPDATE: PostgreSQL locks the
 * row and re-evaluates `balance >= amount` for every concurrent request, so the account can
 * never be overdrawn. A CHECK constraint on the column backs this up.
 */
export async function withdraw(accountId: string, rawAmount: unknown): Promise<TransactionRecord> {
  const amount = requireValidAmount(rawAmount);

  return db.$transaction(async (tx) => {
    const { count } = await tx.account.updateMany({
      where: { id: accountId, balance: { gte: amount } },
      data: { balance: { decrement: amount } },
    });
    if (count === 0) {
      const account = await tx.account.findUnique({ where: { id: accountId }, select: { balance: true } });
      if (!account) {
        throw accountNotFound();
      }
      throw new AtmError(
        "INSUFFICIENT_FUNDS",
        `Insufficient funds. Your available balance is ${formatUsd(account.balance.toFixed(2))}.`,
      );
    }

    const { balance } = await tx.account.findUniqueOrThrow({ where: { id: accountId }, select: { balance: true } });
    const transaction = await tx.transaction.create({
      data: { accountId, type: "WITHDRAWAL", amount, balanceAfter: balance },
    });
    return toTransactionRecord(transaction);
  });
}

/** Most recent activity first, limited to the latest entries. */
export async function listTransactions(accountId: string): Promise<TransactionRecord[]> {
  const account = await db.account.findUnique({
    where: { id: accountId },
    select: {
      transactions: {
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: HISTORY_LIMIT,
      },
    },
  });
  if (!account) {
    throw accountNotFound();
  }

  return account.transactions.map(toTransactionRecord);
}

function requireValidAmount(rawAmount: unknown): string {
  const result = parseAmount(rawAmount);
  if (!result.ok) {
    throw new AtmError("INVALID_AMOUNT", result.message);
  }
  return result.value;
}

function toTransactionRecord(transaction: Transaction): TransactionRecord {
  return {
    id: transaction.id,
    accountId: transaction.accountId,
    type: transaction.type,
    amount: transaction.amount.toFixed(2),
    balanceAfter: transaction.balanceAfter.toFixed(2),
    createdAt: transaction.createdAt.toISOString(),
  };
}
