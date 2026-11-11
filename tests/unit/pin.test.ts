import { describe, expect, it } from "vitest";
import { PIN_LENGTH, parsePin } from "@/lib/validations/pin";

describe("parsePin", () => {
  it("uses four-digit PINs", () => {
    expect(PIN_LENGTH).toBe(4);
  });

  it("accepts exactly four digits", () => {
    expect(parsePin("0427")).toEqual({ ok: true, value: "0427" });
  });

  it.each([undefined, null, 1234, "", "123", "12345", "12a4", " 1234"])("rejects %j", (input) => {
    expect(parsePin(input)).toEqual({ ok: false, message: "Enter your 4-digit PIN." });
  });
});
