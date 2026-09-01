"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StoredOrder } from "@/lib/order-types";

interface OrdersState {
  orders: StoredOrder[];
  addOrder: (order: StoredOrder) => void;
  setOrders: (orders: StoredOrder[]) => void;
  getOrder: (orderNumber: string) => StoredOrder | undefined;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order) =>
        set((state) => ({
          orders: [
            order,
            ...state.orders.filter((o) => o.orderNumber !== order.orderNumber),
          ],
        })),

      setOrders: (orders) => set({ orders }),

      getOrder: (orderNumber) =>
        get().orders.find(
          (o) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase()
        ),
    }),
    { name: "rukza-orders" }
  )
);

export type { StoredOrder };
