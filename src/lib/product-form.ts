import type { Product } from "@/types";
import { slugify } from "@/lib/utils";

export interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  salePrice: string | number;
  sku: string;
  categorySlug: string;
  brandName: string;
  images: string[];
  stock: number;
  warranty: string;
  tags: string;
  features: string;
  isFeatured: boolean;
  isNew: boolean;
  isActive: boolean;
}

export const EMPTY_PRODUCT_FORM: ProductFormValues = {
  name: "",
  description: "",
  price: 0,
  salePrice: "",
  sku: "",
  categorySlug: "women-ethnic-wear",
  brandName: "NexCart X",
  images: [""],
  stock: 10,
  warranty: "",
  tags: "",
  features: "",
  isFeatured: false,
  isNew: true,
  isActive: true,
};

export function productToForm(product: Product): ProductFormValues {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    salePrice: product.salePrice ?? "",
    sku: product.sku,
    categorySlug: product.categorySlug,
    brandName: product.brandName ?? "",
    images: product.images.length ? product.images : [""],
    stock: product.variants[0]?.stock ?? 0,
    warranty: product.warranty ?? "",
    tags: product.tags.join(", "),
    features: product.features?.join("\n") ?? "",
    isFeatured: product.isFeatured,
    isNew: product.isNew,
    isActive: product.isActive,
  };
}

export function formToProductPayload(
  form: ProductFormValues,
  categories: { id: string; name: string; slug: string }[],
  existing?: Product
): Omit<Product, "id"> & { id?: string } {
  const cat = categories.find((c) => c.slug === form.categorySlug);
  const images = form.images.map((u) => u.trim()).filter(Boolean);
  const tags = form.tags
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  const features = form.features
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);
  const slug = existing?.name === form.name ? existing.slug : slugify(form.name || "product");
  const variantId = existing?.variants[0]?.id ?? `v-${Date.now()}`;

  return {
    id: existing?.id,
    name: form.name.trim(),
    slug,
    description: form.description.trim(),
    price: Number(form.price) || 0,
    salePrice: form.salePrice ? Number(form.salePrice) : undefined,
    sku: form.sku.trim() || `SKU-${Date.now()}`,
    categoryId: cat?.id ?? existing?.categoryId ?? "cat-single",
    categorySlug: form.categorySlug,
    categoryName: cat?.name ?? existing?.categoryName ?? "Products",
    brandName: form.brandName.trim() || undefined,
    images: images.length ? images : ["/uploads/placeholder-needed.jpg"],
    isFeatured: form.isFeatured,
    isNew: form.isNew,
    isActive: form.isActive,
    tags,
    features: features.length ? features : undefined,
    warranty: form.warranty.trim() || undefined,
    rating: existing?.rating ?? 0,
    reviewCount: existing?.reviewCount ?? 0,
    variants: [
      {
        id: variantId,
        stock: Math.max(0, Number(form.stock) || 0),
        sku: form.sku.trim() || `SKU-${Date.now()}`,
      },
    ],
  };
}

export function createProductFromForm(
  form: ProductFormValues,
  categories: { id: string; name: string; slug: string }[]
): Product {
  const payload = formToProductPayload(form, categories);
  return {
    ...payload,
    id: `prod-${Date.now()}`,
  } as Product;
}
