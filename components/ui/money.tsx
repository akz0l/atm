import { formatUsd } from "@/lib/format";

type NumeralStep = "display" | "large" | "medium" | "small";

const STEP_CLASSES: Record<NumeralStep, string> = {
  display: "num-display",
  large: "num-large",
  medium: "num-medium",
  small: "num-small",
};

interface MoneyProps {
  amount: string;
  step: NumeralStep;
  className?: string;
}

/** Every amount in the product renders through one of the four numeral steps. */
export function Money({ amount, step, className = "" }: MoneyProps) {
  return <span className={`${STEP_CLASSES[step]} ${className}`}>{formatUsd(amount)}</span>;
}
