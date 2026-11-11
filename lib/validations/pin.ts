export const PIN_LENGTH = 4;

const PIN_PATTERN = new RegExp(`^\\d{${PIN_LENGTH}}$`);

export type PinResult = { ok: true; value: string } | { ok: false; message: string };

export function parsePin(input: unknown): PinResult {
  if (typeof input !== "string" || !PIN_PATTERN.test(input)) {
    return { ok: false, message: `Enter your ${PIN_LENGTH}-digit PIN.` };
  }
  return { ok: true, value: input };
}
