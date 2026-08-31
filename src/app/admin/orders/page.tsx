"use client";

import { ShoppingCart } from "lucide-react";
import { useOrdersStore } from "@/store/orders-store";
import { Price } from "@/components/ui/Price";

export default function AdminOrdersPage() {
  const orders = useOrdersStore((s) => s.orders);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-charcoal mb-2">Orders</h1>
      <p className="text-charcoal/60 mb-8">
        {orders.length} order{orders.length !== 1 ? "s" : ""} — manage fulfillment
      </p>

      {orders.length === 0 ? (
        <div className="bg-white rounded-sm border border-cream-dark p-12 text-center">
          <ShoppingCart size={48} className="mx-auto text-charcoal/20 mb-4" />
          <h2 className="text-lg font-medium text-charcoal mb-2">No orders yet</h2>
          <p className="text-charcoal/50 text-sm max-w-md mx-auto">
            Orders appear here when customers complete checkout on your store.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-sm border border-cream-dark overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-dark/30">
              <tr>
                <th className="text-left p-4 font-medium text-charcoal/60">Order #</th>
                <th className="text-left p-4 font-medium text-charcoal/60">Customer</th>
                <th className="text-left p-4 font-medium text-charcoal/60 hidden md:table-cell">Items</th>
                <th className="text-left p-4 font-medium text-charcoal/60">Status</th>
                <th className="text-left p-4 font-medium text-charcoal/60 hidden sm:table-cell">Date</th>
                <th className="text-right p-4 font-medium text-charcoal/60">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderNumber} className="border-t border-cream-dark/50 hover:bg-cream-dark/10">
                  <td className="p-4 font-medium text-burgundy">{order.orderNumber}</td>
                  <td className="p-4 text-charcoal/70">{order.email || "Guest"}</td>
                  <td className="p-4 hidden md:table-cell text-charcoal/60">
                    {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                  </td>
                  <td className="p-4">
                    <span className="text-xs bg-burgundy/10 text-burgundy px-2 py-1 rounded-sm capitalize">
                      {order.status.toLowerCase()}
                    </span>
                  </td>
                  <td className="p-4 text-charcoal/60 hidden sm:table-cell">{order.createdAt}</td>
                  <td className="p-4 text-right font-medium">
                    <Price amount={order.total} />
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
