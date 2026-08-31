"use client";

import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductGrid } from "@/components/shop/ProductCard";
import { DealsBar } from "@/components/home/DealsBar";
import { TrustBadges } from "@/components/home/TrustBadges";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { Reviews } from "@/components/home/Reviews";
import { InstagramSection } from "@/components/home/InstagramSection";
import { useCatalogStore } from "@/store/catalog-store";
import { reviews } from "@/data/store";

export function HomePageClient() {
  const banners = useCatalogStore((s) => s.banners);
  const categories = useCatalogStore((s) => s.categories);
  const getFeaturedProducts = useCatalogStore((s) => s.getFeaturedProducts);
  const getNewArrivals = useCatalogStore((s) => s.getNewArrivals);
  const getOnSaleProducts = useCatalogStore((s) => s.getOnSaleProducts);

  const featured = getFeaturedProducts();
  const newArrivals = getNewArrivals();
  const onSale = getOnSaleProducts();

  return (
    <>
      <DealsBar />
      <HeroBanner banners={banners} />
      <TrustBadges />
      <CategoryGrid categories={categories} />
      <ProductGrid
        products={featured}
        title="Trending Now"
        subtitle="Our most loved pieces this season"
        viewAllHref="/shop?filter=bestsellers"
      />

      <section className="bg-burgundy py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3 font-medium">
            Limited Time
          </p>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-cream mb-4">
            Summer Sale — Up to 40% Off
          </h2>
          <p className="text-cream/70 mb-8 max-w-lg mx-auto">
            Refresh your wardrobe with our exclusive summer collection. Use code SUMMER25 at checkout.
          </p>
          <a
            href="/shop?filter=offers"
            className="inline-block bg-gold text-charcoal px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-gold-light transition-colors"
          >
            Shop Offers
          </a>
        </div>
      </section>

      <ProductGrid
        products={newArrivals}
        title="New Arrivals"
        subtitle="Fresh styles just dropped"
        viewAllHref="/shop?filter=new"
      />
      <ProductGrid
        products={onSale}
        title="Special Offers"
        subtitle="Great deals on premium fashion"
        viewAllHref="/shop?filter=offers"
      />
      <Reviews reviews={reviews} />
      <NewsletterSignup />
      <InstagramSection />
    </>
  );
}
