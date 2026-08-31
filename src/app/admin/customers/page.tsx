"use client";

import { Users, Mail, ShoppingBag } from "lucide-react";
import { useCustomersStore } from "@/store/customers-store";
import { useOrdersStore } from "@/store/orders-store";
import { Price } from "@/components/ui/Price";
import { useMemo } from "react";

export default function AdminCustomersPage() {
  const registered = useCustomersStore((s) => s.customers);
  const orders = useOrdersStore((s) => s.orders);

  const customers = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        name: string;
        email: string;
        phone?: string;
        orderCount: number;
        totalSpent: number;
        lastOrderAt: string;
      }
    >();

    registered.forEach((c) => {
      map.set(c.email.toLowerCase(), { ...c });
    });

    orders.forEach((order) => {
      if (!order.email) return;
      const key = order.email.toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += order.total;
        existing.lastOrderAt = order.createdAt;
      } else {
        map.set(key, {
          id: `cust-${key}`,
          name: order.email.split("@")[0],
          email: order.email,
          orderCount: 1,
          totalSpent: order.total,
          lastOrderAt: order.createdAt,
        });
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => b.totalSpent - a.totalSpent
    );
  }, [registered, orders]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal">Customers</h1>
          <p className="text-charcoal/60">
            {customers.length} customer{customers.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {customers.length === 0 ? (
        <div className="bg-white rounded-sm border border-cream-dark p-12 text-center">
          <Users size={48} className="mx-auto text-charcoal/20 mb-4" />
          <h2 className="text-lg font-medium text-charcoal mb-2">No customers yet</h2>
          <p className="text-charcoal/50 text-sm max-w-md mx-auto">
            Customers appear here when they place an order or create an account on your store.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-sm border border-cream-dark overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-dark/30">
              <tr>
                <th className="text-left p-4 font-medium text-charcoal/60">Customer</th>
                <th className="text-left p-4 font-medium text-charcoal/60 hidden md:table-cell">Email</th>
                <th className="text-left p-4 font-medium text-charcoal/60">Orders</th>
                <th className="text-left p-4 font-medium text-charcoal/60">Total Spent</th>
                <th className="text-left p-4 font-medium text-charcoal/60 hidden sm:table-cell">Last Order</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-t border-cream-dark/50 hover:bg-cream-dark/10"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-burgundy/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-burgundy font-semibold text-sm">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        {customer.phone && (
                          <p className="text-xs text-charcoal/40">{customer.phone}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-charcoal/70">
                      <Mail size={14} />
                      {customer.email}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag size={14} className="text-charcoal/40" />
                      {customer.orderCount}
                    </div>
                  </td>
                  <td className="p-4 font-medium">
                    <Price amount={customer.totalSpent} />
                  </td>
                  <td className="p-4 text-charcoal/60 hidden sm:table-cell">
                    {customer.lastOrderAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
