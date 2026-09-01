"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, Banknote, Smartphone, CheckCircle } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { validateCoupon, useCatalogStore } from "@/store/catalog-store";
import { useOrdersStore } from "@/store/orders-store";
import { useCustomersStore } from "@/store/customers-store";
import { useSettingsStore } from "@/store/settings-store";
import { useFormatPrice } from "@/components/ui/Price";
import { PAYMENT_METHODS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function CheckoutPage() {
  const { items, getSubtotal, couponCode, couponDiscount, applyCoupon, removeCoupon, clearCart } =
    useCartStore();
  const coupons = useCatalogStore((s) => s.coupons);
  const addOrder = useOrdersStore((s) => s.addOrder);
  const upsertFromOrder = useCustomersStore((s) => s.upsertFromOrder);
  const formatPrice = useFormatPrice();
  const {
    currency,
    freeShippingThreshold,
    standardShippingPrice,
    expressShippingPrice,
  } = useSettingsStore();

  const shippingMethods = [
    { id: "standard", name: "Standard Delivery", price: standardShippingPrice, days: "3-5 business days" },
    { id: "express", name: "Express Delivery", price: expressShippingPrice, days: "1-2 business days" },
    { id: "pickup", name: "Store Pickup", price: 0, days: "Same day" },
  ];
  const [step, setStep] = useState<"details" | "payment" | "success">("details");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState("");

  const [form, setForm] = useState({
    email: "",
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    postalCode: "",
    country: "UAE",
  });

  const subtotal = getSubtotal();
  const shipping = shippingMethods.find((m) => m.id === shippingMethod);
  const shippingCost =
    subtotal >= freeShippingThreshold && shippingMethod === "standard"
      ? 0
      : (shipping?.price ?? standardShippingPrice);
  const total = subtotal - couponDiscount + shippingCost;

  if (items.length === 0 && step !== "success") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold mb-4">Nothing to Checkout</h1>
        <Link href="/shop"><Button>Go Shopping</Button></Link>
      </div>
    );
  }

  const handleApplyCoupon = () => {
    const result = validateCoupon(couponInput, subtotal, coupons, currency);
    if (result.valid) {
      applyCoupon(couponInput.toUpperCase(), result.discount);
      setCouponError("");
    } else {
      setCouponError(result.message || "Invalid coupon");
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setOrderError("");

    const shipping = shippingMethods.find((m) => m.id === shippingMethod);
    const payment = PAYMENT_METHODS.find((m) => m.id === paymentMethod);

    const payload = {
      items: items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
        image: item.image,
      })),
      customer: {
        email: form.email,
        fullName: form.fullName,
        phone: form.phone,
      },
      address: {
        line1: form.line1,
        line2: form.line2 || undefined,
        city: form.city,
        postalCode: form.postalCode || undefined,
        country: form.country,
      },
      shipping: {
        method: shippingMethod,
        methodName: shipping?.name ?? "Standard Delivery",
        cost: shippingCost,
      },
      payment: {
        method: paymentMethod,
        methodName: payment?.name ?? paymentMethod,
      },
      totals: {
        subtotal,
        discount: couponDiscount,
        shipping: shippingCost,
        total,
        currency,
        couponCode: couponCode || undefined,
      },
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not place order");
      }

      const data = await res.json();
      const order = data.order;

      addOrder(order);
      upsertFromOrder({
        email: form.email,
        name: form.fullName,
        phone: form.phone,
        orderTotal: total,
        orderDate: new Date(order.createdAt).toLocaleDateString(),
      });

      setOrderNumber(order.orderNumber);
      clearCart();
      setStep("success");
    } catch (error) {
      setOrderError(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <CheckCircle size={64} className="mx-auto text-green-600 mb-6" />
        <h1 className="font-display text-3xl font-bold text-charcoal mb-3">Order Confirmed!</h1>
        <p className="text-charcoal/60 mb-2">Thank you for your purchase.</p>
        <p className="text-lg font-semibold text-burgundy mb-8">Order #{orderNumber}</p>
        <p className="text-sm text-charcoal/50 mb-8">
          We&apos;ll contact you at {form.email || "your email"} with delivery updates.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/shop"><Button variant="outline">Continue Shopping</Button></Link>
          <Link href="/account/orders"><Button>Track Order</Button></Link>
        </div>
      </div>
    );
  }

  const paymentIcons: Record<string, React.ReactNode> = {
    card: <CreditCard size={20} />,
    apple_pay: <Smartphone size={20} />,
    cod: <Banknote size={20} />,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <h1 className="font-display text-3xl lg:text-4xl font-bold text-charcoal mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-10 text-sm">
        <span className={step === "details" ? "text-burgundy font-semibold" : "text-charcoal/40"}>
          1. Details
        </span>
        <div className="flex-1 h-px bg-cream-dark" />
        <span className={step === "payment" ? "text-burgundy font-semibold" : "text-charcoal/40"}>
          2. Payment
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-8">
          {step === "details" && (
            <>
              <section className="bg-white p-6 rounded-sm border border-cream-dark">
                <h2 className="font-semibold text-lg mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Input
                      label="Email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Full Name"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </section>

              <section className="bg-white p-6 rounded-sm border border-cream-dark">
                <h2 className="font-semibold text-lg mb-6">Delivery Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Input
                      label="Address Line 1"
                      required
                      value={form.line1}
                      onChange={(e) => setForm({ ...form, line1: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="Address Line 2 (optional)"
                      value={form.line2}
                      onChange={(e) => setForm({ ...form, line2: e.target.value })}
                    />
                  </div>
                  <Input
                    label="City"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                  <Input
                    label="Postal Code"
                    value={form.postalCode}
                    onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  />
                </div>
              </section>

              <section className="bg-white p-6 rounded-sm border border-cream-dark">
                <h2 className="font-semibold text-lg mb-6">Delivery Method</h2>
                <div className="space-y-3">
                  {shippingMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-colors ${
                        shippingMethod === method.id
                          ? "border-burgundy bg-burgundy/5"
                          : "border-cream-dark hover:border-burgundy/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          value={method.id}
                          checked={shippingMethod === method.id}
                          onChange={() => setShippingMethod(method.id)}
                          className="accent-burgundy"
                        />
                        <div>
                          <p className="font-medium text-sm">{method.name}</p>
                          <p className="text-xs text-charcoal/50">{method.days}</p>
                        </div>
                      </div>
                      <span className="font-medium text-sm">
                        {method.price === 0
                          ? "Free"
                          : subtotal >= freeShippingThreshold && method.id === "standard"
                            ? "Free"
                            : formatPrice(method.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              <Button size="lg" onClick={() => setStep("payment")} className="w-full sm:w-auto">
                Continue to Payment
              </Button>
            </>
          )}

          {step === "payment" && (
            <>
              <section className="bg-white p-6 rounded-sm border border-cream-dark">
                <h2 className="font-semibold text-lg mb-6">Payment Method</h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 p-4 border rounded-sm cursor-pointer transition-colors ${
                        paymentMethod === method.id
                          ? "border-burgundy bg-burgundy/5"
                          : "border-cream-dark hover:border-burgundy/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="accent-burgundy"
                      />
                      {paymentIcons[method.id]}
                      <span className="font-medium text-sm">{method.name}</span>
                    </label>
                  ))}
                </div>
              </section>

              {paymentMethod === "card" && (
                <section className="bg-white p-6 rounded-sm border border-cream-dark">
                  <h2 className="font-semibold text-lg mb-6">Card Details</h2>
                  <p className="text-sm text-charcoal/50 mb-4">
                    Payment integration (Stripe/PayTabs) will be connected here in production.
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    <Input label="Card Number" placeholder="4242 4242 4242 4242" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Expiry" placeholder="MM/YY" />
                      <Input label="CVC" placeholder="123" />
                    </div>
                  </div>
                </section>
              )}

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep("details")}>
                  Back
                </Button>
                <Button size="lg" onClick={handlePlaceOrder} disabled={loading}>
                  {loading ? "Processing..." : `Pay ${formatPrice(total)}`}
                </Button>
              </div>
              {orderError && (
                <p className="text-sm text-red-500">{orderError}</p>
              )}
            </>
          )}
        </div>

        {/* Order summary sidebar */}
        <div>
          <div className="bg-white p-6 rounded-sm border border-cream-dark sticky top-28">
            <h2 className="font-display text-xl font-bold mb-6">Your Order</h2>

            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-3">
                  <div className="relative w-16 h-20 flex-shrink-0 rounded-sm overflow-hidden bg-cream-dark">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                    <p className="text-xs text-charcoal/50">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium mt-1">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="mb-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={handleApplyCoupon} className="mt-auto">
                  Apply
                </Button>
              </div>
              {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
              {couponCode && (
                <div className="flex items-center justify-between mt-2 text-sm text-green-600">
                  <span>{couponCode} applied</span>
                  <button onClick={removeCoupon} className="text-xs underline">Remove</button>
                </div>
              )}
            </div>

            <div className="space-y-2 text-sm border-t border-cream-dark pt-4">
              <div className="flex justify-between">
                <span className="text-charcoal/60">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-charcoal/60">Shipping</span>
                <span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-cream-dark">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
