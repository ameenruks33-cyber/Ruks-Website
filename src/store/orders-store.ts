"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StoredOrder {
  orderNumber: string;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  total: number;
  items: { name: string; quantity: number; price: number }[];
  email: string;
  createdAt: string;
}

interface OrdersState {
  orders: StoredOrder[];
  addOrder: (order: StoredOrder) => void;
  getOrder: (orderNumber: string) => StoredOrder | undefined;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order) =>
        set((state) => ({ orders: [order, ...state.orders] })),

      getOrder: (orderNumber) =>
        get().orders.find(
          (o) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase()
        ),
    }),
    { name: "rukza-orders" }
  )
);
