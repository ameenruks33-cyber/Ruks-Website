"use client";

import { useState } from "react";
import { Package, Search } from "lucide-react";
import { useOrdersStore } from "@/store/orders-store";
import { useFormatPrice } from "@/components/ui/Price";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const STATUS_STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Order Placed",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [searched, setSearched] = useState(false);
  const getOrder = useOrdersStore((s) => s.getOrder);
  const formatPrice = useFormatPrice();

  const order = searched ? getOrder(orderNumber) : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const currentStep = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <Package size={48} className="mx-auto text-burgundy mb-4" />
        <h1 className="font-display text-3xl font-bold text-charcoal mb-2">Track Your Order</h1>
        <p className="text-charcoal/60">Enter your order number to see delivery status</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-10">
        <Input
          placeholder="e.g. RZ260812345"
          value={orderNumber}
          onChange={(e) => { setOrderNumber(e.target.value); setSearched(false); }}
          className="flex-1"
        />
        <Button type="submit">
          <Search size={16} />
          Track
        </Button>
      </form>

      {searched && !order && (
        <div className="bg-white border border-cream-dark rounded-sm p-8 text-center">
          <p className="text-charcoal/60">Order not found. Check your order number or email confirmation.</p>
        </div>
      )}

      {order && (
        <div className="bg-white border border-cream-dark rounded-sm p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-charcoal/50">Order Number</p>
              <p className="font-bold text-lg text-burgundy">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-charcoal/50">Total</p>
              <p className="font-bold">{formatPrice(order.total)}</p>
            </div>
          </div>

          {/* Progress tracker */}
          <div className="py-4">
            <div className="flex justify-between relative">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-cream-dark" />
              <div
                className="absolute top-4 left-0 h-0.5 bg-burgundy transition-all"
                style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
              />
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="relative flex flex-col items-center z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      i <= currentStep ? "bg-burgundy text-cream" : "bg-cream-dark text-charcoal/40"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <p className={`text-[10px] mt-2 text-center max-w-[60px] ${
                    i <= currentStep ? "text-burgundy font-medium" : "text-charcoal/40"
                  }`}>
                    {STATUS_LABELS[step]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium text-charcoal mb-3">Items</p>
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm py-2 border-b border-cream-dark/50 last:border-0">
                <span>{item.name} × {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-charcoal/40">Ordered on {order.createdAt}</p>
        </div>
      )}
    </div>
  );
}
