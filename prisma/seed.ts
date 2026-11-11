import "dotenv/config";
import { db } from "@/lib/db";
import { CardType } from "@/lib/generated/prisma/client";

/**
 * Fictional demonstration accounts. The card numbers intentionally fail the
 * Luhn checksum, so they can never be valid real-world payment cards.
 */
const DEMO_ACCOUNTS = [
  {
    cardType: CardType.VISA_GOLD,
    cardHolder: "Eleanor Whitfield",
    cardNumber: "4716293405817342",
    pin: "1234",
    balance: "4850.75",
  },
  {
    cardType: CardType.AMEX_PLATINUM,
    cardHolder: "Julian Ashcroft",
    cardNumber: "374281590631008",
    pin: "5678",
    balance: "12340.00",
  },
  {
    cardType: CardType.MASTERCARD_BLACK,
    cardHolder: "Sofia Marchetti",
    cardNumber: "5413772091642058",
    pin: "9012",
    balance: "27500.50",
  },
] as const;

async function main() {
  for (const account of DEMO_ACCOUNTS) {
    // `update: {}` keeps the seed idempotent: re-running it never resets balances.
    await db.account.upsert({
      where: { cardNumber: account.cardNumber },
      update: {},
      create: account,
    });
  }

  const accounts = await db.account.findMany({ orderBy: { createdAt: "asc" } });
  console.log(`Seeded ${accounts.length} demo accounts:`);
  for (const account of accounts) {
    console.log(`  ${account.cardType.padEnd(17)} ${account.cardHolder.padEnd(18)} $${account.balance.toFixed(2)}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
