"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useCatalogStore } from "@/store/catalog-store";
import { cn } from "@/lib/utils";

interface ShopCategorySidebarProps {
  activeCategory?: string | null;
  activeFilter?: string | null;
}

export function ShopCategorySidebar({
  activeCategory,
  activeFilter,
}: ShopCategorySidebarProps) {
  const categories = useCatalogStore((s) => s.categories);
  const parents = useMemo(
    () => categories.filter((c) => !c.parentSlug).sort((a, b) => a.sortOrder - b.sortOrder),
    [categories]
  );

  const activeParentSlug = useMemo(() => {
    if (!activeCategory) return null;
    const match = categories.find((c) => c.slug === activeCategory);
    if (!match) return null;
    return match.parentSlug ?? match.slug;
  }, [activeCategory, categories]);

  const [expanded, setExpanded] = useState<string | null>(activeParentSlug);

  return (
    <aside className="lg:w-64 flex-shrink-0">
      <h3 className="font-semibold text-charcoal mb-4 text-sm tracking-wider uppercase">
        Categories
      </h3>
      <ul className="space-y-1">
        <li>
          <Link
            href="/shop"
            className={cn(
              "text-sm hover:text-burgundy transition-colors block py-1.5",
              !activeCategory && !activeFilter
                ? "text-burgundy font-medium"
                : "text-charcoal/70"
            )}
          >
            All Products
          </Link>
        </li>
        {parents.map((parent) => {
          const children = categories
            .filter((c) => c.parentSlug === parent.slug)
            .sort((a, b) => a.sortOrder - b.sortOrder);
          const isOpen = expanded === parent.slug;
          const parentActive =
            activeCategory === parent.slug || activeParentSlug === parent.slug;

          return (
            <li key={parent.id} className="border-b border-cream-dark/40 pb-1">
              <div className="flex items-center gap-1">
                <Link
                  href={`/shop?category=${parent.slug}`}
                  className={cn(
                    "flex-1 text-sm py-2 hover:text-burgundy transition-colors",
                    parentActive ? "text-burgundy font-semibold" : "text-charcoal/80"
                  )}
                >
                  {parent.name}
                </Link>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : parent.slug)}
                  className="p-1.5 text-charcoal/50 hover:text-burgundy"
                  aria-label={`Toggle ${parent.name}`}
                >
                  <ChevronDown
                    size={16}
                    className={cn("transition-transform", isOpen && "rotate-180")}
                  />
                </button>
              </div>
              {isOpen && (
                <ul className="pl-3 pb-2 space-y-1 animate-fade-in">
                  {children.map((child) => (
                    <li key={child.id}>
                      <Link
                        href={`/shop?category=${child.slug}`}
                        className={cn(
                          "text-sm py-1 block hover:text-burgundy transition-colors",
                          activeCategory === child.slug
                            ? "text-burgundy font-medium"
                            : "text-charcoal/60"
                        )}
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      <h3 className="font-semibold text-charcoal mb-4 mt-8 text-sm tracking-wider uppercase">
        Filters
      </h3>
      <ul className="space-y-2">
        <li>
          <Link
            href="/shop?filter=new"
            className={cn(
              "text-sm hover:text-burgundy transition-colors",
              activeFilter === "new" ? "text-burgundy font-medium" : "text-charcoal/70"
            )}
          >
            New Arrivals
          </Link>
        </li>
        <li>
          <Link
            href="/shop?filter=offers"
            className={cn(
              "text-sm hover:text-burgundy transition-colors",
              activeFilter === "offers" ? "text-burgundy font-medium" : "text-charcoal/70"
            )}
          >
            On Sale
          </Link>
        </li>
        <li>
          <Link
            href="/shop?filter=bestsellers"
            className={cn(
              "text-sm hover:text-burgundy transition-colors",
              activeFilter === "bestsellers" ? "text-burgundy font-medium" : "text-charcoal/70"
            )}
          >
            Best Sellers
          </Link>
        </li>
      </ul>
    </aside>
  );
}
