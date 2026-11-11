# Northmere ATM — Premium ATM Simulator

A fully working ATM simulator: pick a fictional card, enter its PIN, check your balance, withdraw, deposit, review your history, and eject the card. Every operation persists in PostgreSQL. The interface translates a physical ATM (display, card slot, keypad) into a premium dark-navy banking product.

> Northmere is a fictional bank. All cards, holders, and balances are demo data; the card numbers deliberately fail the Luhn checksum, so they can never be real cards.

## Quick start

Requirements: Node.js ≥ 20.19 and Docker.

```bash
docker compose up -d       # starts PostgreSQL only
npm install                # also generates the Prisma client
npx prisma migrate dev     # applies the migrations
npx prisma db seed         # creates the three demo accounts (safe to re-run)
npm run dev                # http://localhost:3000
```

No `.env` is needed: without `DATABASE_URL` the app and the Prisma CLI fall back to the Docker Compose database. Copy `.env.example` to `.env` to point somewhere else.

**Fully containerized alternative:** `docker compose --profile app up -d --build` builds the app image, applies migrations, seeds, and serves on port 3000.

## Demo cards

| Card | Holder | PIN | Starting balance |
|------|--------|-----|------------------|
| Visa Gold | Eleanor Whitfield | `1234` | $4,850.75 |
| American Express Platinum | Julian Ashcroft | `5678` | $12,340.00 |
| Mastercard Black | Sofia Marchetti | `9012` | $27,500.50 |

The PIN is also shown on the PIN screen, by design. PINs and amounts can be typed on the on-screen keypad or the physical keyboard (digits, Backspace, Esc, Enter).

## Architecture

```
app/
  page.tsx                  Server component: loads the cards, renders the terminal
  api/accounts/...          Route handlers (thin: parse → service → JSON envelope)
components/
  atm/                      Terminal shell, state machine, keypad, card slot, screens/
  cards/                    Payment card faces (Visa Gold, Amex Platinum, Mastercard Black)
  ui/                       Button, Money, StatusMessage
lib/
  services/                 Business logic; the only code that touches the database
  validations/              Amount and PIN rules shared by services and tests
  api/response.ts           Consistent `{ ok, data } | { ok, error }` responses
  api-client.ts             Typed fetch client used by the UI
  db.ts, env.ts             Prisma client (pg driver adapter) and database URL
prisma/                     Schema, migrations, seed
types/atm.ts                DTOs shared by the API and the UI
tests/                      Vitest unit + integration tests
```

Request flow: **UI screen → `atmApi` → route handler → service → Prisma → PostgreSQL**. Components never contain business rules, and route handlers never touch Prisma.

## API

All responses use the same envelope: `{ "ok": true, "data": … }` or `{ "ok": false, "error": { "code", "message" } }`.

| Method | Endpoint | Success | Errors |
|--------|----------|---------|--------|
| GET | `/api/accounts` | 200 card list | — |
| POST | `/api/accounts/validate-pin` `{ accountId, pin }` | 200 session | 400 `INVALID_REQUEST`, 401 `INVALID_PIN`, 404 |
| GET | `/api/accounts/[id]/balance` | 200 balance | 404 `ACCOUNT_NOT_FOUND` |
| POST | `/api/accounts/[id]/deposit` `{ amount }` | 201 transaction | 400 `INVALID_AMOUNT`, 404 |
| POST | `/api/accounts/[id]/withdraw` `{ amount }` | 201 transaction | 400, 404, 422 `INSUFFICIENT_FUNDS` |
| GET | `/api/accounts/[id]/transactions` | 200 latest 50, newest first | 404 |

Amounts are strings or numbers with at most two decimals, greater than zero, and at most $1,000,000.00 per operation.

## Main technical decisions

| Topic | Decision |
|-------|----------|
| Money | `Decimal(12,2)` columns; amounts travel as strings (`"120.50"`); arithmetic happens in SQL, never in JavaScript floats. |
| Concurrency | A withdrawal is one conditional `UPDATE … WHERE balance >= amount` inside a database transaction, together with the history row. PostgreSQL row locking re-checks the condition for concurrent requests, so the balance can never go negative. A `CHECK (balance >= 0)` constraint backs it up. Tested with 10 parallel withdrawals. |
| Validation | Every rule runs on the server (`lib/validations`). The UI's ATM-style amount entry (digits fill from the cents side) only shapes the input. |
| Session | Client-side state only, as the brief asked for no real auth. Ejecting the card, or refreshing the page, clears it and requires the PIN again. |
| Rendering | The page reads the cards at request time (`connection()`), so `next build` does not need a database. |
| Prisma 7 | `prisma.config.ts`, the `prisma-client` generator, and the `@prisma/adapter-pg` driver adapter. npm 11 blocks dependency install scripts, so `package.json` explicitly allows the ones Prisma needs. |
| Seed | Idempotent upserts by card number; re-running never resets balances. |
| Design | "Vault Hall" direction: one nine-step navy ramp, Archivo type, gold reserved for the active element and the primary action. The PIN is drawn as a vault-door bolt ring. Direction contract: `.impeccable/surfaces/app-page-tsx.md`. |

## Testing

```bash
npm test          # Vitest: unit + integration (needs the Docker database running)
npm run lint
npm run typecheck
npm run build
```

Integration tests run against a separate `atm_simulator_test` database, which is created and migrated automatically, so demo data is never touched. They cover validation rules, PIN checks, deposits, withdrawals, insufficient funds, concurrent withdrawals, history scoping, and every route's status codes.

## Useful commands

| Task | Command |
|------|---------|
| Reset the database to the seeded state | `npx prisma migrate reset`, then `npx prisma db seed` |
| Browse the data | `npx prisma studio` |
| Stop the database (data is kept) | `docker compose down` |
| Delete the data volume too | `docker compose down -v` |
