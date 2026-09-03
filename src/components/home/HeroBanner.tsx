"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Wrench } from "lucide-react";
import type { Banner } from "@/types";
import { useSettingsStore } from "@/store/settings-store";

interface HeroBannerProps {
  banners: Banner[];
}

export function HeroBanner({ banners }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const storeName = useSettingsStore((s) => s.storeName);
  const tagline = useSettingsStore((s) => s.tagline);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[current];
  const isRepairBanner = banner.link === "/repair";

  return (
    <section className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden bg-charcoal">
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={b.image}
            alt={b.title}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/40 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center">
        <div className="max-w-xl animate-fade-in">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3 font-medium">
            {storeName}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-cream leading-tight mb-4">
            {banner.title}
          </h2>
          {banner.subtitle && (
            <p className="text-cream/80 text-base sm:text-lg mb-8">{banner.subtitle}</p>
          )}
          <div className="flex flex-wrap gap-3">
            {banner.link && (
              <Link
                href={banner.link}
                className="inline-block bg-burgundy text-cream px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-burgundy-dark transition-colors"
              >
                {isRepairBanner ? "Book a Repair" : "Shop Now"}
              </Link>
            )}
            {!isRepairBanner && (
              <Link
                href="/repair"
                className="inline-flex items-center gap-2 border border-cream/30 text-cream px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-cream/10 transition-colors"
              >
                <Wrench size={16} />
                Book a Repair
              </Link>
            )}
          </div>
          <p className="text-cream/50 text-sm mt-6 hidden sm:block">{tagline}</p>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? "bg-gold w-8" : "bg-cream/40 hover:bg-cream/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <button
        onClick={() => setCurrent((prev) => (prev - 1 + banners.length) % banners.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-cream/10 hover:bg-cream/20 text-cream rounded-full backdrop-blur-sm transition-colors hidden sm:block"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % banners.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-cream/10 hover:bg-cream/20 text-cream rounded-full backdrop-blur-sm transition-colors hidden sm:block"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>
    </section>
  );
}
