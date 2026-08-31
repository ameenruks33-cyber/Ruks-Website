"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CURRENCIES, DEFAULT_SETTINGS, type SiteSettings } from "@/lib/settings";

interface SettingsState extends SiteSettings {
  updateSettings: (partial: Partial<SiteSettings>) => void;
  resetSettings: () => void;
  formatPrice: (amount: number) => string;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SETTINGS,

      updateSettings: (partial) => {
        set((state) => {
          const next = { ...state, ...partial };
          if (partial.currency) {
            const found = CURRENCIES.find((c) => c.code === partial.currency);
            if (found) next.locale = found.locale;
          }
          return next;
        });
      },

      resetSettings: () => set({ ...DEFAULT_SETTINGS }),

      formatPrice: (amount: number) => {
        const { currency, locale } = get();
        try {
          return new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }).format(amount);
        } catch {
          return `${currency} ${amount.toFixed(2)}`;
        }
      },
    }),
    { name: "rukza-settings" }
  )
);
