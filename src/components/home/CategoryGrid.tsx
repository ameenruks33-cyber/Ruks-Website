"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Category } from "@/types";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const topCategories = useMemo(
    () => categories.filter((c) => !c.parentSlug).sort((a, b) => a.sortOrder - b.sortOrder),
    [categories]
  );
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollBy({ left: dir * Math.min(360, node.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-charcoal mb-3">
              Shop by Category
            </h2>
            <p className="text-charcoal/60 max-w-md">
              Ethnic, western, kids, jewellery, beauty, footwear and more
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              className="p-2 border border-burgundy text-burgundy hover:bg-burgundy hover:text-ink transition-colors"
              aria-label="Previous categories"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              className="p-2 border border-burgundy text-burgundy hover:bg-burgundy hover:text-ink transition-colors"
              aria-label="Next categories"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin"
        >
          {topCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative flex-shrink-0 w-[70%] sm:w-[42%] lg:w-[28%] aspect-[3/4] overflow-hidden rounded-sm snap-start border border-cream-dark hover:border-burgundy transition-colors"
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 70vw, 28vw"
                  unoptimized
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                <h3 className="font-display text-xl lg:text-2xl font-bold text-charcoal mb-1 group-hover:text-burgundy transition-colors">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-charcoal/65 text-sm line-clamp-2">{cat.description}</p>
                )}
                <span className="inline-block mt-3 text-burgundy text-sm font-semibold tracking-wider uppercase">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
