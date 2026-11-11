import { describe, expect, it } from "vitest";
import { formatUsd, maskCardNumber } from "@/lib/format";

describe("maskCardNumber", () => {
  it("masks 16-digit cards in four groups", () => {
    expect(maskCardNumber("VISA_GOLD", "7342")).toBe("•••• •••• •••• 7342");
    expect(maskCardNumber("MASTERCARD_BLACK", "2058")).toBe("•••• •••• •••• 2058");
  });

  it("masks American Express cards in the 4-6-5 layout", () => {
    expect(maskCardNumber("AMEX_PLATINUM", "1008")).toBe("•••• •••••• •1008");
  });
});

describe("formatUsd", () => {
  it("formats decimal strings as US dollars", () => {
    expect(formatUsd("27500.5")).toBe("$27,500.50");
    expect(formatUsd("0.00")).toBe("$0.00");
  });
});
