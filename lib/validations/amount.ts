/** Largest amount accepted in a single operation; keeps values well inside the Decimal(12, 2) column. */
export const MAX_TRANSACTION_AMOUNT = 1_000_000;

const MAX_CENTS = MAX_TRANSACTION_AMOUNT * 100;
const NUMERIC = /^-?\d+(?:\.(\d+))?$/;

export type AmountResult = { ok: true; value: string } | { ok: false; message: string };

/**
 * Validates a monetary amount coming from a request body or a form.
 * Returns the amount normalized to a two-decimal string (e.g. "20.50"),
 * which Prisma stores without any floating-point rounding.
 */
export function parseAmount(input: unknown): AmountResult {
  if (input === undefined || input === null || (typeof input === "string" && input.trim() === "")) {
    return { ok: false, message: "Enter an amount." };
  }
  if (typeof input !== "string" && typeof input !== "number") {
    return invalidFormat();
  }

  const text = typeof input === "number" ? String(input) : input.trim();
  const match = NUMERIC.exec(text);
  if (!match) {
    return invalidFormat();
  }

  const decimals = match[1] ?? "";
  if (decimals.length > 2) {
    return { ok: false, message: "Amounts can have at most two decimal places." };
  }
  if (text.startsWith("-")) {
    return { ok: false, message: "The amount must be greater than zero." };
  }

  const [whole] = text.split(".");
  const cents = BigInt(whole) * 100n + BigInt(decimals.padEnd(2, "0"));
  if (cents <= 0n) {
    return { ok: false, message: "The amount must be greater than zero." };
  }
  if (cents > BigInt(MAX_CENTS)) {
    return { ok: false, message: "The maximum per transaction is $1,000,000.00." };
  }

  const dollars = cents / 100n;
  const remainder = (cents % 100n).toString().padStart(2, "0");
  return { ok: true, value: `${dollars}.${remainder}` };
}

function invalidFormat(): AmountResult {
  return { ok: false, message: "Enter a valid amount, for example 120.50." };
}
