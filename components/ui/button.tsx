import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "quiet";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  // Gold is reserved for the single primary action on a screen.
  primary: "bg-gold text-steel-1 hover:bg-gold-bright disabled:bg-steel-5 disabled:text-steel-7",
  secondary: "border border-steel-5 bg-steel-4 text-ink hover:border-steel-6 hover:bg-steel-5 disabled:text-steel-7",
  quiet: "text-steel-8 hover:bg-steel-4 hover:text-ink disabled:text-steel-7",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-[0.9375rem] font-semibold transition-colors duration-200 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
