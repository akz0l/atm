import type { CardType } from "@/types/atm";

/** Display names for each demo card, in the brand's own wording. */
export const CARD_NAMES: Record<CardType, string> = {
  VISA_GOLD: "Visa Gold",
  AMEX_PLATINUM: "American Express Platinum",
  MASTERCARD_BLACK: "Mastercard Black",
};

export function firstName(cardHolder: string): string {
  return cardHolder.split(" ")[0] ?? cardHolder;
}
