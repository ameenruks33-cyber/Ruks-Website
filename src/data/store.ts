import type { Banner, Category, Coupon, Product, Review } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-ladies",
    name: "Ladies",
    slug: "ladies",
    description: "Elegant modest fashion for women",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop",
    sortOrder: 1,
  },
  {
    id: "cat-gents",
    name: "Gents",
    slug: "gents",
    description: "Sharp styles for modern men",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=800&fit=crop",
    sortOrder: 2,
  },
  {
    id: "cat-children",
    name: "Children",
    slug: "children",
    description: "Comfortable & stylish kids wear",
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&h=800&fit=crop",
    sortOrder: 3,
  },
  {
    id: "cat-abayas",
    name: "Abayas",
    slug: "abayas",
    description: "Premium abaya collection",
    image: "https://images.unsplash.com/photo-1583391733981-5a1e3a5c3b3e?w=600&h=800&fit=crop",
    parentSlug: "ladies",
    sortOrder: 1,
  },
  {
    id: "cat-hijabs",
    name: "Hijabs",
    slug: "hijabs",
    description: "Beautiful hijab styles",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
    parentSlug: "ladies",
    sortOrder: 2,
  },
  {
    id: "cat-shirts",
    name: "Shirts",
    slug: "shirts",
    description: "Formal & casual shirts",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop",
    parentSlug: "gents",
    sortOrder: 1,
  },
];

export const banners: Banner[] = [
  {
    id: "banner-1",
    title: "Summer Collection 2026",
    subtitle: "Up to 40% off on selected items",
    image: "https://images.unsplash.com/photo-1483985988354-763728e36855?w=1600&h=700&fit=crop",
    link: "/shop?filter=offers",
  },
  {
    id: "banner-2",
    title: "New Arrivals",
    subtitle: "Discover the latest modest fashion trends",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&h=700&fit=crop",
    link: "/shop?filter=new",
  },
  {
    id: "banner-3",
    title: "Kids Party Wear",
    subtitle: "Make every occasion special",
    image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=1600&h=700&fit=crop",
    link: "/shop?category=children",
  },
];

export const products: Product[] = [
  {
    id: "prod-1",
    name: "Embroidered Black Abaya",
    slug: "embroidered-black-abaya",
    description:
      "Elegant black abaya with delicate gold embroidery along the sleeves and hem. Made from premium Nida fabric for comfort and durability. Perfect for everyday wear and special occasions.",
    price: 299,
    salePrice: 249,
    sku: "RZ-ABY-001",
    categoryId: "cat-abayas",
    categorySlug: "abayas",
    categoryName: "Abayas",
    brandName: "RukZa Premium",
    images: [
      "https://images.unsplash.com/photo-1583391733981-5a1e3a5c3b3e?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1000&fit=crop",
    ],
    isFeatured: true,
    isNew: true,
    isActive: true,
    tags: ["abaya", "modest", "black", "embroidered"],
    rating: 4.8,
    reviewCount: 24,
    variants: [
      { id: "v-1-s", size: "S", stock: 12, sku: "RZ-ABY-001-S" },
      { id: "v-1-m", size: "M", stock: 18, sku: "RZ-ABY-001-M" },
      { id: "v-1-l", size: "L", stock: 15, sku: "RZ-ABY-001-L" },
      { id: "v-1-xl", size: "XL", stock: 8, sku: "RZ-ABY-001-XL" },
    ],
  },
  {
    id: "prod-2",
    name: "Silk Chiffon Hijab Set",
    slug: "silk-chiffon-hijab-set",
    description:
      "Luxurious silk chiffon hijab set of 3 in complementary colors. Lightweight, breathable, and drapes beautifully. Includes matching undercap.",
    price: 89,
    sku: "RZ-HIJ-002",
    categoryId: "cat-hijabs",
    categorySlug: "hijabs",
    categoryName: "Hijabs",
    brandName: "RukZa Premium",
    images: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop",
    ],
    isFeatured: true,
    isNew: false,
    isActive: true,
    tags: ["hijab", "silk", "chiffon", "set"],
    rating: 4.9,
    reviewCount: 56,
    variants: [
      { id: "v-2-nude", color: "Nude", colorHex: "#E8D5C4", stock: 30, sku: "RZ-HIJ-002-N" },
      { id: "v-2-black", color: "Black", colorHex: "#1a1a1a", stock: 25, sku: "RZ-HIJ-002-B" },
      { id: "v-2-mauve", color: "Mauve", colorHex: "#9B7B8A", stock: 20, sku: "RZ-HIJ-002-M" },
    ],
  },
  {
    id: "prod-3",
    name: "Floral Modest Maxi Dress",
    slug: "floral-modest-maxi-dress",
    description:
      "Beautiful floral print maxi dress with long sleeves and modest neckline. Flowing A-line silhouette perfect for summer events and casual outings.",
    price: 189,
    salePrice: 149,
    sku: "RZ-DRS-003",
    categoryId: "cat-ladies",
    categorySlug: "ladies",
    categoryName: "Ladies",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a23b99e942?w=800&h=1000&fit=crop",
    ],
    isFeatured: true,
    isNew: true,
    isActive: true,
    tags: ["dress", "floral", "maxi", "modest"],
    rating: 4.7,
    reviewCount: 18,
    variants: [
      { id: "v-3-s", size: "S", color: "Floral Blue", colorHex: "#4A6FA5", stock: 10, sku: "RZ-DRS-003-S" },
      { id: "v-3-m", size: "M", color: "Floral Blue", colorHex: "#4A6FA5", stock: 14, sku: "RZ-DRS-003-M" },
      { id: "v-3-l", size: "L", color: "Floral Blue", colorHex: "#4A6FA5", stock: 9, sku: "RZ-DRS-003-L" },
    ],
  },
  {
    id: "prod-4",
    name: "Premium Cotton Kurta",
    slug: "premium-cotton-kurta",
    description:
      "Classic white cotton kurta with subtle embroidery on the collar. Breathable fabric ideal for daily wear and Friday prayers.",
    price: 129,
    sku: "RZ-KRT-004",
    categoryId: "cat-gents",
    categorySlug: "gents",
    categoryName: "Gents",
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop",
    ],
    isFeatured: false,
    isNew: false,
    isActive: true,
    tags: ["kurta", "cotton", "traditional", "white"],
    rating: 4.6,
    reviewCount: 32,
    variants: [
      { id: "v-4-m", size: "M", stock: 20, sku: "RZ-KRT-004-M" },
      { id: "v-4-l", size: "L", stock: 22, sku: "RZ-KRT-004-L" },
      { id: "v-4-xl", size: "XL", stock: 16, sku: "RZ-KRT-004-XL" },
      { id: "v-4-xxl", size: "XXL", stock: 10, sku: "RZ-KRT-004-XXL" },
    ],
  },
  {
    id: "prod-5",
    name: "Slim Fit Dress Shirt",
    slug: "slim-fit-dress-shirt",
    description:
      "Modern slim fit dress shirt in premium Egyptian cotton. Wrinkle-resistant finish. Available in classic colors for office and formal occasions.",
    price: 159,
    salePrice: 119,
    sku: "RZ-SHT-005",
    categoryId: "cat-shirts",
    categorySlug: "shirts",
    categoryName: "Shirts",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=1000&fit=crop",
    ],
    isFeatured: true,
    isNew: false,
    isActive: true,
    tags: ["shirt", "formal", "slim-fit", "cotton"],
    rating: 4.5,
    reviewCount: 41,
    variants: [
      { id: "v-5-m-w", size: "M", color: "White", colorHex: "#FFFFFF", stock: 15, sku: "RZ-SHT-005-MW" },
      { id: "v-5-l-w", size: "L", color: "White", colorHex: "#FFFFFF", stock: 18, sku: "RZ-SHT-005-LW" },
      { id: "v-5-m-b", size: "M", color: "Light Blue", colorHex: "#A8C8E8", stock: 12, sku: "RZ-SHT-005-MB" },
      { id: "v-5-l-b", size: "L", color: "Light Blue", colorHex: "#A8C8E8", stock: 14, sku: "RZ-SHT-005-LB" },
    ],
  },
  {
    id: "prod-6",
    name: "Girls Party Dress",
    slug: "girls-party-dress",
    description:
      "Adorable party dress with tulle skirt and satin bow. Perfect for birthdays, Eid celebrations, and special occasions.",
    price: 99,
    sku: "RZ-KID-006",
    categoryId: "cat-children",
    categorySlug: "children",
    categoryName: "Children",
    images: [
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&h=1000&fit=crop",
    ],
    isFeatured: true,
    isNew: true,
    isActive: true,
    tags: ["kids", "girls", "party", "dress"],
    rating: 4.9,
    reviewCount: 15,
    variants: [
      { id: "v-6-4", size: "4Y", color: "Pink", colorHex: "#F4A7B9", stock: 8, sku: "RZ-KID-006-4" },
      { id: "v-6-6", size: "6Y", color: "Pink", colorHex: "#F4A7B9", stock: 10, sku: "RZ-KID-006-6" },
      { id: "v-6-8", size: "8Y", color: "Pink", colorHex: "#F4A7B9", stock: 7, sku: "RZ-KID-006-8" },
    ],
  },
  {
    id: "prod-7",
    name: "Boys School Uniform Set",
    slug: "boys-school-uniform-set",
    description:
      "Complete school uniform set including shirt and trousers. Durable, easy-care fabric. Available in standard school colors.",
    price: 149,
    sku: "RZ-KID-007",
    categoryId: "cat-children",
    categorySlug: "children",
    categoryName: "Children",
    images: [
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&h=1000&fit=crop",
    ],
    isFeatured: false,
    isNew: false,
    isActive: true,
    tags: ["kids", "boys", "school", "uniform"],
    rating: 4.4,
    reviewCount: 28,
    variants: [
      { id: "v-7-6", size: "6Y", stock: 15, sku: "RZ-KID-007-6" },
      { id: "v-7-8", size: "8Y", stock: 18, sku: "RZ-KID-007-8" },
      { id: "v-7-10", size: "10Y", stock: 12, sku: "RZ-KID-007-10" },
      { id: "v-7-12", size: "12Y", stock: 10, sku: "RZ-KID-007-12" },
    ],
  },
  {
    id: "prod-8",
    name: "Embellished Evening Abaya",
    slug: "embellished-evening-abaya",
    description:
      "Stunning evening abaya with crystal embellishments and flowing cape sleeves. A statement piece for weddings and formal events.",
    price: 449,
    salePrice: 379,
    sku: "RZ-ABY-008",
    categoryId: "cat-abayas",
    categorySlug: "abayas",
    categoryName: "Abayas",
    brandName: "RukZa Couture",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1000&fit=crop",
    ],
    isFeatured: true,
    isNew: true,
    isActive: true,
    tags: ["abaya", "evening", "embellished", "couture"],
    rating: 5.0,
    reviewCount: 12,
    variants: [
      { id: "v-8-s", size: "S", stock: 5, sku: "RZ-ABY-008-S" },
      { id: "v-8-m", size: "M", stock: 6, sku: "RZ-ABY-008-M" },
      { id: "v-8-l", size: "L", stock: 4, sku: "RZ-ABY-008-L" },
    ],
  },
];

export const reviews: Review[] = [
  {
    id: "rev-1",
    author: "Fatima A.",
    rating: 5,
    comment: "Absolutely beautiful abaya! The quality exceeded my expectations. Will definitely order again.",
    productName: "Embroidered Black Abaya",
    createdAt: "2026-08-15",
  },
  {
    id: "rev-2",
    author: "Sarah M.",
    rating: 5,
    comment: "The hijab set is so soft and elegant. Fast delivery and lovely packaging too!",
    productName: "Silk Chiffon Hijab Set",
    createdAt: "2026-08-10",
  },
  {
    id: "rev-3",
    author: "Ahmed K.",
    rating: 4,
    comment: "Great quality kurta, fits perfectly. The cotton is very comfortable for daily wear.",
    productName: "Premium Cotton Kurta",
    createdAt: "2026-08-05",
  },
  {
    id: "rev-4",
    author: "Layla H.",
    rating: 5,
    comment: "My daughter loved her party dress! It was the highlight of her birthday celebration.",
    productName: "Girls Party Dress",
    createdAt: "2026-07-28",
  },
];

export const coupons: Coupon[] = [
  { code: "WELCOME10", discountType: "percentage", discountValue: 10, minOrder: 100 },
  { code: "SUMMER25", discountType: "percentage", discountValue: 25, minOrder: 200 },
  { code: "FLAT50", discountType: "fixed", discountValue: 50, minOrder: 300 },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const cat = categories.find((c) => c.slug === categorySlug);
  if (!cat) return [];

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
      p.categoryName.toLowerCase().includes(q)
  );
}

export function validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message?: string } {
  const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
  if (!coupon) return { valid: false, discount: 0, message: "Invalid coupon code" };
  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return { valid: false, discount: 0, message: `Minimum order of AED ${coupon.minOrder} required` };
  }
  const discount =
    coupon.discountType === "percentage"
      ? (subtotal * coupon.discountValue) / 100
      : coupon.discountValue;
  return { valid: true, discount: Math.min(discount, subtotal) };
}
