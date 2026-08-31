import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import type { Product } from "@/types";
import { Price } from "@/components/ui/Price";
import { Badge } from "@/components/ui/Badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const price = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-cream-dark mb-4">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 25vw"
          unoptimized
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && <Badge variant="sale">Sale</Badge>}
          {product.isNew && <Badge variant="new">New</Badge>}
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-charcoal/50 uppercase tracking-wider">
          {product.categoryName}
        </p>
        <h3 className="font-medium text-charcoal group-hover:text-burgundy transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-1">
          <Star size={12} className="fill-gold text-gold" />
          <span className="text-xs text-charcoal/60">
            {product.rating} ({product.reviewCount})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Price amount={price} className="font-semibold text-charcoal" />
          {hasDiscount && (
            <Price amount={product.price} className="text-sm text-charcoal/40 line-through" />
          )}
        </div>
      </div>
    </Link>
  );
}

interface ProductGridProps {
  products: Product[];
  title: string;
  subtitle?: string;
  viewAllHref?: string;
}

export function ProductGrid({ products, title, subtitle, viewAllHref }: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-charcoal mb-2">
              {title}
            </h2>
            {subtitle && <p className="text-charcoal/60">{subtitle}</p>}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="hidden sm:inline-block text-burgundy font-medium hover:underline text-sm tracking-wide"
            >
              View All →
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {viewAllHref && (
          <div className="text-center mt-8 sm:hidden">
            <Link
              href={viewAllHref}
              className="text-burgundy font-medium hover:underline text-sm tracking-wide"
            >
              View All →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
