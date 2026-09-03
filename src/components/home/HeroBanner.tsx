"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Banner } from "@/types";
import { useSettingsStore } from "@/store/settings-store";
import { isSafeInternalHref } from "@/lib/safe-url";

interface HeroBannerProps {
  banners: Banner[];
}

export function HeroBanner({ banners }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const storeName = useSettingsStore((s) => s.storeName);
  const tagline = useSettingsStore((s) => s.tagline);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[current];

  return (
    <section className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden bg-ink">
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
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center">
        <div className="max-w-xl animate-rise-in">
          <p className="text-burgundy text-sm tracking-[0.3em] uppercase mb-3 font-semibold">
            {/^nexcart\s*x$/i.test(storeName.trim()) ? (
              <>
                NexCart{" "}
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-sm bg-burgundy text-ink tracking-normal normal-case font-extrabold">
                  X
                </span>
              </>
            ) : (
              storeName
            )}
          </p>
          <div className="hero-accent-line mb-4" />
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-tight mb-4">
            {banner.title}
          </h2>
          {banner.subtitle && (
            <p className="text-charcoal/80 text-base sm:text-lg mb-8">{banner.subtitle}</p>
          )}
          <div className="flex flex-wrap gap-3">
            {banner.link && isSafeInternalHref(banner.link) && (
              <Link
                href={banner.link}
                className="inline-block bg-burgundy text-ink px-8 py-4 text-sm font-bold tracking-wider uppercase hover:bg-burgundy-dark transition-all btn-press"
              >
                Shop Now
              </Link>
            )}
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 border-2 border-burgundy text-burgundy px-8 py-4 text-sm font-bold tracking-wider uppercase hover:bg-burgundy hover:text-ink transition-all btn-press"
            >
              Browse All
            </Link>
          </div>
          <p className="text-charcoal/50 text-sm mt-6 hidden sm:block">{tagline}</p>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2.5 rounded-full transition-all ${
              i === current ? "bg-burgundy w-8" : "bg-charcoal/40 hover:bg-charcoal/60 w-2.5"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <button
        onClick={() => setCurrent((prev) => (prev - 1 + banners.length) % banners.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-ink/60 hover:bg-burgundy hover:text-ink text-charcoal rounded-full backdrop-blur-sm transition-colors hidden sm:block"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % banners.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-ink/60 hover:bg-burgundy hover:text-ink text-charcoal rounded-full backdrop-blur-sm transition-colors hidden sm:block"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>
    </section>
  );
}
