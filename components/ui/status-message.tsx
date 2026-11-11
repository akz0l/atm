import { CircleCheckBig, CircleExclamationPoint } from "lucide-react";
import type { ReactNode } from "react";

interface StatusMessageProps {
  tone: "error" | "success";
  children: ReactNode;
  className?: string;
}

export function StatusMessage({ tone, children, className = "" }: StatusMessageProps) {
  const Icon = tone === "error" ? CircleExclamationPoint : CircleCheckBig;
  const toneClass = tone === "error" ? "text-danger" : "text-success";

  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-2.5 text-[0.9375rem] leading-snug ${toneClass} ${className}`}
    >
      <Icon aria-hidden className="mt-0.5 size-[1.125rem] shrink-0" strokeWidth={2} />
      <span>{children}</span>
    </p>
  );
}
