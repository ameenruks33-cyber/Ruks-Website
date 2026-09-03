import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-burgundy text-ink hover:bg-burgundy-dark shadow-sm btn-press font-semibold tracking-wide",
  secondary:
    "bg-gold text-ink hover:bg-gold-light shadow-sm btn-press font-semibold",
  outline:
    "border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-ink btn-press",
  ghost: "text-charcoal hover:bg-cream-dark hover:text-burgundy",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
