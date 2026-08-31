"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  toggle: (item: Omit<WishlistItem, "addedAt">) => void;
  remove: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.productId === item.productId);
          if (exists) {
            return { items: state.items.filter((i) => i.productId !== item.productId) };
          }
          return {
            items: [...state.items, { ...item, addedAt: new Date().toISOString() }],
          };
        }),

      remove: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

      isInWishlist: (productId) => get().items.some((i) => i.productId === productId),

      clear: () => set({ items: [] }),
    }),
    { name: "rukza-wishlist" }
  )
);
