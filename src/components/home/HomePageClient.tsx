"use client";

import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductGrid } from "@/components/shop/ProductCard";
import { DealsBar } from "@/components/home/DealsBar";
import { TrustBadges } from "@/components/home/TrustBadges";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { PromoBanner } from "@/components/home/PromoBanner";
import { FeaturedCategorySection } from "@/components/home/FeaturedCategorySection";
import { CustomerReviewsSection } from "@/components/home/CustomerReviewsSection";
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
  const topCategories = categories.filter((c) => !c.parentSlug).slice(0, 4);

  return (
    <>
      <DealsBar />
      <HeroBanner banners={banners} />
      <TrustBadges />
      <CategoryGrid categories={topCategories.length ? topCategories : categories} />
      <FeaturedCategorySection />
      <ProductGrid
        products={featured}
        title="NL-GAS Bestsellers"
        subtitle="Most popular gas stoves in Kerala"
        viewAllHref="/shop?filter=bestsellers"
      />

      <PromoBanner />

      <ProductGrid
        products={newArrivals}
        title="New Arrivals"
        subtitle="Latest models just in stock"
        viewAllHref="/shop?filter=new"
      />
      <ProductGrid
        products={onSale}
        title="Today's Deals"
        subtitle="Special prices on NL-GAS stoves"
        viewAllHref="/shop?filter=offers"
      />
      <CustomerReviewsSection />
      <NewsletterSignup />
    </>
  );
}
