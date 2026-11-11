import type { CardType } from "@/types/atm";

const usdFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

/** Formats a decimal string such as "27500.5" as "$27,500.50". Display only; never used for arithmetic. */
export function formatUsd(amount: string): string {
  return usdFormatter.format(Number(amount));
}

export function formatDateTime(isoDate: string): string {
  return dateTimeFormatter.format(new Date(isoDate));
}

/** Masks a card number in the brand's own grouping, revealing only the last four digits. */
export function maskCardNumber(cardType: CardType, last4: string): string {
  if (cardType === "AMEX_PLATINUM") {
    return `•••• •••••• •${last4}`;
  }
  return `•••• •••• •••• ${last4}`;
}
