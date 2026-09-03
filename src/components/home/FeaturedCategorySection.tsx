"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Wrench, Flame } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { useCatalogStore } from "@/store/catalog-store";

export function FeaturedCategorySection() {
  const getProductsByCategory = useCatalogStore((s) => s.getProductsByCategory);
  const commercial = getProductsByCategory("commercial-stoves");
  const double = getProductsByCategory("double-burner");
  const featured = [...commercial.slice(0, 2), ...double.slice(0, 2)];
  const heroProduct = commercial[0] ?? double[0];
  const heroImage = heroProduct?.images[0];

  if (featured.length === 0) return null;

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal to-burgundy/90" />
      <div className="absolute inset-0 opacity-20">
        {heroImage && (
          <Image src={heroImage} alt="NL-GAS stoves" fill className="object-cover" sizes="100vw" unoptimized />
        )}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-12 lg:mb-16">
          <div className="text-cream">
            <div className="inline-flex items-center gap-2 bg-gold/20 text-gold px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-4">
              <Flame size={14} />
              NL-GAS Brand
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Home &amp; Commercial Gas Stoves
            </h2>
            <p className="text-cream/75 text-lg leading-relaxed mb-6 max-w-lg">
              Single burner, double burner, 4-burner and 6-burner restaurant stoves.
              Built for Kerala homes, hotels and food businesses.
            </p>
            <ul className="space-y-2 text-cream/70 text-sm mb-8">
              <li>• NL-GAS-SB / DB — home single &amp; double burner</li>
              <li>• NL-GAS-RS401 / RS601 — restaurant commercial range</li>
              <li>• NL-GAS-RS101 — big single burner for large vessels</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop?category=commercial-stoves"
                className="inline-flex items-center gap-2 bg-gold text-charcoal px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-gold-light transition-colors"
              >
                Commercial Range
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/repair"
                className="inline-flex items-center gap-2 border border-cream/30 text-cream px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-cream/10 transition-colors"
              >
                <Wrench size={16} />
                Book Repair
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/5] max-h-[520px] rounded-sm overflow-hidden border border-cream/10 shadow-2xl">
            {heroImage && (
              <Image src={heroImage} alt="Featured NL-GAS stove" fill className="object-cover" sizes="50vw" priority unoptimized />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal/90 to-transparent p-6">
              <p className="text-gold text-xs tracking-widest uppercase mb-1">{heroProduct?.sku}</p>
              <p className="text-cream font-display text-xl font-semibold">{heroProduct?.name}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-gold text-sm tracking-[0.2em] uppercase mb-2">Top Models</p>
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-cream">Popular NL-GAS Stoves</h3>
            </div>
            <Link href="/shop?category=gas-kitchen" className="hidden sm:inline-flex items-center gap-1 text-gold hover:text-gold-light text-sm font-medium">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {featured.map((product) => (
              <div key={product.id} className="bg-cream/95 rounded-sm p-2 hover:bg-cream transition-colors">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
