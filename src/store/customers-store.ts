"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string;
  registeredAt: string;
}

interface CustomersState {
  customers: Customer[];
  upsertFromOrder: (data: {
    email: string;
    name?: string;
    phone?: string;
    orderTotal: number;
    orderDate: string;
  }) => void;
  registerCustomer: (data: { name: string; email: string; phone?: string }) => void;
}

export const useCustomersStore = create<CustomersState>()(
  persist(
    (set, get) => ({
      customers: [],

      upsertFromOrder: ({ email, name, phone, orderTotal, orderDate }) => {
        const existing = get().customers.find(
          (c) => c.email.toLowerCase() === email.toLowerCase()
        );
        if (existing) {
          set({
            customers: get().customers.map((c) =>
              c.email.toLowerCase() === email.toLowerCase()
                ? {
                    ...c,
                    name: name || c.name,
                    phone: phone || c.phone,
                    orderCount: c.orderCount + 1,
                    totalSpent: c.totalSpent + orderTotal,
                    lastOrderAt: orderDate,
                  }
                : c
            ),
          });
        } else {
          set({
            customers: [
              {
                id: `cust-${Date.now()}`,
                name: name || email.split("@")[0],
                email,
                phone,
                orderCount: 1,
                totalSpent: orderTotal,
                lastOrderAt: orderDate,
                registeredAt: orderDate,
              },
              ...get().customers,
            ],
          });
        }
      },

      registerCustomer: ({ name, email, phone }) => {
        const exists = get().customers.some(
          (c) => c.email.toLowerCase() === email.toLowerCase()
        );
        if (exists) return;
        set({
          customers: [
            {
              id: `cust-${Date.now()}`,
              name,
              email,
              phone,
              orderCount: 0,
              totalSpent: 0,
              lastOrderAt: "—",
              registeredAt: new Date().toLocaleDateString(),
            },
            ...get().customers,
          ],
        });
      },
    }),
    { name: "rukza-customers" }
  )
);
