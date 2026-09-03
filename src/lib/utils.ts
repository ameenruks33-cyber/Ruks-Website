import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "AED"): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateOrderNumber(): string {
  const date = new Date();
  const prefix = `NCX${date.getFullYear().toString().slice(-2)}${String(date.getMonth() + 1).padStart(2, "0")}`;
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const random = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  return `${prefix}-${random}`;
}
