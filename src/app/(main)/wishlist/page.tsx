"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import { Price } from "@/components/ui/Price";
import { Button } from "@/components/ui/Button";

export default function WishlistPage() {
  const { items, remove } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Heart size={48} className="mx-auto text-charcoal/20 mb-6" />
        <h1 className="font-display text-3xl font-bold text-charcoal mb-3">Your Wishlist</h1>
        <p className="text-charcoal/60 mb-8">Save items you love — like Amazon &amp; Flipkart wishlists.</p>
        <Link href="/shop"><Button>Browse Products</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-charcoal mb-8">
        Wishlist ({items.length})
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {items.map((item) => (
          <div key={item.productId} className="group">
            <Link href={`/shop/${item.slug}`} className="block relative aspect-[3/4] overflow-hidden rounded-sm bg-cream-dark mb-3">
              <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform" unoptimized />
            </Link>
            <Link href={`/shop/${item.slug}`}>
              <h3 className="font-medium text-sm text-charcoal hover:text-burgundy line-clamp-2">{item.name}</h3>
            </Link>
            <Price amount={item.price} className="font-semibold text-sm mt-1" />
            <div className="flex gap-2 mt-3">
              <Link href={`/shop/${item.slug}`} className="flex-1">
                <Button size="sm" className="w-full">
                  <ShoppingBag size={14} />
                  View
                </Button>
              </Link>
              <button onClick={() => remove(item.productId)} className="p-2 border border-cream-dark rounded-sm hover:text-red-500">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
