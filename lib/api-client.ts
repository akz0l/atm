import type {
  AccountSession,
  ApiResponse,
  BalanceSnapshot,
  ErrorCode,
  TransactionRecord,
} from "@/types/atm";

export type ClientErrorCode = ErrorCode | "NETWORK_ERROR";

/** A failed API call, carrying a message that is safe to show on the ATM screen. */
export class ApiRequestError extends Error {
  readonly code: ClientErrorCode;

  constructor(code: ClientErrorCode, message: string) {
    super(message);
    this.name = "ApiRequestError";
    this.code = code;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...init,
      cache: "no-store",
      headers: { "content-type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiRequestError("NETWORK_ERROR", "We couldn't reach the bank. Check your connection and try again.");
  }

  let body: ApiResponse<T>;
  try {
    body = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiRequestError("INTERNAL_ERROR", "The bank sent an unexpected response. Please try again.");
  }

  if (!body.ok) {
    throw new ApiRequestError(body.error.code, body.error.message);
  }
  return body.data;
}

function accountPath(accountId: string, resource: string): string {
  return `/api/accounts/${encodeURIComponent(accountId)}/${resource}`;
}

/** Typed client for the ATM route handlers, used by the UI only. */
export const atmApi = {
  validatePin(accountId: string, pin: string) {
    return request<AccountSession>("/api/accounts/validate-pin", {
      method: "POST",
      body: JSON.stringify({ accountId, pin }),
    });
  },
  getBalance(accountId: string) {
    return request<BalanceSnapshot>(accountPath(accountId, "balance"));
  },
  deposit(accountId: string, amount: string) {
    return request<TransactionRecord>(accountPath(accountId, "deposit"), {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
  },
  withdraw(accountId: string, amount: string) {
    return request<TransactionRecord>(accountPath(accountId, "withdraw"), {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
  },
  listTransactions(accountId: string) {
    return request<TransactionRecord[]>(accountPath(accountId, "transactions"));
  },
};
