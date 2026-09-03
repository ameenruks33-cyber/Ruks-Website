"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShopCategorySidebar } from "@/components/shop/ShopCategorySidebar";
import { useCatalogStore } from "@/store/catalog-store";

function ShopContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const filter = searchParams.get("filter");
  const query = searchParams.get("q");

  const products = useCatalogStore((s) => s.products);
  const categories = useCatalogStore((s) => s.categories);
  const getProductsByCategory = useCatalogStore((s) => s.getProductsByCategory);
  const searchProducts = useCatalogStore((s) => s.searchProducts);
  const getNewArrivals = useCatalogStore((s) => s.getNewArrivals);
  const getOnSaleProducts = useCatalogStore((s) => s.getOnSaleProducts);

  const filteredProducts = useMemo(() => {
    if (query) return searchProducts(query);
    if (category) return getProductsByCategory(category);
    if (filter === "new") return getNewArrivals();
    if (filter === "offers") return getOnSaleProducts();
    if (filter === "bestsellers") return products.filter((p) => p.isFeatured);
    return products.filter((p) => p.isActive);
  }, [
    category,
    filter,
    query,
    products,
    getProductsByCategory,
    searchProducts,
    getNewArrivals,
    getOnSaleProducts,
  ]);

  const pageTitle = query
    ? `Search: "${query}"`
    : category
      ? categories.find((c) => c.slug === category)?.name || "Shop"
      : filter === "new"
        ? "New Arrivals"
        : filter === "offers"
          ? "Special Offers"
          : filter === "bestsellers"
            ? "Best Sellers"
            : "All Products";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-charcoal mb-2">
          {pageTitle}
        </h1>
        <p className="text-charcoal/60">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <ShopCategorySidebar activeCategory={category} activeFilter={filter} />

        {filteredProducts.length > 0 ? (
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex-1 text-center py-20">
            <p className="text-charcoal/60 text-lg">No products found.</p>
            <a href="/shop" className="text-burgundy hover:underline mt-2 inline-block">
              Browse all products
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">Loading...</div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
