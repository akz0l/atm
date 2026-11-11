import { describe, expect, it } from "vitest";
import { MAX_TRANSACTION_AMOUNT, parseAmount } from "@/lib/validations/amount";

describe("parseAmount", () => {
  it.each([
    ["20", "20.00"],
    ["20.5", "20.50"],
    ["20.55", "20.55"],
    ["0.01", "0.01"],
    [" 100 ", "100.00"],
    ["007.10", "7.10"],
    [60, "60.00"],
    [12.34, "12.34"],
    [MAX_TRANSACTION_AMOUNT, "1000000.00"],
  ])("accepts %j as %s", (input, expected) => {
    expect(parseAmount(input)).toEqual({ ok: true, value: expected });
  });

  it.each([
    [undefined, "Enter an amount."],
    [null, "Enter an amount."],
    ["", "Enter an amount."],
    ["   ", "Enter an amount."],
    ["abc", "Enter a valid amount, for example 120.50."],
    ["1e3", "Enter a valid amount, for example 120.50."],
    ["12,50", "Enter a valid amount, for example 120.50."],
    [Number.NaN, "Enter a valid amount, for example 120.50."],
    [Number.POSITIVE_INFINITY, "Enter a valid amount, for example 120.50."],
    [{ amount: 5 }, "Enter a valid amount, for example 120.50."],
    ["20.555", "Amounts can have at most two decimal places."],
    [0.1 + 0.2, "Amounts can have at most two decimal places."],
    ["0", "The amount must be greater than zero."],
    ["0.00", "The amount must be greater than zero."],
    [0, "The amount must be greater than zero."],
    ["-5", "The amount must be greater than zero."],
    [-20, "The amount must be greater than zero."],
    ["1000000.01", "The maximum per transaction is $1,000,000.00."],
    ["99999999999999", "The maximum per transaction is $1,000,000.00."],
  ])("rejects %j", (input, message) => {
    expect(parseAmount(input)).toEqual({ ok: false, message });
  });
});
