import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "sale" | "new" | "default";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-sm",
        variant === "sale" && "bg-burgundy text-ink",
        variant === "new" && "bg-gold text-ink",
        variant === "default" && "bg-cream-dark text-charcoal",
        className
      )}
    >
      {children}
    </span>
  );
}
