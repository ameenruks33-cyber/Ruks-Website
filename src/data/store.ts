import type { Banner, Coupon, Product, Review } from "@/types";
import { categories } from "@/data/category-tree";

export { categories };

const IMG = {
  ethnic: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1000&fit=crop",
  western: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop",
  men: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&h=1000&fit=crop",
  kids: "https://images.unsplash.com/photo-1503919545889-aef636e10ad1?w=800&h=1000&fit=crop",
  jewellery: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=1000&fit=crop",
  footwear: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop",
  bags: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop",
  beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=1000&fit=crop",
};

export const banners: Banner[] = [
  {
    id: "banner-1",
    title: "New Season Drop — Fresh Styles",
    subtitle: "Women ethnic, western wear, menswear, kids & more",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=700&fit=crop",
    link: "/shop?category=women-western-wear",
  },
  {
    id: "banner-2",
    title: "Jewellery & Accessories",
    subtitle: "Earrings, handbags, watches — finish every look",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&h=700&fit=crop",
    link: "/shop?category=jewellery-and-accessories",
  },
  {
    id: "banner-3",
    title: "Footwear & Bags",
    subtitle: "Shoes, sandals, backpacks and travel essentials",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1600&h=700&fit=crop",
    link: "/shop?category=footwear",
  },
];

export const products: Product[] = [
  {
    id: "prod-1",
    name: "Floral Print Kurti",
    slug: "floral-print-kurti",
    description: "Soft cotton kurti with floral print. Comfortable everyday ethnic wear.",
    price: 1299,
    salePrice: 999,
    sku: "NCX-KUR-001",
    categoryId: "cat-women-ethnic-wear-kurtis",
    categorySlug: "kurtis",
    categoryName: "Kurtis",
    brandName: "NexCart X",
    images: [IMG.ethnic],
    isFeatured: true,
    isNew: true,
    isBestSeller: true,
    isActive: true,
    tags: ["kurti", "ethnic", "women"],
    rating: 4.6,
    reviewCount: 42,
    features: ["Cotton blend", "Machine wash", "Regular fit"],
    variants: [
      { id: "v-1", size: "M", color: "Pink", stock: 12, sku: "NCX-KUR-001-M" },
      { id: "v-1b", size: "L", color: "Pink", stock: 8, sku: "NCX-KUR-001-L" },
    ],
  },
  {
    id: "prod-2",
    name: "Silk Finish Saree",
    slug: "silk-finish-saree",
    description: "Elegant saree with rich drape — perfect for festive occasions.",
    price: 3499,
    salePrice: 2799,
    sku: "NCX-SAR-002",
    categoryId: "cat-women-ethnic-wear-sarees",
    categorySlug: "sarees",
    categoryName: "Sarees",
    brandName: "NexCart X",
    images: [IMG.ethnic],
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    isActive: true,
    tags: ["saree", "ethnic", "festive"],
    rating: 4.8,
    reviewCount: 67,
    features: ["Rich finish", "Includes blouse piece"],
    variants: [{ id: "v-2", stock: 10, sku: "NCX-SAR-002" }],
  },
  {
    id: "prod-3",
    name: "Casual Women Top",
    slug: "casual-women-top",
    description: "Lightweight top for everyday western wear looks.",
    price: 899,
    salePrice: 699,
    sku: "NCX-TOP-003",
    categoryId: "cat-women-western-wear-tops",
    categorySlug: "tops",
    categoryName: "Tops",
    brandName: "NexCart X",
    images: [IMG.western],
    isFeatured: true,
    isNew: true,
    isActive: true,
    tags: ["top", "western", "casual"],
    rating: 4.4,
    reviewCount: 28,
    variants: [
      { id: "v-3", size: "S", stock: 9, sku: "NCX-TOP-003-S" },
      { id: "v-3b", size: "M", stock: 14, sku: "NCX-TOP-003-M" },
    ],
  },
  {
    id: "prod-4",
    name: "Slim Fit Mens Shirt",
    slug: "slim-fit-mens-shirt",
    description: "Smart casual shirt for office and weekend wear.",
    price: 1499,
    salePrice: 1199,
    sku: "NCX-SHT-004",
    categoryId: "cat-mens-clothing-shirts",
    categorySlug: "shirts",
    categoryName: "Shirts",
    brandName: "NexCart X",
    images: [IMG.men],
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    isActive: true,
    tags: ["shirt", "men", "formal"],
    rating: 4.5,
    reviewCount: 51,
    variants: [
      { id: "v-4", size: "40", stock: 11, sku: "NCX-SHT-004-40" },
      { id: "v-4b", size: "42", stock: 7, sku: "NCX-SHT-004-42" },
    ],
  },
  {
    id: "prod-5",
    name: "Mens Cotton T-Shirt",
    slug: "mens-cotton-t-shirt",
    description: "Soft cotton tee with everyday comfort.",
    price: 699,
    sku: "NCX-TSH-005",
    categoryId: "cat-mens-clothing-t-shirts",
    categorySlug: "mens-clothing-t-shirts",
    categoryName: "T-Shirts",
    brandName: "NexCart X",
    images: [IMG.men],
    isFeatured: false,
    isNew: true,
    isActive: true,
    tags: ["tshirt", "men", "casual"],
    rating: 4.3,
    reviewCount: 19,
    variants: [{ id: "v-5", size: "L", stock: 20, sku: "NCX-TSH-005-L" }],
  },
  {
    id: "prod-6",
    name: "Kids Party Dress",
    slug: "kids-party-dress",
    description: "Cute party dress for girls — soft fabric and easy wear.",
    price: 1199,
    salePrice: 949,
    sku: "NCX-KID-006",
    categoryId: "cat-kids-girls-clothing",
    categorySlug: "girls-clothing",
    categoryName: "Girls Clothing",
    brandName: "NexCart X",
    images: [IMG.kids],
    isFeatured: true,
    isNew: true,
    isActive: true,
    tags: ["kids", "dress", "girls"],
    rating: 4.7,
    reviewCount: 33,
    variants: [{ id: "v-6", size: "5-6Y", stock: 8, sku: "NCX-KID-006-56" }],
  },
  {
    id: "prod-7",
    name: "Statement Earrings Set",
    slug: "statement-earrings-set",
    description: "Artificial jewellery earrings to elevate ethnic and party looks.",
    price: 499,
    salePrice: 349,
    sku: "NCX-JWL-007",
    categoryId: "cat-jewellery-and-accessories-earrings",
    categorySlug: "earrings",
    categoryName: "Earrings",
    brandName: "NexCart X",
    images: [IMG.jewellery],
    isFeatured: true,
    isNew: false,
    isActive: true,
    tags: ["earrings", "jewellery", "accessories"],
    rating: 4.6,
    reviewCount: 88,
    variants: [{ id: "v-7", stock: 25, sku: "NCX-JWL-007" }],
  },
  {
    id: "prod-8",
    name: "Everyday Handbag",
    slug: "everyday-handbag",
    description: "Spacious handbag for daily use with secure zip closure.",
    price: 1599,
    salePrice: 1299,
    sku: "NCX-BAG-008",
    categoryId: "cat-jewellery-and-accessories-handbags",
    categorySlug: "jewellery-and-accessories-handbags",
    categoryName: "Handbags",
    brandName: "NexCart X",
    images: [IMG.bags],
    isFeatured: false,
    isNew: true,
    isActive: true,
    tags: ["handbag", "bags", "accessories"],
    rating: 4.4,
    reviewCount: 22,
    variants: [{ id: "v-8", color: "Black", stock: 15, sku: "NCX-BAG-008-BLK" }],
  },
  {
    id: "prod-9",
    name: "Women Comfort Sandals",
    slug: "women-comfort-sandals",
    description: "Lightweight sandals with cushioned sole for all-day comfort.",
    price: 999,
    salePrice: 799,
    sku: "NCX-FTW-009",
    categoryId: "cat-footwear-womens-footwear",
    categorySlug: "womens-footwear",
    categoryName: "Women's Footwear",
    brandName: "NexCart X",
    images: [IMG.footwear],
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    isActive: true,
    tags: ["sandals", "footwear", "women"],
    rating: 4.5,
    reviewCount: 46,
    variants: [
      { id: "v-9", size: "37", stock: 6, sku: "NCX-FTW-009-37" },
      { id: "v-9b", size: "38", stock: 9, sku: "NCX-FTW-009-38" },
    ],
  },
  {
    id: "prod-10",
    name: "Hydrating Skincare Set",
    slug: "hydrating-skincare-set",
    description: "Daily skincare essentials for a fresh, hydrated look.",
    price: 1299,
    sku: "NCX-BTY-010",
    categoryId: "cat-beauty-and-personal-care-skincare",
    categorySlug: "skincare",
    categoryName: "Skincare",
    brandName: "NexCart X",
    images: [IMG.beauty],
    isFeatured: false,
    isNew: true,
    isActive: true,
    tags: ["skincare", "beauty"],
    rating: 4.2,
    reviewCount: 15,
    variants: [{ id: "v-10", stock: 18, sku: "NCX-BTY-010" }],
  },
];

export const reviews: Review[] = [
  {
    id: "rev-1",
    author: "Ananya S.",
    rating: 5,
    comment: "Kurti quality is lovely and delivery was quick. Will order again!",
    productName: "Floral Print Kurti",
    createdAt: "2026-08-20",
  },
  {
    id: "rev-2",
    author: "Rahul M.",
    rating: 4,
    comment: "Shirt fit is perfect for office wear. Nice fabric.",
    productName: "Slim Fit Mens Shirt",
    createdAt: "2026-08-12",
  },
  {
    id: "rev-3",
    author: "Meera K.",
    rating: 5,
    comment: "Earrings look premium for the price. Great packaging.",
    productName: "Statement Earrings Set",
    createdAt: "2026-07-30",
  },
];

export const coupons: Coupon[] = [
  { code: "WELCOME10", discountType: "percentage", discountValue: 10, minOrder: 999 },
  { code: "STYLE15", discountType: "percentage", discountValue: 15, minOrder: 1999 },
  { code: "FLAT200", discountType: "fixed", discountValue: 200, minOrder: 2499 },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const childSlugs = categories
    .filter((c) => c.parentSlug === categorySlug)
    .map((c) => c.slug);

  const allSlugs = [categorySlug, ...childSlugs];
  return products.filter((p) => allSlugs.includes(p.categorySlug));
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured && p.isActive);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNew && p.isActive);
}

export function getOnSaleProducts(): Product[] {
  return products.filter((p) => p.salePrice && p.isActive);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q)) ||
      p.categoryName.toLowerCase().includes(q) ||
      (p.brandName?.toLowerCase().includes(q) ?? false) ||
      p.sku.toLowerCase().includes(q)
  );
}

export function validateCoupon(
  code: string,
  subtotal: number
): { valid: boolean; discount: number; message?: string } {
  const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
  if (!coupon) return { valid: false, discount: 0, message: "Invalid coupon code" };
  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order of ₹${coupon.minOrder} required`,
    };
  }
  const discount =
    coupon.discountType === "percentage"
      ? (subtotal * coupon.discountValue) / 100
      : coupon.discountValue;
  return { valid: true, discount: Math.min(discount, subtotal) };
}
