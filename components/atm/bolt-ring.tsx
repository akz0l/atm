import { PIN_LENGTH } from "@/lib/validations/pin";

const BOLTS = 12;
const BOLTS_PER_DIGIT = BOLTS / PIN_LENGTH;

interface BoltRingProps {
  /** Number of PIN digits entered. */
  digits: number;
  open: boolean;
  /** Changes on every rejected attempt to replay the shake. */
  failedAttempts: number;
  hasError: boolean;
}

/**
 * The vault-door bolt ring: three bolts retract (in gold) per PIN digit,
 * the ring turns open when the PIN is accepted, and shakes shut on a wrong PIN.
 */
export function BoltRing({ digits, open, failedAttempts, hasError }: BoltRingProps) {
  return (
    <div
      key={failedAttempts}
      className={`relative mx-auto size-64 ${hasError ? "animate-shake" : ""}`}
      aria-hidden
    >
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out-expo"
        style={{ transform: open ? "rotate(45deg)" : "none" }}
      >
        <div className="absolute inset-6 rounded-full border border-steel-5" />
        <div className="absolute inset-12 rounded-full border border-dashed border-steel-5" />
        {Array.from({ length: BOLTS }, (_, index) => {
          const retracted = open || index < digits * BOLTS_PER_DIGIT;
          const color = hasError ? "bg-danger" : retracted ? "bg-gold" : "bg-steel-6";
          return (
            <span
              key={index}
              className={`absolute top-1/2 left-1/2 -mt-4 -ml-1 h-8 w-2 rounded-full transition-[transform,background-color,opacity] duration-500 ease-out-expo ${color}`}
              style={{
                transform: `rotate(${index * 30}deg) translateY(${retracted ? -124 : -104}px)`,
                opacity: open ? 0 : 1,
              }}
            />
          );
        })}
      </div>
      <div className="absolute inset-0 flex items-center justify-center gap-3.5">
        {Array.from({ length: PIN_LENGTH }, (_, index) => (
          <span
            key={index}
            className={`size-4 rounded-full border transition-colors duration-200 ${
              index < digits ? "border-ink bg-ink" : "border-steel-6 bg-transparent"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
