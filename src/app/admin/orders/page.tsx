"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageCircle, Phone, Mail, MapPin, RefreshCw, ShoppingCart } from "lucide-react";
import type { OrderStatus, StoredOrder } from "@/lib/order-types";
import { useOrdersStore } from "@/store/orders-store";
import { Price } from "@/components/ui/Price";
import { Button } from "@/components/ui/Button";

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export default function AdminOrdersPage() {
  const localOrders = useOrdersStore((s) => s.orders);
  const setOrders = useOrdersStore((s) => s.setOrders);
  const [orders, setServerOrders] = useState<StoredOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        const fetched = data.orders as StoredOrder[];
        setServerOrders(fetched);
        setOrders(fetched);
      } else {
        setError("Could not load orders from server.");
        setServerOrders(localOrders);
      }
    } catch {
      setServerOrders(localOrders);
      setError("Showing cached orders only. Refresh when online.");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setOrders]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (orderNumber: string, status: OrderStatus) => {
    setUpdating(orderNumber);
    try {
      const res = await fetch(`/api/orders/${orderNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      setServerOrders((prev) =>
        prev.map((o) => (o.orderNumber === orderNumber ? data.order : o))
      );
      setOrders(
        useOrdersStore
          .getState()
          .orders.map((o) => (o.orderNumber === orderNumber ? data.order : o))
      );
    } catch {
      alert("Could not update order status.");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal mb-2">Orders</h1>
          <p className="text-charcoal/60">
            {orders.length} order{orders.length !== 1 ? "s" : ""} — customer details and WhatsApp alerts
          </p>
        </div>
        <Button variant="outline" onClick={loadOrders} disabled={loading}>
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {error && (
        <p className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-sm px-4 py-3">
          {error}
        </p>
      )}

      {loading && orders.length === 0 ? (
        <div className="bg-white rounded-sm border border-cream-dark p-12 text-center text-charcoal/50">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-sm border border-cream-dark p-12 text-center">
          <ShoppingCart size={48} className="mx-auto text-charcoal/20 mb-4" />
          <h2 className="text-lg font-medium text-charcoal mb-2">No orders yet</h2>
          <p className="text-charcoal/50 text-sm max-w-md mx-auto">
            When a customer completes checkout, their full details appear here and you get a WhatsApp alert.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isOpen = expandedOrder === order.orderNumber;
            const address = [
              order.address.line1,
              order.address.line2,
              order.address.city,
              order.address.postalCode,
              order.address.country,
            ]
              .filter(Boolean)
              .join(", ");

            return (
              <div
                key={order.orderNumber}
                className="bg-white rounded-sm border border-cream-dark overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedOrder(isOpen ? null : order.orderNumber)
                  }
                  className="w-full text-left p-4 sm:p-5 hover:bg-cream-dark/10 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="font-semibold text-burgundy">{order.orderNumber}</p>
                      <p className="text-sm text-charcoal/70 mt-1">
                        {order.customer.fullName} · {order.customer.phone}
                      </p>
                      <p className="text-xs text-charcoal/50 mt-1">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {order.whatsappNotified && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-sm inline-flex items-center gap-1">
                          <MessageCircle size={12} />
                          WhatsApp sent
                        </span>
                      )}
                      <span className="text-xs bg-burgundy/10 text-burgundy px-2 py-1 rounded-sm capitalize">
                        {order.status.toLowerCase()}
                      </span>
                      <span className="font-semibold">
                        <Price amount={order.totals.total} />
                      </span>
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-cream-dark p-4 sm:p-5 bg-cream-dark/10 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p className="font-medium text-charcoal">Customer</p>
                        <p className="flex items-center gap-2 text-charcoal/70">
                          <Mail size={14} />
                          {order.customer.email}
                        </p>
                        <p className="flex items-center gap-2 text-charcoal/70">
                          <Phone size={14} />
                          {order.customer.phone}
                        </p>
                        <p className="flex items-start gap-2 text-charcoal/70">
                          <MapPin size={14} className="mt-0.5" />
                          {address}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium text-charcoal">Delivery & Payment</p>
                        <p className="text-charcoal/70">
                          {order.shipping.methodName} —{" "}
                          <Price amount={order.shipping.cost} />
                        </p>
                        <p className="text-charcoal/70">{order.payment.methodName}</p>
                        {order.totals.couponCode && (
                          <p className="text-green-700">
                            Coupon: {order.totals.couponCode} (-
                            <Price amount={order.totals.discount} />)
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-charcoal mb-2">Items</p>
                      <div className="space-y-2 text-sm">
                        {order.items.map((item, index) => (
                          <div
                            key={`${item.variantId ?? item.name}-${index}`}
                            className="flex justify-between gap-4 text-charcoal/70"
                          >
                            <span>
                              {item.name}
                              {item.size ? ` · ${item.size}` : ""}
                              {item.color ? ` · ${item.color}` : ""} ×{item.quantity}
                            </span>
                            <span>
                              <Price amount={item.price * item.quantity} />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <label className="text-sm text-charcoal/70">
                        Update status:
                        <select
                          value={order.status}
                          disabled={updating === order.orderNumber}
                          onChange={(e) =>
                            handleStatusChange(
                              order.orderNumber,
                              e.target.value as OrderStatus
                            )
                          }
                          className="ml-2 border border-cream-dark rounded-sm px-2 py-1 bg-white"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
