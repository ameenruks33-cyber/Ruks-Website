import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const topCategories = categories.filter((c) => !c.parentSlug).slice(0, 3);

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-charcoal mb-3">
            Shop by Category
          </h2>
          <p className="text-charcoal/60 max-w-md mx-auto">
            Explore our curated collections for ladies, gents, and children
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          {topCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-sm"
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-cream mb-1">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-cream/70 text-sm">{cat.description}</p>
                )}
                <span className="inline-block mt-4 text-gold text-sm font-semibold tracking-wider uppercase group-hover:underline">
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
