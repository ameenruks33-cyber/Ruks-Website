"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Heart, Truck, Shield } from "lucide-react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Price } from "@/components/ui/Price";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useSettingsStore } from "@/store/settings-store";
import { ShareProduct } from "@/components/shop/ShareProduct";
import { ProductReviews } from "@/components/shop/ProductReviews";
import type { Product, ProductVariant } from "@/types";
import { useState } from "react";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isInWishlist } = useWishlistStore();
  const freeShippingThreshold = useSettingsStore((s) => s.freeShippingThreshold);
  const formatPrice = useSettingsStore((s) => s.formatPrice);
  const inWishlist = isInWishlist(product.id);

  const price = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const sizes = [...new Set(product.variants.filter((v) => v.size).map((v) => v.size!))];
  const colors = [...new Set(product.variants.filter((v) => v.color).map((v) => v.color!))];

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      price,
      size: selectedVariant.size,
      color: selectedVariant.color,
      quantity,
      maxStock: selectedVariant.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const selectSize = (size: string) => {
    const variant =
      product.variants.find(
        (v) => v.size === size && (!selectedVariant?.color || v.color === selectedVariant.color)
      ) || product.variants.find((v) => v.size === size);
    if (variant) setSelectedVariant(variant);
  };

  const selectColor = (color: string) => {
    const variant =
      product.variants.find(
        (v) => v.color === color && (!selectedVariant?.size || v.size === selectedVariant.size)
      ) || product.variants.find((v) => v.color === color);
    if (variant) setSelectedVariant(variant);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      <div>
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-cream-dark mb-4">
          <Image
            src={product.images[selectedImage]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            unoptimized
          />
          <div className="absolute top-4 left-4 flex gap-2">
            {hasDiscount && <Badge variant="sale">-{discountPercent}%</Badge>}
            {product.isNew && <Badge variant="new">New</Badge>}
          </div>
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  "relative w-20 h-24 overflow-hidden rounded-sm border-2 transition-colors",
                  i === selectedImage ? "border-burgundy" : "border-transparent"
                )}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-xs text-charcoal/50 uppercase tracking-wider mb-2">
          {product.categoryName}
          {product.brandName && ` · ${product.brandName}`}
        </p>
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-charcoal mb-4">
          {product.name}
        </h1>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-cream-dark"
                }
              />
            ))}
          </div>
          <span className="text-sm text-charcoal/60">
            {product.rating} ({product.reviewCount} reviews)
          </span>
        </div>

        <div className="flex items-baseline gap-3 mb-8">
          <Price amount={price} className="text-3xl font-bold text-charcoal" />
          {hasDiscount && (
            <Price amount={product.price} className="text-lg text-charcoal/40 line-through" />
          )}
        </div>

        <p className="text-charcoal/70 leading-relaxed mb-8">{product.description}</p>

        {sizes.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-charcoal mb-3">
              Size: <span className="font-normal text-charcoal/60">{selectedVariant?.size}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const variant = product.variants.find((v) => v.size === size);
                const outOfStock = !variant || variant.stock === 0;
                return (
                  <button
                    key={size}
                    onClick={() => !outOfStock && selectSize(size)}
                    disabled={outOfStock}
                    className={cn(
                      "px-4 py-2 border text-sm font-medium transition-colors min-w-[48px]",
                      selectedVariant?.size === size
                        ? "border-burgundy bg-burgundy text-cream"
                        : "border-cream-dark hover:border-burgundy",
                      outOfStock && "opacity-30 cursor-not-allowed line-through"
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {colors.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-charcoal mb-3">
              Color: <span className="font-normal text-charcoal/60">{selectedVariant?.color}</span>
            </p>
            <div className="flex gap-2">
              {colors.map((color) => {
                const variant = product.variants.find((v) => v.color === color);
                const colorHex = variant?.colorHex || "#ccc";
                return (
                  <button
                    key={color}
                    onClick={() => selectColor(color)}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 transition-all",
                      selectedVariant?.color === color
                        ? "border-burgundy ring-2 ring-burgundy/30"
                        : "border-cream-dark"
                    )}
                    style={{ backgroundColor: colorHex }}
                    title={color}
                  />
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-8">
          <p className="text-sm font-medium text-charcoal mb-3">Quantity</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 border border-cream-dark rounded-sm hover:border-burgundy transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <button
              onClick={() =>
                setQuantity(Math.min(quantity + 1, selectedVariant?.stock ?? 99))
              }
              className="p-2 border border-cream-dark rounded-sm hover:border-burgundy transition-colors"
            >
              <Plus size={16} />
            </button>
            {selectedVariant && (
              <span className="text-sm text-charcoal/50 ml-2">
                {selectedVariant.stock} in stock
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-3 mb-8">
          <Button
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock === 0}
            className="flex-1"
            size="lg"
          >
            <ShoppingBag size={18} />
            {added ? "Added to Cart!" : "Add to Cart"}
          </Button>
          <button
            onClick={() =>
              toggle({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                image: product.images[0],
                price,
              })
            }
            className={`p-4 border rounded-sm transition-colors ${
              inWishlist
                ? "border-burgundy text-burgundy bg-burgundy/5"
                : "border-cream-dark hover:border-burgundy hover:text-burgundy"
            }`}
            aria-label="Add to wishlist"
          >
            <Heart size={20} className={inWishlist ? "fill-burgundy" : ""} />
          </button>
        </div>

        <ShareProduct productName={product.name} productSlug={product.slug} price={price} />

        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-cream-dark mt-6">
          <div className="flex items-center gap-3">
            <Truck size={20} className="text-burgundy" />
            <div>
              <p className="text-sm font-medium">Free Shipping</p>
              <p className="text-xs text-charcoal/50">On orders over {formatPrice(freeShippingThreshold)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-burgundy" />
            <div>
              <p className="text-sm font-medium">Secure Payment</p>
              <p className="text-xs text-charcoal/50">100% protected checkout</p>
            </div>
          </div>
        </div>
      </div>

      <ProductReviews
        productId={product.id}
        productName={product.name}
        defaultRating={product.rating}
        defaultCount={product.reviewCount}
      />
    </div>
  );
}
