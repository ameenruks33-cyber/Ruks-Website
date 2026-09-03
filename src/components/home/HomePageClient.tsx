"use client";

import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductGrid } from "@/components/shop/ProductCard";
import { DealsBar } from "@/components/home/DealsBar";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { PromoBanner } from "@/components/home/PromoBanner";
import { CustomerReviewsSection } from "@/components/home/CustomerReviewsSection";
import { Reveal } from "@/components/ui/Reveal";
import { useCatalogStore } from "@/store/catalog-store";

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
      <Reveal delay={1}>
        <CategoryGrid categories={categories} />
      </Reveal>
      <Reveal delay={1}>
        <ProductGrid
          products={featured}
          title="Bestsellers"
          subtitle="Most loved styles right now"
          viewAllHref="/shop?filter=bestsellers"
        />
      </Reveal>

      <Reveal>
        <PromoBanner />
      </Reveal>

      <Reveal delay={1}>
        <ProductGrid
          products={newArrivals}
          title="New Arrivals"
          subtitle="Fresh drops just in stock"
          viewAllHref="/shop?filter=new"
        />
      </Reveal>
      <Reveal delay={2}>
        <ProductGrid
          products={onSale}
          title="Today's Deals"
          subtitle="Limited-time offers across fashion & more"
          viewAllHref="/shop?filter=offers"
        />
      </Reveal>
      <Reveal>
        <CustomerReviewsSection />
      </Reveal>
      <Reveal delay={1}>
        <NewsletterSignup />
      </Reveal>
    </>
  );
}
