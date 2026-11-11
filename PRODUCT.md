# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Pinned by the user: Next.js (App Router) + TypeScript, Tailwind CSS, PostgreSQL via Docker Compose, Prisma ORM, Next.js Route Handlers, Lucide React icons.

## Users

- **Reviewers** (hiring managers, engineers) evaluating the author's ability to build a complete application with AI-assisted development. They run it locally, click through every flow, and read the code.
- **Anyone running the demo**, acting as an ATM customer: choose a card, enter the PIN, check the balance, withdraw, deposit, read the history, eject the card.

## Product Purpose

A fully functional ATM simulator: a physical ATM session translated into a premium web interface, backed by a real PostgreSQL ledger. Success means every operation works and persists, the journey feels like using a real machine, and the interface reads as a premium banking product rather than a generic dashboard.

## Positioning

A single-session machine, not a dashboard: one card in, one task at a time, card out. Real ledger semantics (atomic, concurrency-safe balance updates) sit behind the physical ATM ritual.

## Operating Context

- Desktop browser first (local `npm run dev`); must remain usable on a phone.
- Session ritual: insert card → enter PIN → main menu → operation → receipt → eject card.
- Demo PINs are displayed on screen by design so anyone can complete the journey.

## Capabilities and Constraints

- Three fictional cards: Visa Gold (PIN 1234), American Express Platinum (PIN 5678), Mastercard Black (PIN 9012).
- Operations: check balance, withdraw (presets $20, $40, $60, $100, $200, $500 or a custom amount), deposit (custom amount), transaction history, eject card.
- Amounts must be greater than zero, have at most two decimals, and stay at or below $1,000,000 per operation; withdrawals cannot exceed the balance.
- No real authentication, payment processing, or banking APIs. Fictional data only. No features beyond the brief.

## Brand Commitments

- Fictional bank brand: **Northmere** (invented for this demo and labeled as fictional).
- Card faces carry each network's brand identity (Visa, American Express, Mastercard) on fictional cards.
- Binding visual constraints from the brief: dark navy, black, white, and subtle gold accents; premium banking; it must feel like an actual ATM; smooth transitions and micro-interactions; desktop-first responsive layout.

## Evidence on Hand

No real customers, testimonials, rates, or metrics exist. All account data is synthetic seed data (`prisma/seed.ts`). Never invent banking claims such as insurance, interest rates, or branch networks.

## Product Principles

1. The machine leads: one task per screen, always a clear way back or out.
2. Money is exact: amounts are validated on the server and always shown in USD with cents.
3. Every state is designed: loading, empty, error, and success are part of the experience, not afterthoughts.
4. Honest demo: fictional data is labeled as such, and demo PINs are visible by design.

## Accessibility & Inclusion

PIN and amount entry must work from the physical keyboard as well as the on-screen keypad (brief requirement). Target WCAG AA contrast, visible focus states, and reduced-motion support.
