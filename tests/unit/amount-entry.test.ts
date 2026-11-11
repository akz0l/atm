import { describe, expect, it } from "vitest";
import { MAX_ENTRY_DIGITS, digitsToAmount, popDigit, pushDigit } from "@/lib/amount-entry";

describe("ATM-style amount entry", () => {
  it("fills digits from the cents side", () => {
    const digits = ["1", "2", "5", "0"].reduce(pushDigit, "");

    expect(digits).toBe("1250");
    expect(digitsToAmount(digits)).toBe("12.50");
  });

  it("reads an empty entry as zero", () => {
    expect(digitsToAmount("")).toBe("0.00");
    expect(digitsToAmount("7")).toBe("0.07");
  });

  it("ignores leading zeros and non-digits", () => {
    expect(pushDigit("", "0")).toBe("");
    expect(pushDigit("12", "x")).toBe("12");
  });

  it("stops accepting digits at the entry limit", () => {
    const full = "1".repeat(MAX_ENTRY_DIGITS);

    expect(pushDigit(full, "9")).toBe(full);
    expect(digitsToAmount("100000000")).toBe("1000000.00");
  });

  it("deletes the last digit", () => {
    expect(popDigit("1250")).toBe("125");
    expect(popDigit("")).toBe("");
  });
});
