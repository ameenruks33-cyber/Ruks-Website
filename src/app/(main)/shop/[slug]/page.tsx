"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCatalogStore } from "@/store/catalog-store";
import { ProductDetail } from "@/components/shop/ProductDetail";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const [slug, setSlug] = useState<string | null>(null);
  const getProductBySlug = useCatalogStore((s) => s.getProductBySlug);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  if (!slug) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Loading...</div>;
  }

  const product = getProductBySlug(slug);
  if (!product) notFound();

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
