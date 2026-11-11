/**
 * Data transfer objects shared by the API route handlers and the UI.
 * Monetary values always travel as fixed two-decimal strings (e.g. "120.50")
 * so no floating-point arithmetic ever touches a balance.
 */

export type CardType = "VISA_GOLD" | "AMEX_PLATINUM" | "MASTERCARD_BLACK";

export type TransactionType = "DEPOSIT" | "WITHDRAWAL";

/** Card shown on the welcome screen. */
export interface AccountSummary {
  id: string;
  cardType: CardType;
  cardHolder: string;
  cardLast4: string;
  /** Displayed on the PIN screen because this is a demo. Validation still happens on the server. */
  demoPin: string;
}

/** Account details available after a successful PIN check. */
export interface AccountSession {
  id: string;
  cardType: CardType;
  cardHolder: string;
  cardLast4: string;
  balance: string;
}

export interface BalanceSnapshot {
  accountId: string;
  balance: string;
  asOf: string;
}

export interface TransactionRecord {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: string;
  balanceAfter: string;
  createdAt: string;
}

export type ErrorCode =
  | "INVALID_REQUEST"
  | "INVALID_AMOUNT"
  | "INVALID_PIN"
  | "ACCOUNT_NOT_FOUND"
  | "INSUFFICIENT_FUNDS"
  | "INTERNAL_ERROR";

export interface ApiError {
  code: ErrorCode;
  message: string;
}

export type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: ApiError };
