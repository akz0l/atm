import { AtmError } from "@/lib/errors";
import type { ApiResponse } from "@/types/atm";

/**
 * Runs a route handler's work and wraps the outcome in the shared response envelope:
 * `{ ok: true, data }` on success, `{ ok: false, error: { code, message } }` on failure.
 */
export async function respond<T>(work: () => Promise<T>, successStatus = 200): Promise<Response> {
  try {
    const data = await work();
    return Response.json({ ok: true, data } satisfies ApiResponse<T>, { status: successStatus });
  } catch (error) {
    if (error instanceof AtmError) {
      return Response.json(
        { ok: false, error: { code: error.code, message: error.message } } satisfies ApiResponse<never>,
        { status: error.status },
      );
    }

    console.error("Unexpected API error", error);
    return Response.json(
      {
        ok: false,
        error: { code: "INTERNAL_ERROR", message: "Something went wrong on our side. Please try again." },
      } satisfies ApiResponse<never>,
      { status: 500 },
    );
  }
}

/** Parses a JSON object body or fails with a 400 INVALID_REQUEST. */
export async function readJsonObject(request: Request): Promise<Record<string, unknown>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new AtmError("INVALID_REQUEST", "The request body must be valid JSON.");
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new AtmError("INVALID_REQUEST", "The request body must be a JSON object.");
  }
  return body as Record<string, unknown>;
}

export function requireString(body: Record<string, unknown>, field: string): string {
  const value = body[field];
  if (typeof value !== "string" || value.trim() === "") {
    throw new AtmError("INVALID_REQUEST", `The "${field}" field is required.`);
  }
  return value;
}

/** Route context for handlers under /api/accounts/[id]. */
export interface AccountRouteContext {
  params: Promise<{ id: string }>;
}
