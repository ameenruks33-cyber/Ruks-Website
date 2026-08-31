"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useSettingsStore } from "@/store/settings-store";
import { Price, useFormatPrice } from "@/components/ui/Price";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const formatPrice = useFormatPrice();
  const { freeShippingThreshold, standardShippingPrice } = useSettingsStore();
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : standardShippingPrice;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <ShoppingBag size={48} className="mx-auto text-charcoal/20 mb-6" />
        <h1 className="font-display text-3xl font-bold text-charcoal mb-3">Your Cart is Empty</h1>
        <p className="text-charcoal/60 mb-8">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/shop">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <h1 className="font-display text-3xl lg:text-4xl font-bold text-charcoal mb-8">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="flex gap-4 p-4 bg-white rounded-sm border border-cream-dark"
            >
              <Link
                href={`/shop/${item.slug}`}
                className="relative w-24 h-32 flex-shrink-0 overflow-hidden rounded-sm bg-cream-dark"
              >
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/shop/${item.slug}`}
                  className="font-medium text-charcoal hover:text-burgundy transition-colors line-clamp-2"
                >
                  {item.name}
                </Link>
                <div className="text-sm text-charcoal/50 mt-1 space-x-3">
                  {item.size && <span>Size: {item.size}</span>}
                  {item.color && <span>Color: {item.color}</span>}
                </div>
                <Price amount={item.price} className="font-semibold text-charcoal mt-2" />

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="p-1.5 border border-cream-dark rounded-sm hover:border-burgundy transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="p-1.5 border border-cream-dark rounded-sm hover:border-burgundy transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="p-2 text-charcoal/40 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <Price amount={item.price * item.quantity} className="font-semibold text-charcoal" />
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-sm border border-cream-dark sticky top-28">
            <h2 className="font-display text-xl font-bold text-charcoal mb-6">Order Summary</h2>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-charcoal/60">Subtotal</span>
                <Price amount={subtotal} className="font-medium" />
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/60">Shipping</span>
                <span className="font-medium">
                  {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                </span>
              </div>
              {subtotal < freeShippingThreshold && (
                <p className="text-xs text-burgundy">
                  Add {formatPrice(freeShippingThreshold - subtotal)} more for free shipping
                </p>
              )}
            </div>

            <div className="border-t border-cream-dark pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(subtotal + shippingCost)}</span>
              </div>
            </div>

            <Link href="/checkout" className="block">
              <Button size="lg" className="w-full">
                Proceed to Checkout
                <ArrowRight size={18} />
              </Button>
            </Link>

            <Link
              href="/shop"
              className="block text-center text-sm text-burgundy hover:underline mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
