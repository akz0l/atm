import { db } from "@/lib/db";
import type { CardType } from "@/types/atm";

export async function resetDatabase() {
  await db.transaction.deleteMany();
  await db.account.deleteMany();
}

let cardSequence = 0;

export async function createAccount(overrides: { balance?: string; pin?: string; cardType?: CardType; cardHolder?: string } = {}) {
  cardSequence += 1;
  return db.account.create({
    data: {
      cardType: overrides.cardType ?? "VISA_GOLD",
      cardHolder: overrides.cardHolder ?? "Test Holder",
      cardNumber: `400000000000${String(cardSequence).padStart(4, "0")}`,
      pin: overrides.pin ?? "1234",
      balance: overrides.balance ?? "500.00",
    },
  });
}

export async function readBalance(accountId: string): Promise<string> {
  const account = await db.account.findUniqueOrThrow({ where: { id: accountId } });
  return account.balance.toFixed(2);
}

export async function disconnect() {
  await db.$disconnect();
}
