import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { deposit, listTransactions, withdraw } from "@/lib/services/transaction-service";
import { createAccount, disconnect, readBalance, resetDatabase } from "../helpers/database";

beforeEach(resetDatabase);
afterAll(disconnect);

describe("deposit", () => {
  it("adds the amount and records a DEPOSIT with the updated balance", async () => {
    const account = await createAccount({ balance: "100.00" });

    const receipt = await deposit(account.id, "250.25");

    expect(receipt).toEqual({
      id: expect.any(String),
      accountId: account.id,
      type: "DEPOSIT",
      amount: "250.25",
      balanceAfter: "350.25",
      createdAt: expect.any(String),
    });
    expect(await readBalance(account.id)).toBe("350.25");
    expect(await db.transaction.count({ where: { accountId: account.id } })).toBe(1);
  });

  it("rejects invalid amounts without changing anything", async () => {
    const account = await createAccount({ balance: "100.00" });

    await expect(deposit(account.id, "0")).rejects.toMatchObject({ code: "INVALID_AMOUNT" });
    await expect(deposit(account.id, "10.999")).rejects.toMatchObject({ code: "INVALID_AMOUNT" });

    expect(await readBalance(account.id)).toBe("100.00");
    expect(await db.transaction.count()).toBe(0);
  });

  it("reports an unknown account", async () => {
    await expect(deposit("missing-account", "10")).rejects.toMatchObject({ code: "ACCOUNT_NOT_FOUND" });
  });
});

describe("withdraw", () => {
  it("subtracts the amount and records a WITHDRAWAL with the remaining balance", async () => {
    const account = await createAccount({ balance: "500.00" });

    const receipt = await withdraw(account.id, "60");

    expect(receipt).toMatchObject({ accountId: account.id, type: "WITHDRAWAL", amount: "60.00", balanceAfter: "440.00" });
    expect(await readBalance(account.id)).toBe("440.00");
  });

  it("allows withdrawing the entire balance", async () => {
    const account = await createAccount({ balance: "40.10" });

    await expect(withdraw(account.id, "40.10")).resolves.toMatchObject({ balanceAfter: "0.00" });
  });

  it("rejects an amount above the balance without recording a transaction", async () => {
    const account = await createAccount({ balance: "100.00" });

    await expect(withdraw(account.id, "100.01")).rejects.toMatchObject({
      code: "INSUFFICIENT_FUNDS",
      message: "Insufficient funds. Your available balance is $100.00.",
    });
    expect(await readBalance(account.id)).toBe("100.00");
    expect(await db.transaction.count()).toBe(0);
  });

  it("rejects invalid amounts", async () => {
    const account = await createAccount();

    await expect(withdraw(account.id, "-20")).rejects.toMatchObject({ code: "INVALID_AMOUNT" });
    await expect(withdraw(account.id, "abc")).rejects.toMatchObject({ code: "INVALID_AMOUNT" });
  });

  it("reports an unknown account", async () => {
    await expect(withdraw("missing-account", "10")).rejects.toMatchObject({ code: "ACCOUNT_NOT_FOUND" });
  });

  it("never overdraws when withdrawals race each other", async () => {
    const account = await createAccount({ balance: "500.00" });

    const results = await Promise.allSettled(Array.from({ length: 10 }, () => withdraw(account.id, "100")));

    const succeeded = results.filter((result) => result.status === "fulfilled");
    const rejected = results.filter((result): result is PromiseRejectedResult => result.status === "rejected");
    expect(succeeded).toHaveLength(5);
    expect(rejected).toHaveLength(5);
    for (const failure of rejected) {
      expect(failure.reason).toMatchObject({ code: "INSUFFICIENT_FUNDS" });
    }
    expect(await readBalance(account.id)).toBe("0.00");
    expect(await db.transaction.count({ where: { accountId: account.id } })).toBe(5);
  });

  it("keeps the ledger consistent when deposits and withdrawals interleave", async () => {
    const account = await createAccount({ balance: "1000.00" });

    await Promise.all([
      ...Array.from({ length: 8 }, () => deposit(account.id, "12.50")),
      ...Array.from({ length: 8 }, () => withdraw(account.id, "20.25")),
    ]);

    // 1000 + 8 × 12.50 − 8 × 20.25 = 938.00
    expect(await readBalance(account.id)).toBe("938.00");
    const history = await db.transaction.findMany({ where: { accountId: account.id }, orderBy: { balanceAfter: "asc" } });
    expect(history).toHaveLength(16);
    expect(history.some((entry) => entry.balanceAfter.toFixed(2) === "938.00")).toBe(true);
  });
});

describe("listTransactions", () => {
  it("returns only the account's transactions, newest first", async () => {
    const mine = await createAccount({ balance: "100.00" });
    const other = await createAccount({ balance: "100.00", cardType: "AMEX_PLATINUM" });
    await deposit(mine.id, "10");
    await withdraw(other.id, "5");
    await withdraw(mine.id, "30");

    const history = await listTransactions(mine.id);

    expect(history.map((entry) => [entry.type, entry.amount, entry.balanceAfter])).toEqual([
      ["WITHDRAWAL", "30.00", "80.00"],
      ["DEPOSIT", "10.00", "110.00"],
    ]);
    expect(history.every((entry) => entry.accountId === mine.id)).toBe(true);
  });

  it("returns an empty list for an account without activity", async () => {
    const account = await createAccount();

    await expect(listTransactions(account.id)).resolves.toEqual([]);
  });

  it("reports an unknown account", async () => {
    await expect(listTransactions("missing-account")).rejects.toMatchObject({ code: "ACCOUNT_NOT_FOUND" });
  });
});
