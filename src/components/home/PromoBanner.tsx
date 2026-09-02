"use client";

import Link from "next/link";
import { useHomePanelsStore } from "@/store/home-panels-store";

export function PromoBanner() {
  const promoBanner = useHomePanelsStore((s) => s.promoBanner);

  if (!promoBanner.enabled) return null;

  return (
    <section className="bg-burgundy py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3 font-medium">
          {promoBanner.label}
        </p>
        <h2 className="font-display text-3xl lg:text-5xl font-bold text-cream mb-4">
          {promoBanner.title}
        </h2>
        <p className="text-cream/70 mb-8 max-w-lg mx-auto">{promoBanner.description}</p>
        <Link
          href={promoBanner.buttonLink}
          className="inline-block bg-gold text-charcoal px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-gold-light transition-colors"
        >
          {promoBanner.buttonText}
        </Link>
      </div>
    </section>
  );
}
