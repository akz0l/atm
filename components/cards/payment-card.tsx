import { Nfc } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { CARD_NAMES } from "@/lib/cards";
import { maskCardNumber } from "@/lib/format";
import type { CardType } from "@/types/atm";
import { CardChip } from "./card-chip";
import { AmexMark, MastercardMark, VisaMark } from "./network-marks";

interface CardFace {
  tier: string;
  surface: CSSProperties;
  emboss: string;
  mark: ReactNode;
}

/** Each brand keeps its own material; the furniture stays in the same place on every card. */
const CARD_FACES: Record<CardType, CardFace> = {
  VISA_GOLD: {
    tier: "Gold",
    surface: {
      background: "linear-gradient(118deg, #5c4318 0%, #a37f35 30%, #e6cd8a 50%, #b28c40 68%, #6a4f1f 100%)",
      color: "#21180a",
    },
    emboss: "0 1px 0 rgba(255, 240, 200, 0.45), 0 -1px 0 rgba(0, 0, 0, 0.25)",
    mark: <VisaMark />,
  },
  AMEX_PLATINUM: {
    tier: "Platinum",
    surface: {
      background: "linear-gradient(118deg, #7d838d 0%, #c9ced6 32%, #f1f3f6 50%, #b9bec7 70%, #767c86 100%)",
      color: "#1d2531",
    },
    emboss: "0 1px 0 rgba(255, 255, 255, 0.6), 0 -1px 0 rgba(0, 0, 0, 0.2)",
    mark: <AmexMark />,
  },
  MASTERCARD_BLACK: {
    tier: "Black",
    surface: {
      background: "linear-gradient(118deg, #1d1d22 0%, #0b0b0d 45%, #18181c 70%, #0a0a0b 100%)",
      color: "#e6e6ea",
      boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.09)",
    },
    emboss: "0 1px 0 rgba(0, 0, 0, 0.6), 0 -1px 0 rgba(255, 255, 255, 0.08)",
    mark: <MastercardMark />,
  },
};

interface PaymentCardProps {
  cardType: CardType;
  cardHolder: string;
  cardLast4: string;
  /** Hide from assistive tech when a surrounding control already names the card. */
  decorative?: boolean;
  className?: string;
}

export function PaymentCard({ cardType, cardHolder, cardLast4, decorative = false, className = "" }: PaymentCardProps) {
  const face = CARD_FACES[cardType];
  const label = `${CARD_NAMES[cardType]} card ending in ${cardLast4}, ${cardHolder}`;

  return (
    <div
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      className={`@container w-full select-none ${className}`}
    >
      {/* Sizes use cqw, so they must live inside the container element, not on it. */}
      <div
        className="relative aspect-[1.586/1] w-full overflow-hidden rounded-[4.6cqw] shadow-[0_22px_40px_-18px_rgba(0,0,0,0.85)]"
        style={face.surface}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_18%_0%,rgba(255,255,255,0.2),transparent_60%)]"
        />
        <div className="relative flex h-full flex-col p-[6.5cqw]">
          <div className="flex items-start justify-between">
            <span className="engraved text-[3.3cqw] tracking-[0.32em]">Northmere</span>
            <span className="engraved text-[2.9cqw] opacity-75">{face.tier}</span>
          </div>
          <div className="mt-[8cqw] flex items-center gap-[3cqw]">
            <CardChip className="w-[13cqw]" />
            <Nfc aria-hidden className="size-[6.5cqw] opacity-60" strokeWidth={1.75} />
          </div>
          <p
            className="mt-auto text-[5.6cqw] leading-none font-medium tracking-[0.1em] whitespace-nowrap tabular-nums"
            style={{ textShadow: face.emboss }}
          >
            {maskCardNumber(cardType, cardLast4)}
          </p>
          <div className="mt-[4.5cqw] flex items-end justify-between gap-[3cqw]">
            <span
              className="truncate text-[3.3cqw] font-medium tracking-[0.16em] uppercase"
              style={{ textShadow: face.emboss }}
            >
              {cardHolder}
            </span>
            {face.mark}
          </div>
        </div>
      </div>
    </div>
  );
}
