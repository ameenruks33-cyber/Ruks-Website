"use client";

import { create } from "zustand";
import type { Banner, Category, Coupon, Product } from "@/types";
import {
  products as seedProducts,
  categories as seedCategories,
  banners as seedBanners,
  coupons as seedCoupons,
} from "@/data/store";
import { slugify } from "@/lib/utils";
import { scheduleCatalogSync } from "@/lib/catalog-sync";

interface CatalogState {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  coupons: Coupon[];
  hydrated: boolean;

  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (categorySlug: string) => Product[];
  getFeaturedProducts: () => Product[];
  getNewArrivals: () => Product[];
  getOnSaleProducts: () => Product[];
  searchProducts: (query: string) => Product[];

  updateProduct: (id: string, data: Partial<Product>) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  updateCategory: (id: string, data: Partial<Category>) => void;
  addCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;

  updateBanner: (id: string, data: Partial<Banner>) => void;
  addBanner: (banner: Banner) => void;
  deleteBanner: (id: string) => void;

  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (code: string, data: Partial<Coupon>) => void;
  deleteCoupon: (code: string) => void;

  resetCatalog: () => void;
}

function filterByCategory(products: Product[], categories: Category[], categorySlug: string) {
  const childSlugs = categories
    .filter((c) => c.parentSlug === categorySlug)
    .map((c) => c.slug);
  const allSlugs = [categorySlug, ...childSlugs];
  return products.filter((p) => allSlugs.includes(p.categorySlug) && p.isActive);
}

export const useCatalogStore = create<CatalogState>()((set, get) => ({
  products: seedProducts,
  categories: seedCategories,
  banners: seedBanners,
  coupons: seedCoupons,
  hydrated: false,

  getProductBySlug: (slug) => get().products.find((p) => p.slug === slug),
  getProductById: (id) => get().products.find((p) => p.id === id),

  getProductsByCategory: (categorySlug) =>
    filterByCategory(get().products, get().categories, categorySlug),

  getFeaturedProducts: () =>
    get().products.filter((p) => p.isFeatured && p.isActive),

  getNewArrivals: () => get().products.filter((p) => p.isNew && p.isActive),

  getOnSaleProducts: () =>
    get().products.filter((p) => p.salePrice && p.isActive),

  searchProducts: (query) => {
    const q = query.toLowerCase();
    return get().products.filter(
      (p) =>
        p.isActive &&
        (p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q)) ||
          p.categoryName.toLowerCase().includes(q))
    );
  },

  updateProduct: (id, data) => {
    set((state) => ({
      products: state.products.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, ...data };
        if (data.name && data.name !== p.name) {
          updated.slug = slugify(data.name);
        }
        if (data.categorySlug) {
          const cat = state.categories.find((c) => c.slug === data.categorySlug);
          if (cat) {
            updated.categoryId = cat.id;
            updated.categoryName = cat.name;
          }
        }
        return updated;
      }),
    }));
    scheduleCatalogSync();
  },

  addProduct: (product) => {
    set((state) => ({ products: [...state.products, product] }));
    scheduleCatalogSync();
  },

  deleteProduct: (id) => {
    set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
    scheduleCatalogSync();
  },

  updateCategory: (id, data) => {
    set((state) => ({
      categories: state.categories.map((c) => {
        if (c.id !== id) return c;
        const updated = { ...c, ...data };
        if (data.name && data.name !== c.name && !data.slug) {
          updated.slug = slugify(data.name);
        }
        return updated;
      }),
    }));
    scheduleCatalogSync();
  },

  addCategory: (category) => {
    set((state) => ({ categories: [...state.categories, category] }));
    scheduleCatalogSync();
  },

  deleteCategory: (id) => {
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    }));
    scheduleCatalogSync();
  },

  updateBanner: (id, data) => {
    set((state) => ({
      banners: state.banners.map((b) => (b.id === id ? { ...b, ...data } : b)),
    }));
    scheduleCatalogSync();
  },

  addBanner: (banner) => {
    set((state) => ({ banners: [...state.banners, banner] }));
    scheduleCatalogSync();
  },

  deleteBanner: (id) => {
    set((state) => ({
      banners: state.banners.filter((b) => b.id !== id),
    }));
    scheduleCatalogSync();
  },

  addCoupon: (coupon) => {
    set((state) => ({
      coupons: [...state.coupons, { ...coupon, isActive: coupon.isActive ?? true }],
    }));
    scheduleCatalogSync();
  },

  updateCoupon: (code, data) => {
    set((state) => ({
      coupons: state.coupons.map((c) =>
        c.code.toUpperCase() === code.toUpperCase() ? { ...c, ...data } : c
      ),
    }));
    scheduleCatalogSync();
  },

  deleteCoupon: (code) => {
    set((state) => ({
      coupons: state.coupons.filter(
        (c) => c.code.toUpperCase() !== code.toUpperCase()
      ),
    }));
    scheduleCatalogSync();
  },

  resetCatalog: () => {
    set({
      products: seedProducts,
      categories: seedCategories,
      banners: seedBanners,
      coupons: seedCoupons,
    });
    scheduleCatalogSync();
  },
}));

export function validateCoupon(
  code: string,
  subtotal: number,
  coupons: Coupon[],
  currency: string
): { valid: boolean; discount: number; message?: string } {
  const coupon = coupons.find(
    (c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive !== false
  );
  if (!coupon) return { valid: false, discount: 0, message: "Invalid coupon code" };
  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order of ${currency} ${coupon.minOrder} required`,
    };
  }
  const discount =
    coupon.discountType === "percentage"
      ? (subtotal * coupon.discountValue) / 100
      : coupon.discountValue;
  return { valid: true, discount: Math.min(discount, subtotal) };
}
