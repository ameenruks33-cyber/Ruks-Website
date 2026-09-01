"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "@/components/shop/ProductCard";
import { useCatalogStore } from "@/store/catalog-store";

export function AbayaSection() {
  const getProductsByCategory = useCatalogStore((s) => s.getProductsByCategory);
  const abayas = getProductsByCategory("abayas");

  if (abayas.length === 0) return null;

  const featured = abayas.slice(0, 4);
  const heroImage = abayas[0]?.images[0];

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal to-burgundy/90" />
      <div className="absolute inset-0 opacity-20">
        {heroImage && (
          <Image
            src={heroImage}
            alt="Abaya collection"
            fill
            className="object-cover"
            sizes="100vw"
            unoptimized
          />
        )}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-12 lg:mb-16">
          <div className="text-cream">
            <div className="inline-flex items-center gap-2 bg-gold/20 text-gold px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-4">
              <Sparkles size={14} />
              Signature Collection
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Premium Abaya Collection
            </h2>
            <p className="text-cream/75 text-lg leading-relaxed mb-6 max-w-lg">
              Discover elegant abayas crafted for everyday modesty and special occasions.
              Premium fabrics, timeless designs, and sizes for every woman.
            </p>
            <ul className="space-y-2 text-cream/70 text-sm mb-8">
              <li>• Everyday & evening styles</li>
              <li>• Premium Nida & chiffon fabrics</li>
              <li>• Sizes S to XL · Custom embroidery available</li>
            </ul>
            <Link
              href="/shop?category=abayas"
              className="inline-flex items-center gap-2 bg-gold text-charcoal px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-gold-light transition-colors"
            >
              Shop All Abayas
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="relative aspect-[4/5] max-h-[520px] rounded-sm overflow-hidden border border-cream/10 shadow-2xl">
            {heroImage && (
              <Image
                src={heroImage}
                alt="Featured abaya"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                unoptimized
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal/90 to-transparent p-6">
              <p className="text-gold text-xs tracking-widest uppercase mb-1">Featured</p>
              <p className="text-cream font-display text-xl font-semibold">
                {abayas[0]?.name}
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-gold text-sm tracking-[0.2em] uppercase mb-2">Our Picks</p>
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-cream">
                Bestselling Abayas
              </h3>
            </div>
            <Link
              href="/shop?category=abayas"
              className="hidden sm:inline-flex items-center gap-1 text-gold hover:text-gold-light text-sm font-medium transition-colors"
            >
              View all
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {featured.map((product) => (
              <AbayaProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link
              href="/shop?category=abayas"
              className="inline-flex items-center gap-1 text-gold text-sm font-medium"
            >
              View all abayas
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function AbayaProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-cream/95 rounded-sm p-2 hover:bg-cream transition-colors">
      <ProductCard product={product} />
    </div>
  );
}
