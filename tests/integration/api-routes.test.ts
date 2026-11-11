import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { GET as listAccountsRoute } from "@/app/api/accounts/route";
import { POST as validatePinRoute } from "@/app/api/accounts/validate-pin/route";
import { GET as balanceRoute } from "@/app/api/accounts/[id]/balance/route";
import { POST as depositRoute } from "@/app/api/accounts/[id]/deposit/route";
import { POST as withdrawRoute } from "@/app/api/accounts/[id]/withdraw/route";
import { GET as transactionsRoute } from "@/app/api/accounts/[id]/transactions/route";
import { createAccount, disconnect, resetDatabase } from "../helpers/database";

beforeEach(resetDatabase);
afterAll(disconnect);

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function context(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe("GET /api/accounts", () => {
  it("lists the demo cards", async () => {
    await createAccount({ cardHolder: "Eleanor" });

    const response = await listAccountsRoute();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      data: [expect.objectContaining({ cardHolder: "Eleanor", cardType: "VISA_GOLD" })],
    });
  });
});

describe("POST /api/accounts/validate-pin", () => {
  it("returns the account session for the correct PIN", async () => {
    const account = await createAccount({ pin: "5678", balance: "12340.00" });

    const response = await validatePinRoute(jsonRequest({ accountId: account.id, pin: "5678" }));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, data: { id: account.id, balance: "12340.00" } });
  });

  it("responds 401 for an incorrect PIN", async () => {
    const account = await createAccount({ pin: "5678" });

    const response = await validatePinRoute(jsonRequest({ accountId: account.id, pin: "0000" }));

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      ok: false,
      error: { code: "INVALID_PIN", message: "Incorrect PIN. Please try again." },
    });
  });

  it("responds 400 for a malformed body", async () => {
    const notJson = await validatePinRoute(jsonRequest("{not json"));
    const missingAccount = await validatePinRoute(jsonRequest({ pin: "1234" }));

    expect(notJson.status).toBe(400);
    expect(await notJson.json()).toMatchObject({ ok: false, error: { code: "INVALID_REQUEST" } });
    expect(missingAccount.status).toBe(400);
  });
});

describe("GET /api/accounts/[id]/balance", () => {
  it("returns the balance", async () => {
    const account = await createAccount({ balance: "27500.50" });

    const response = await balanceRoute(new Request("http://localhost"), context(account.id));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, data: { accountId: account.id, balance: "27500.50" } });
  });

  it("responds 404 for an unknown account", async () => {
    const response = await balanceRoute(new Request("http://localhost"), context("missing-account"));

    expect(response.status).toBe(404);
    expect(await response.json()).toMatchObject({ ok: false, error: { code: "ACCOUNT_NOT_FOUND" } });
  });
});

describe("POST /api/accounts/[id]/deposit", () => {
  it("creates a deposit", async () => {
    const account = await createAccount({ balance: "100.00" });

    const response = await depositRoute(jsonRequest({ amount: "250.25" }), context(account.id));

    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ ok: true, data: { type: "DEPOSIT", amount: "250.25", balanceAfter: "350.25" } });
  });

  it("responds 400 for an invalid amount", async () => {
    const account = await createAccount();

    const response = await depositRoute(jsonRequest({ amount: "12.345" }), context(account.id));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      ok: false,
      error: { code: "INVALID_AMOUNT", message: "Amounts can have at most two decimal places." },
    });
  });
});

describe("POST /api/accounts/[id]/withdraw", () => {
  it("creates a withdrawal", async () => {
    const account = await createAccount({ balance: "100.00" });

    const response = await withdrawRoute(jsonRequest({ amount: 40 }), context(account.id));

    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ ok: true, data: { type: "WITHDRAWAL", amount: "40.00", balanceAfter: "60.00" } });
  });

  it("responds 422 when funds are insufficient", async () => {
    const account = await createAccount({ balance: "100.00" });

    const response = await withdrawRoute(jsonRequest({ amount: "500" }), context(account.id));

    expect(response.status).toBe(422);
    expect(await response.json()).toMatchObject({ ok: false, error: { code: "INSUFFICIENT_FUNDS" } });
  });
});

describe("GET /api/accounts/[id]/transactions", () => {
  it("returns the account history", async () => {
    const account = await createAccount({ balance: "100.00" });
    await depositRoute(jsonRequest({ amount: "5" }), context(account.id));

    const response = await transactionsRoute(new Request("http://localhost"), context(account.id));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, data: [{ type: "DEPOSIT", amount: "5.00", balanceAfter: "105.00" }] });
  });
});
