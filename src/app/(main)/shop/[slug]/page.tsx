"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCatalogStore } from "@/store/catalog-store";
import { ProductDetail } from "@/components/shop/ProductDetail";

interface ProductPageProps {
  params?: Promise<{ slug: string }>;
}

export default function ProductPage(_props: ProductPageProps) {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";  const hydrated = useCatalogStore((s) => s.hydrated);
  const getProductBySlug = useCatalogStore((s) => s.getProductBySlug);

  const product = getProductBySlug(slug);

  if (!product && hydrated) notFound();

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Loading product...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-burgundy mb-8 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Shop
      </Link>
      <ProductDetail product={product} />
    </div>
  );
}
