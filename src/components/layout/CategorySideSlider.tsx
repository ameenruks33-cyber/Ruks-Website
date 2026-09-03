"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Grid3X3, X } from "lucide-react";
import { useCatalogStore } from "@/store/catalog-store";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategorySideSliderProps {
  open: boolean;
  onClose: () => void;
}

export function CategorySideSlider({ open, onClose }: CategorySideSliderProps) {
  const categories = useCatalogStore((s) => s.categories);
  const parents = useMemo(
    () => categories.filter((c) => !c.parentSlug).sort((a, b) => a.sortOrder - b.sortOrder),
    [categories]
  );

  const [activeParent, setActiveParent] = useState<Category | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const children = useMemo(() => {
    if (!activeParent) return [];
    return categories
      .filter((c) => c.parentSlug === activeParent.slug)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [activeParent, categories]);

  useEffect(() => {
    if (open && parents.length && !activeParent) {
      setActiveParent(parents[0]);
    }
  }, [open, parents, activeParent]);

  useEffect(() => {
    setSlideIndex(0);
  }, [activeParent?.slug]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(children.length / pageSize));
  const visibleChildren = children.slice(slideIndex * pageSize, slideIndex * pageSize + pageSize);

  const goPrev = () => setSlideIndex((i) => (i - 1 + totalPages) % totalPages);
  const goNext = () => setSlideIndex((i) => (i + 1) % totalPages);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex" role="dialog" aria-modal="true" aria-label="Shop categories">
      <button
        type="button"
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm animate-fade-in"
        aria-label="Close categories"
        onClick={onClose}
      />

      <aside className="relative z-10 flex h-full w-full max-w-3xl bg-cream border-r border-burgundy/25 shadow-2xl animate-slide-in-left">
        {/* Parent list */}
        <div className="w-[42%] sm:w-56 lg:w-64 flex-shrink-0 bg-ink border-r border-burgundy/20 overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-2 px-4 py-4 bg-ink border-b border-burgundy/20">
            <div className="flex items-center gap-2 text-burgundy">
              <Grid3X3 size={18} />
              <h2 className="font-display text-sm sm:text-base font-bold tracking-wide uppercase">
                Categories
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-charcoal/70 hover:text-burgundy transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <ul className="py-2">
            {parents.map((parent) => {
              const active = activeParent?.slug === parent.slug;
              return (
                <li key={parent.id}>
                  <button
                    type="button"
                    onClick={() => setActiveParent(parent)}
                    className={cn(
                      "w-full text-left px-4 py-3 text-sm transition-all border-l-4",
                      active
                        ? "bg-burgundy text-ink font-semibold border-burgundy"
                        : "text-charcoal/75 hover:text-burgundy hover:bg-cream-dark border-transparent"
                    )}
                  >
                    {parent.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Subcategory slider panel */}
        <div className="flex-1 flex flex-col min-w-0 bg-cream">
          {activeParent && (
            <>
              <div className="px-4 sm:px-6 py-4 border-b border-cream-dark">
                <p className="text-xs uppercase tracking-[0.2em] text-burgundy mb-1">Shop</p>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-charcoal">
                  {activeParent.name}
                </h3>
                {activeParent.description && (
                  <p className="text-sm text-charcoal/55 mt-1 line-clamp-2">
                    {activeParent.description}
                  </p>
                )}
                <Link
                  href={`/shop?category=${activeParent.slug}`}
                  onClick={onClose}
                  className="inline-block mt-3 text-sm font-semibold text-burgundy hover:underline"
                >
                  View all in {activeParent.name} →
                </Link>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="relative">
                  <div
                    key={`${activeParent.slug}-${slideIndex}`}
                    className="grid grid-cols-2 gap-3 sm:gap-4 animate-rise-in"
                  >
                    {visibleChildren.map((child) => (
                      <Link
                        key={child.id}
                        href={`/shop?category=${child.slug}`}
                        onClick={onClose}
                        className="group relative aspect-[4/5] overflow-hidden rounded-sm border border-cream-dark bg-surface hover:border-burgundy transition-colors"
                      >
                        {child.image && (
                          <Image
                            src={child.image}
                            alt={child.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 40vw, 220px"
                            unoptimized
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="font-semibold text-sm text-charcoal group-hover:text-burgundy transition-colors">
                            {child.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-5">
                      <button
                        type="button"
                        onClick={goPrev}
                        className="inline-flex items-center gap-1 px-3 py-2 text-sm border border-burgundy text-burgundy hover:bg-burgundy hover:text-ink transition-colors btn-press"
                      >
                        <ChevronLeft size={16} />
                        Prev
                      </button>
                      <div className="flex gap-1.5">
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSlideIndex(i)}
                            className={cn(
                              "h-2 rounded-full transition-all",
                              i === slideIndex ? "w-6 bg-burgundy" : "w-2 bg-charcoal/30"
                            )}
                            aria-label={`Slide ${i + 1}`}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={goNext}
                        className="inline-flex items-center gap-1 px-3 py-2 text-sm border border-burgundy text-burgundy hover:bg-burgundy hover:text-ink transition-colors btn-press"
                      >
                        Next
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Horizontal chip slider for quick pick */}
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-wider text-charcoal/45 mb-3">
                    Quick pick
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory">
                    {children.map((child) => (
                      <Link
                        key={`chip-${child.id}`}
                        href={`/shop?category=${child.slug}`}
                        onClick={onClose}
                        className="snap-start flex-shrink-0 px-4 py-2 rounded-sm border border-cream-dark bg-surface text-sm text-charcoal hover:border-burgundy hover:text-burgundy whitespace-nowrap transition-colors"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
