# Feature: Premium ATM Simulator

Objective: a complete, working ATM simulator (Next.js App Router + TypeScript + Tailwind + Prisma + PostgreSQL via Docker Compose) with a premium banking UI.
Branch: `feat/atm-simulator` · Delivery: `exception-ok` (greenfield, no remote) · Test runner: Vitest (`npm test`) · Plan: approved plan in session (pinned versions, decisions).

## Specs

- **S1 Stack** — "Frontend: Next.js (App Router) + TypeScript." "Styling: Tailwind CSS." "Database: PostgreSQL." "Database Infrastructure: Docker Compose." "ORM: Prisma." "Backend: Next.js Route Handlers / Server Actions." "Icons: Lucide React."
- **S2 Design** — "use the impeccable skill to guide the design process." "Minimalist, sophisticated financial interface." "Premium banking aesthetics." "Dark navy, black, white, and subtle gold accents." "Beautiful typography." "Smooth transitions and micro-interactions." "Responsive layout, optimized primarily for desktop." "Avoid generic AI-generated dashboard aesthetics. Make it feel like an actual ATM interface."
- **S3 Welcome** — "ATM branding (create a fictional banking brand)." "A welcome message." "Insert your card to get started". Three selectable cards: "Visa Gold", "American Express Platinum", "Mastercard Black"; "realistic-looking card layouts, chip illustrations, cardholder names, and masked card numbers."
- **S4 PIN** — "Display the selected card." "Show a numeric keypad (0–9)." "Allow entering the PIN using either the on-screen keypad or the physical keyboard." "Display the entered PIN as masked dots." "Include a delete button and a clear button." "Include a confirm button." "display the correct PIN directly on the screen". PINs: "Visa Gold: 1234", "American Express Platinum: 5678", "Mastercard Black: 9012". "If the PIN is incorrect, display an appropriate error message." "If the PIN is correct, proceed to the ATM main menu."
- **S5 Main menu** — "A personalized welcome message." "The selected card." "Account holder name." "Current account balance." Options: "Check Balance", "Withdraw Money", "Deposit Money", "Transaction History", plus "an option to exit / eject the card."
- **S6 Balance** — "Display the current account balance." "Format the amount as USD currency." "Include an option to return to the main menu." "The balance must come from the database."
- **S7 Withdraw** — presets "$20", "$40", "$60", "$100", "$200", "$500" and "a custom amount". Rules: "The amount must be greater than zero." "at most two decimal places." "The customer cannot withdraw more than their available balance." "If the balance is insufficient, display a clear error message." "subtract the amount from the account balance." "Save the transaction in the database." Confirmation: "Transaction type." "Amount withdrawn." "Remaining balance." "Date and time." "Success notification."
- **S8 Deposit** — "Allow entering a custom deposit amount." "Validate that the amount is greater than zero." "Accept up to two decimal places." "Add the amount to the account balance." "Persist the operation in the database." "Save the transaction history." Confirmation: "Transaction type." "Deposited amount." "Updated balance." "Date and time." "Success notification."
- **S9 History** — "Transaction ID." "Transaction type (DEPOSIT / WITHDRAWAL)." "Amount." "Balance after the transaction." "Date and time." "Make sure transactions are associated with the correct account."
- **S10 Eject** — "Display a card ejection animation or transition." "Clear the current session state." "Return to the welcome screen." "Require selecting a card and entering its PIN again."
- **S11 Database** — Account: "id", "cardType (VISA_GOLD, AMEX_PLATINUM, MASTERCARD_BLACK)", "cardHolder", "cardNumber (fictional, masked when displayed)", "pin (demo PIN only)", "balance", "createdAt", "updatedAt". Transaction: "id", "accountId", "type (DEPOSIT, WITHDRAWAL)", "amount", "balanceAfter", "createdAt". "Seed the database with three demonstration accounts." "Use Prisma seed functionality."
- **S12 Backend** — endpoints "GET /api/accounts", "POST /api/accounts/validate-pin", "GET /api/accounts/[id]/balance", "POST /api/accounts/[id]/deposit", "POST /api/accounts/[id]/withdraw", "GET /api/accounts/[id]/transactions". "Validate all monetary operations on the server." "Use database transactions for balance updates and transaction creation." "Prevent concurrent operations from producing incorrect balances." "Return consistent API responses." "Handle errors appropriately."
- **S13 Code quality** — "Keep business logic separate from UI components." "Keep database access isolated." "Avoid duplicated code." "Provide meaningful loading, empty, success, and error states."
- **S14 Docker & DX** — "Dockerfile." "docker-compose.yml." "PostgreSQL container." "Environment variable example (.env.example)." "Prisma migrations." "Database seeding." "README.md." Commands: `docker compose up -d`, `npm install`, `npx prisma migrate dev`, `npx prisma db seed`, `npm run dev`.
- **S15 Rules** — "Do not build features that were not requested." "Use fictional card data only." "Do not leave TODOs or non-functional placeholder buttons."
- **S16 Done & deliverables** — "The application works after restarting Docker containers." "Provide the project architecture overview." "Explain how to start the application." "Provide the three demo cards, their PINs, and initial balances." "Explain the main technical decisions." "Verify the complete user journey." "Run the relevant tests and fix any issues found."
- Assumption (A1): single-operation cap `MAX_TRANSACTION_AMOUNT = 1,000,000.00` guards `Decimal(12,2)` overflow.
- Assumption (A2): session is client-side state only; refresh behaves like an eject.

## Tasks

| ID | Specs | Route | Status | Commit / evidence |
|---|---|---|---|---|
| T1 setup (config, env, compose db) | S1, S14 | inline | done | 7fea55e · db healthy, npm install clean, prod audit 0 vulns |
| T2 database (schema, migration + CHECK, seed, db client) | S11, S14 | inline | done | 6353aaa · seed ×2 → 3 accounts; CHECK rejects balance −1 |
| T3 domain + API + tests | S6–S9, S12, S13 | inline | done | 67315d2 · RED (6 files missing modules) → GREEN 72/72; tsc + eslint clean |
| T4 design direction (PRODUCT.md, concept-seed, surface brief) | S2 | inline | done | 69d0e39 · user chose The Vault Hall (assigned) |
| T5 UI part 1 (shell, cards, keypad, welcome, PIN, eject) | S2–S4, S10 | inline | done | 5411914 · browser journey verified |
| T6 UI part 2 (menu, balance, withdraw, deposit, receipt, history) | S5–S9, S13 | inline | done | 5411914 · 83/83 tests, lint, typecheck, build green |
| T7 Docker app image + compose profile | S14 | inline | done | 7b38d99 · --profile app serves :3000; data survives restart and down/up |
| T8 README + DESIGN.md | S16 | inline / documenter subagent | partial | README done; DESIGN.md deferred to the polish iteration |
| T9 journey verification, persistence, finish review, independent verifier | S16 | inline + verifier subagent | partial | journey + persistence + fresh-clone verified; finish review and independent verifier deferred |

Route evidence: no Writer trigger (units are sequential and depend on each other); verifier required by Risk items 4 (concurrency) and 5 (dependencies/Docker).

## Log

- **L2 (2026-11-11)** Plan approved. Environment: Node 26.13, npm 11.20, Docker 29.8 (OrbStack started by agent), ports 3000/5432 free, RDD on. npm `latest` of `prisma` is 8.0 RC → pinned 7.10.1; TS `latest` is TS 7 native → pinned 5.9.3. Git identity was unset; repo-local identity set (name `ares`, email from account context) — user may rewrite before pushing.
- **L3 (2026-11-11)** npm 11 blocks dependency install scripts by default: approved `prisma`, `@prisma/engines`, `esbuild` in `allowScripts` (needed for the schema engine), denied `fsevents` (prebuilt). Package switched to `"type": "module"` to silence Vite's CJS config warning. Race test: 10 × $100 withdrawals on $500 → 5 succeed, balance 0.00, 5 txns.
- **L4 (2026-11-11)** RDD slice c5f1049..67315d2 assessed high (process boundary in tests/global-setup.ts + escalated item 4). Consent relayed; user chose "Skip this time" → decline invocation ran once (declined_this_candidate). `prompt.md` excluded locally via `.git/info/exclude`.
- **L5 (2026-11-11, verbatim user correction)** "no te enfoques en perfeccionar la ui, entregame algo funcional y vamos iterando" → finish review, detector pass, DESIGN.md documenter, and independent verifier deferred to the next iteration.
- **L6 (2026-11-11)** Verified: all 3 cards accept their PIN (200) and reject a wrong one (401); browser journey wrong PIN → correct PIN → withdraw $60 → deposit $250.25 → overdraft rejected → history → eject → welcome; 390px has no horizontal scroll; fresh clone runs the 5 documented commands without .env; balances survive `restart` and `down`/`up`.
- **L1 (verbatim original request)** — see below.

# Build a Premium ATM Simulator

Act as a Senior Full-Stack Engineer, Software Architect, and Product Designer. Build a fully functional ATM (Automated Teller Machine) Simulator web application.

The goal is to demonstrate my ability to build a complete application using AI-assisted development. Prioritize clean architecture, maintainable code, an excellent user experience, and working functionality over unnecessary complexity.

## 1. Technology Stack

Use the following stack:

- **Frontend:** Next.js (App Router) + TypeScript.
- **Styling:** Tailwind CSS.
- **Database:** PostgreSQL.
- **Database Infrastructure:** Docker Compose.
- **ORM:** Prisma.
- **Backend:** Next.js Route Handlers / Server Actions.
- **Icons:** Lucide React.

Keep the architecture straightforward. This is a demonstration project, not a production banking system.

## 2. Design & Frontend Experience

IMPORTANT: Before implementing the frontend, use the `impeccable` skill to guide the design process. Read and follow its instructions if available in the environment.

The application should look like a premium digital banking product.

Design direction:
- Minimalist, sophisticated financial interface.
- Premium banking aesthetics.
- Dark navy, black, white, and subtle gold accents.
- Beautiful typography.
- Smooth transitions and micro-interactions.
- Well-designed buttons, cards, dialogs, and notifications.
- Responsive layout, optimized primarily for desktop.

Avoid generic AI-generated dashboard aesthetics. Make it feel like an actual ATM interface.

The experience should resemble interacting with a physical ATM, translated into a modern web application.

## 3. ATM User Journey

Implement the following complete user flow:

### Step 1: Welcome Screen

Display a welcome screen with:

- ATM branding (create a fictional banking brand).
- A welcome message.
- An instruction: "Insert your card to get started".
- Three selectable payment cards.

The customer must be able to select one of these cards:

1. Visa Gold
2. American Express Platinum
3. Mastercard Black

Each card should have its own distinctive premium visual design, using its corresponding brand identity.

Cards should be visually attractive, with realistic-looking card layouts, chip illustrations, cardholder names, and masked card numbers.

These are fictional demonstration cards, not real payment credentials.

### Step 2: PIN Authentication

After selecting a card, transition to a PIN entry screen.

Requirements:

- Display the selected card.
- Show a numeric keypad (0–9).
- Allow entering the PIN using either the on-screen keypad or the physical keyboard.
- Display the entered PIN as masked dots.
- Include a delete button and a clear button.
- Include a confirm button.

IMPORTANT: For demonstration purposes, display the correct PIN directly on the screen so the user knows which code to enter.

Use different PINs for each card.

Example:
- Visa Gold: 1234
- American Express Platinum: 5678
- Mastercard Black: 9012

The PIN validation should work correctly.

If the PIN is incorrect, display an appropriate error message.

If the PIN is correct, proceed to the ATM main menu.

No real authentication provider or complicated security implementation is required.

### Step 3: ATM Main Menu

After successful authentication, display the main ATM interface.

Show:

- A personalized welcome message.
- The selected card.
- Account holder name.
- Current account balance.
- Available operations.

Provide four main options:

1. Check Balance
2. Withdraw Money
3. Deposit Money
4. Transaction History

Also include an option to exit / eject the card.

### Step 4: Check Balance

When selecting Check Balance:

- Display the current account balance.
- Format the amount as USD currency.
- Include an option to return to the main menu.

The balance must come from the database.

### Step 5: Withdraw Money

Implement a functional withdrawal flow.

Provide predefined withdrawal amounts:

- $20
- $40
- $60
- $100
- $200
- $500

Also allow the customer to enter a custom amount.

Business rules:

- The amount must be greater than zero.
- The amount must be a valid monetary value with at most two decimal places.
- The customer cannot withdraw more than their available balance.
- If the balance is insufficient, display a clear error message.
- If successful, subtract the amount from the account balance.
- Save the transaction in the database.

Display a transaction confirmation screen showing:

- Transaction type.
- Amount withdrawn.
- Remaining balance.
- Date and time.
- Success notification.

### Step 6: Deposit Money

Implement a functional deposit flow.

Requirements:

- Allow entering a custom deposit amount.
- Validate that the amount is greater than zero.
- Accept up to two decimal places.
- Add the amount to the account balance.
- Persist the operation in the database.
- Save the transaction history.

Display a confirmation screen showing:

- Transaction type.
- Deposited amount.
- Updated balance.
- Date and time.
- Success notification.

This is a digital simulation. No physical cash handling is necessary.

### Step 7: Transaction History

Display the account's transaction history.

Each transaction should include:

- Transaction ID.
- Transaction type (DEPOSIT / WITHDRAWAL).
- Amount.
- Balance after the transaction.
- Date and time.

Use a clean and readable transaction list.

Make sure transactions are associated with the correct account.

### Step 8: Exit / Eject Card

When selecting Exit:

- Display a card ejection animation or transition.
- Clear the current session state.
- Return to the welcome screen.
- Require selecting a card and entering its PIN again.

## 4. Database Design

Keep the database schema simple.

Use PostgreSQL with Docker Compose and Prisma.

Create the following entities:

### Account

- id
- cardType (VISA_GOLD, AMEX_PLATINUM, MASTERCARD_BLACK)
- cardHolder
- cardNumber (fictional, masked when displayed)
- pin (demo PIN only)
- balance
- createdAt
- updatedAt

### Transaction

- id
- accountId
- type (DEPOSIT, WITHDRAWAL)
- amount
- balanceAfter
- createdAt

Seed the database with three demonstration accounts.

Each account should have:
- A different card type.
- A different cardholder.
- A different starting balance.
- Its corresponding demo PIN.

Use Prisma seed functionality.

Make sure the database can be initialized easily using Docker Compose.

## 5. Backend Requirements

Implement the necessary API endpoints or server actions.

Suggested endpoints:

- GET /api/accounts
- POST /api/accounts/validate-pin
- GET /api/accounts/[id]/balance
- POST /api/accounts/[id]/deposit
- POST /api/accounts/[id]/withdraw
- GET /api/accounts/[id]/transactions

Requirements:

- Keep business logic separate from UI components.
- Validate all monetary operations on the server.
- Use database transactions for balance updates and transaction creation.
- Prevent concurrent operations from producing incorrect balances.
- Return consistent API responses.
- Handle errors appropriately.

Do not overengineer authentication, authorization, encryption, or banking-grade security. This is an isolated educational demonstration with fictional data.

## 6. Architecture & Code Quality

Organize the project cleanly.

Suggested structure:

- app/
- components/
- components/atm/
- components/cards/
- lib/
- lib/services/
- lib/validations/
- prisma/
- types/

Requirements:

- Use TypeScript properly.
- Avoid unnecessary abstractions.
- Follow separation of concerns.
- Use reusable React components.
- Avoid putting all business logic inside page components.
- Keep database access isolated.
- Use clear naming conventions.
- Avoid duplicated code.
- Provide meaningful loading, empty, success, and error states.

## 7. Docker & Developer Experience

Provide:

- Dockerfile.
- docker-compose.yml.
- PostgreSQL container.
- Environment variable example (.env.example).
- Prisma migrations.
- Database seeding.
- README.md.

The project should be easy to run locally.

Ideally, the developer should only need to execute:

```bash
docker compose up -d
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Adjust the setup if needed so these commands work reliably.

## 8. Important Implementation Rules

1. Do not build features that were not requested.
2. Do not introduce microservices.
3. Do not introduce Redis, Kafka, message brokers, or unnecessary infrastructure.
4. Do not implement real payment processing.
5. Do not use external banking APIs.
6. Do not create unnecessary abstractions.
7. Prioritize a polished and complete user experience.
8. Ensure all operations actually work and persist in PostgreSQL.
9. Use fictional card data only.
10. Do not leave TODOs or non-functional placeholder buttons.

## 9. Definition of Done

The project is complete when:

- All three cards can be selected.
- Each card accepts its corresponding PIN.
- Incorrect PINs are rejected.
- The customer can navigate the ATM menu.
- Balance inquiries work.
- Deposits work and update the database.
- Withdrawals work and validate available funds.
- Transactions are persisted.
- Transaction history is displayed correctly.
- Card ejection resets the session.
- The application works after restarting Docker containers.
- The UI looks polished and professional.

## 10. Final Deliverables

Once implementation is complete:

1. Provide the complete working source code.
2. Provide the project architecture overview.
3. Explain how to start the application.
4. Provide the three demo cards, their PINs, and initial balances.
5. Explain the main technical decisions.
6. Verify the complete user journey.
7. Run the relevant tests and fix any issues found.

Start by inspecting the development environment and reading the available design skills. Then create a concise implementation plan and proceed with the implementation.

Do not stop after generating a plan. Build the actual working application.