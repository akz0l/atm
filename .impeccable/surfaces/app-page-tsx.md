---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["components/atm/atm-terminal.tsx"]
---

# Surface brief: ATM terminal

Scope: the single-page ATM terminal at `/` and every screen it hosts (welcome, PIN, menu, balance, withdraw, deposit, receipt, history, eject). Visitor mode: Operate.
Audience and job: reviewers and demo users completing a full ATM session with fictional cards.
Constraints: brief-pinned dark navy, black, white, subtle gold; must feel like a physical ATM translated to the web; desktop-first, responsive; PIN and amounts enterable from the physical keyboard.
Memorable moment: the vault-door bolt ring retracting digit by digit as the PIN is entered, then swinging open.

## Direction contract

THESIS: The ATM as the bank's vault: every session opens the door and every task is a plate on the vault wall. It refuses the fintech default of glass cards floating on a gradient dashboard.

OWN-WORLD: Flat navy steel on one nine-step ramp (#04070D to #9AA6BB), engraved white #EEF1F6, gold #C9A45C only on the active element and the single primary action. Archivo variable: wide-cut caps for engraved labels, normal width for UI, tabular numerals at four fixed steps. Plates with 1px steel borders and 14px radii; no glass, no glow, no gradients outside the card metals.

STORY: The visitor recognizes a cash machine (display, card slot, keypad), inserts a fictional card, opens the vault with the PIN shown on screen, completes one task at a time with exact amounts, takes a paper receipt, and gets the card back.

FIRST VIEWPORT: Top rail with the Northmere wordmark left and live time plus a "Fictional bank" tag right. Below, the fascia: display (left, about 70%) holding the welcome heading and three full-size card plates in a row; hardware column (right, 360px) with the card slot, its gold light waiting for a card, above a dimmed 3×4 keypad and Confirm key. Primary action: choosing a card, which flies into the slot. Signature interaction: the PIN bolt ring (12 bolts, three retract in gold per digit, the ring turns and opens on success, slams shut with a red flash on error). Motion grammar: exponential ease-out, screens settle 12px into place, one authored moment per transition.

FORM: The Vault Hall, position 4 of 7 on the ordered list. seed: a479614e08421922. Raises kept: nine-step ramp; card registered at one position and scale across the session; one numeral face at four steps; gold only for active and primary; fixed card furniture; amounts right-aligned on one edge.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
