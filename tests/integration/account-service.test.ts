import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { getBalance, listAccounts, verifyPin } from "@/lib/services/account-service";
import { createAccount, disconnect, resetDatabase } from "../helpers/database";

beforeEach(resetDatabase);
afterAll(disconnect);

describe("listAccounts", () => {
  it("returns card summaries in brand order without exposing the full card number", async () => {
    await createAccount({ cardType: "MASTERCARD_BLACK", cardHolder: "C", pin: "9012" });
    await createAccount({ cardType: "VISA_GOLD", cardHolder: "A", pin: "1234" });
    await createAccount({ cardType: "AMEX_PLATINUM", cardHolder: "B", pin: "5678" });

    const accounts = await listAccounts();

    expect(accounts.map((account) => account.cardType)).toEqual(["VISA_GOLD", "AMEX_PLATINUM", "MASTERCARD_BLACK"]);
    expect(accounts[0]).toEqual({
      id: expect.any(String),
      cardType: "VISA_GOLD",
      cardHolder: "A",
      cardLast4: expect.stringMatching(/^\d{4}$/),
      demoPin: "1234",
    });
    expect(accounts[0]).not.toHaveProperty("cardNumber");
  });
});

describe("verifyPin", () => {
  it("returns the account session when the PIN matches", async () => {
    const account = await createAccount({ pin: "1234", balance: "4850.75", cardHolder: "Eleanor" });

    await expect(verifyPin(account.id, "1234")).resolves.toEqual({
      id: account.id,
      cardType: "VISA_GOLD",
      cardHolder: "Eleanor",
      cardLast4: account.cardNumber.slice(-4),
      balance: "4850.75",
    });
  });

  it("rejects an incorrect PIN", async () => {
    const account = await createAccount({ pin: "1234" });

    await expect(verifyPin(account.id, "4321")).rejects.toMatchObject({
      code: "INVALID_PIN",
      message: "Incorrect PIN. Please try again.",
    });
  });

  it("rejects a malformed PIN before touching the account", async () => {
    const account = await createAccount({ pin: "1234" });

    await expect(verifyPin(account.id, "12")).rejects.toMatchObject({ code: "INVALID_REQUEST" });
  });

  it("reports an unknown account", async () => {
    await expect(verifyPin("missing-account", "1234")).rejects.toMatchObject({ code: "ACCOUNT_NOT_FOUND" });
  });
});

describe("getBalance", () => {
  it("reads the balance from the database", async () => {
    const account = await createAccount({ balance: "12340.00" });

    const snapshot = await getBalance(account.id);

    expect(snapshot).toEqual({ accountId: account.id, balance: "12340.00", asOf: expect.any(String) });
    expect(Number.isNaN(Date.parse(snapshot.asOf))).toBe(false);
  });

  it("reports an unknown account", async () => {
    await expect(getBalance("missing-account")).rejects.toMatchObject({ code: "ACCOUNT_NOT_FOUND" });
  });
});
