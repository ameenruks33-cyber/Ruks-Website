"use client";

import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductGrid } from "@/components/shop/ProductCard";
import { DealsBar } from "@/components/home/DealsBar";
import { TrustBadges } from "@/components/home/TrustBadges";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { PromoBanner } from "@/components/home/PromoBanner";
import { AbayaSection } from "@/components/home/AbayaSection";
import { CustomerReviewsSection } from "@/components/home/CustomerReviewsSection";
import { InstagramSection } from "@/components/home/InstagramSection";
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
      <TrustBadges />
      <CategoryGrid categories={categories} />
      <AbayaSection />
      <ProductGrid
        products={featured}
        title="Trending Now"
        subtitle="Our most loved pieces this season"
        viewAllHref="/shop?filter=bestsellers"
      />

      <PromoBanner />

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
      <CustomerReviewsSection />
      <NewsletterSignup />
      <InstagramSection />
    </>
  );
}
