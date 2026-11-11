import type { ErrorCode } from "@/types/atm";

/** HTTP status each domain error maps to. */
const STATUS_BY_CODE: Record<ErrorCode, number> = {
  INVALID_REQUEST: 400,
  INVALID_AMOUNT: 400,
  INVALID_PIN: 401,
  ACCOUNT_NOT_FOUND: 404,
  INSUFFICIENT_FUNDS: 422,
  INTERNAL_ERROR: 500,
};

/** An expected business failure whose message is safe to show to the customer. */
export class AtmError extends Error {
  readonly code: ErrorCode;
  readonly status: number;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.name = "AtmError";
    this.code = code;
    this.status = STATUS_BY_CODE[code];
  }
}

export function accountNotFound(): AtmError {
  return new AtmError("ACCOUNT_NOT_FOUND", "We couldn't find that account. Please insert your card again.");
}
