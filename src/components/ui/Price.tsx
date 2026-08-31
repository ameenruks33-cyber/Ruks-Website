"use client";

import { useSettingsStore } from "@/store/settings-store";

interface PriceProps {
  amount: number;
  className?: string;
}

export function Price({ amount, className }: PriceProps) {
  const formatPrice = useSettingsStore((s) => s.formatPrice);
  return <span className={className}>{formatPrice(amount)}</span>;
}

export function useFormatPrice() {
  return useSettingsStore((s) => s.formatPrice);
}
