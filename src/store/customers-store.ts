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
  hiddenEmails: string[];
  upsertFromOrder: (data: {
    email: string;
    name?: string;
    phone?: string;
    orderTotal: number;
    orderDate: string;
  }) => void;
  registerCustomer: (data: { name: string; email: string; phone?: string }) => void;
  addCustomer: (data: { name: string; email: string; phone?: string }) => boolean;
  removeCustomer: (email: string) => void;
}

export const useCustomersStore = create<CustomersState>()(
  persist(
    (set, get) => ({
      customers: [],
      hiddenEmails: [],

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
        get().addCustomer({ name, email, phone });
      },

      addCustomer: ({ name, email, phone }) => {
        const normalizedEmail = email.trim().toLowerCase();
        if (!name.trim() || !normalizedEmail) return false;

        const exists = get().customers.some(
          (c) => c.email.toLowerCase() === normalizedEmail
        );
        if (exists) return false;

        const hidden = get().hiddenEmails.filter((e) => e !== normalizedEmail);

        set({
          hiddenEmails: hidden,
          customers: [
            {
              id: `cust-${Date.now()}`,
              name: name.trim(),
              email: normalizedEmail,
              phone: phone?.trim() || undefined,
              orderCount: 0,
              totalSpent: 0,
              lastOrderAt: "—",
              registeredAt: new Date().toLocaleDateString(),
            },
            ...get().customers,
          ],
        });
        return true;
      },

      removeCustomer: (email) => {
        const normalizedEmail = email.trim().toLowerCase();
        set({
          customers: get().customers.filter(
            (c) => c.email.toLowerCase() !== normalizedEmail
          ),
          hiddenEmails: get().hiddenEmails.includes(normalizedEmail)
            ? get().hiddenEmails
            : [...get().hiddenEmails, normalizedEmail],
        });
      },
    }),
    { name: "rukza-customers" }
  )
);
