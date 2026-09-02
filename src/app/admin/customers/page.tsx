"use client";

import { useMemo, useState } from "react";
import { Users, Mail, ShoppingBag, Plus, Trash2 } from "lucide-react";
import { useCustomersStore } from "@/store/customers-store";
import { useOrdersStore } from "@/store/orders-store";
import { Price } from "@/components/ui/Price";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminCustomersPage() {
  const registered = useCustomersStore((s) => s.customers);
  const hiddenEmails = useCustomersStore((s) => s.hiddenEmails);
  const addCustomer = useCustomersStore((s) => s.addCustomer);
  const removeCustomer = useCustomersStore((s) => s.removeCustomer);
  const orders = useOrdersStore((s) => s.orders);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const customers = useMemo(() => {
    const hidden = new Set(hiddenEmails.map((e) => e.toLowerCase()));
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
      if (!hidden.has(c.email.toLowerCase())) {
        map.set(c.email.toLowerCase(), { ...c });
      }
    });

    orders.forEach((order) => {
      const email = order.customer?.email;
      if (!email) return;
      const key = email.toLowerCase();
      if (hidden.has(key)) return;

      const existing = map.get(key);
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += order.totals.total;
        existing.lastOrderAt = new Date(order.createdAt).toLocaleDateString();
        if (order.customer.phone) existing.phone = order.customer.phone;
        if (order.customer.fullName) existing.name = order.customer.fullName;
      } else {
        map.set(key, {
          id: `cust-${key}`,
          name: order.customer.fullName || email.split("@")[0],
          email,
          phone: order.customer.phone,
          orderCount: 1,
          totalSpent: order.totals.total,
          lastOrderAt: new Date(order.createdAt).toLocaleDateString(),
        });
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => b.totalSpent - a.totalSpent
    );
  }, [registered, orders, hiddenEmails]);

  const handleAdd = () => {
    setFormError("");
    const ok = addCustomer({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
    });
    if (!ok) {
      setFormError("Enter name and email. Email must be unique.");
      return;
    }
    setForm({ name: "", email: "", phone: "" });
    setShowAddForm(false);
  };

  const handleRemove = (email: string, name: string) => {
    if (!confirm(`Remove ${name} from the customer list?`)) return;
    removeCustomer(email);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal">Customers</h1>
          <p className="text-charcoal/60">
            {customers.length} customer{customers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus size={16} />
          Add Customer
        </Button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-charcoal/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm p-6 w-full max-w-md">
            <h2 className="font-semibold text-lg text-charcoal mb-4">Add Customer</h2>
            <div className="space-y-4">
              <Input
                label="Full name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Sara Ahmed"
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="customer@email.com"
              />
              <Input
                label="Phone (optional)"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+971 50 000 0000"
              />
              {formError && (
                <p className="text-sm text-red-600">{formError}</p>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <Button className="flex-1" onClick={handleAdd}>
                Add Customer
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowAddForm(false);
                  setFormError("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {customers.length === 0 ? (
        <div className="bg-white rounded-sm border border-cream-dark p-12 text-center">
          <Users size={48} className="mx-auto text-charcoal/20 mb-4" />
          <h2 className="text-lg font-medium text-charcoal mb-2">No customers yet</h2>
          <p className="text-charcoal/50 text-sm max-w-md mx-auto mb-6">
            Customers appear here when they place an order, create an account, or when you add them manually.
          </p>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus size={16} />
            Add Customer
          </Button>
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
                <th className="text-right p-4 font-medium text-charcoal/60">Actions</th>
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
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemove(customer.email, customer.name)}
                      className="inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      title="Remove customer"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
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
