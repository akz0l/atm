/**
 * ATM-style amount entry: digits fill in from the cents side, so typing
 * 1, 2, 5, 0 reads $12.50. The entry can never hold more than two decimals.
 * The server still validates every amount; this only shapes the input.
 */

/** Nine digits covers the $1,000,000.00 per-operation limit. */
export const MAX_ENTRY_DIGITS = 9;

export function pushDigit(digits: string, digit: string): string {
  if (!/^\d$/.test(digit)) {
    return digits;
  }
  const next = `${digits}${digit}`.replace(/^0+/, "");
  return next.length > MAX_ENTRY_DIGITS ? digits : next;
}

export function popDigit(digits: string): string {
  return digits.slice(0, -1);
}

/** Converts entered digits to a decimal string, e.g. "1250" → "12.50". */
export function digitsToAmount(digits: string): string {
  const padded = digits.padStart(3, "0");
  const whole = padded.slice(0, -2).replace(/^0+(?=\d)/, "");
  return `${whole}.${padded.slice(-2)}`;
}
