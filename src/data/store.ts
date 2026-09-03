import type { Banner, Category, Coupon, Product, Review } from "@/types";

const STOVE_IMG = "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=800&fit=crop";
const KITCHEN_IMG = "https://images.unsplash.com/photo-1556909114-f6e7ad7d4046?w=800&h=800&fit=crop";
const PARTS_IMG = "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=800&fit=crop";

export const categories: Category[] = [
  {
    id: "cat-gas",
    name: "Gas & Kitchen",
    slug: "gas-kitchen",
    description: "NL-GAS stoves, burners, regulators and kitchen gas essentials",
    image: STOVE_IMG,
    sortOrder: 1,
  },
  {
    id: "cat-single",
    name: "Single Burner",
    slug: "single-burner",
    description: "Compact single burner gas stoves for home and shop",
    image: STOVE_IMG,
    parentSlug: "gas-kitchen",
    sortOrder: 1,
  },
  {
    id: "cat-double",
    name: "Double Burner",
    slug: "double-burner",
    description: "2-burner gas stoves — SS and glass top models",
    image: STOVE_IMG,
    parentSlug: "gas-kitchen",
    sortOrder: 2,
  },
  {
    id: "cat-home",
    name: "Home Stoves",
    slug: "home-stoves",
    description: "3-burner and 4-burner gas stoves for home kitchens",
    image: KITCHEN_IMG,
    parentSlug: "gas-kitchen",
    sortOrder: 3,
  },
  {
    id: "cat-commercial",
    name: "Commercial / Restaurant",
    slug: "commercial-stoves",
    description: "Heavy-duty 4-burner, 6-burner and big single burner for hotels & restaurants",
    image: STOVE_IMG,
    parentSlug: "gas-kitchen",
    sortOrder: 4,
  },
  {
    id: "cat-accessories",
    name: "Gas Accessories",
    slug: "gas-accessories",
    description: "Regulators, hoses, lighters, pipes and safety items",
    image: KITCHEN_IMG,
    parentSlug: "gas-kitchen",
    sortOrder: 5,
  },
  {
    id: "cat-spare",
    name: "Spare Parts",
    slug: "spare-parts",
    description: "Burners, valves, knobs and gas stove spare parts",
    image: PARTS_IMG,
    parentSlug: "gas-kitchen",
    sortOrder: 6,
  },
];

export const banners: Banner[] = [
  {
    id: "banner-1",
    title: "NL-GAS Quality Stoves for Every Kitchen",
    subtitle: "Single burner, double burner, home & commercial restaurant stoves — Kerala delivery",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1600&h=700&fit=crop",
    link: "/shop?category=gas-kitchen",
  },
  {
    id: "banner-2",
    title: "Commercial Range — 4 & 6 Burner",
    subtitle: "Restaurant-type heavy-duty burners for hotels, caterers and food shops",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d4046?w=1600&h=700&fit=crop",
    link: "/shop?category=commercial-stoves",
  },
  {
    id: "banner-3",
    title: "Gas Stove Repair & Service",
    subtitle: "Book online — gas leakage check, burner service and regulator replacement",
    image: PARTS_IMG,
    link: "/repair",
  },
];

export const products: Product[] = [
  {
    id: "prod-1",
    name: "Single Burner Gas Stove NL-GAS-SB101",
    slug: "single-burner-gas-stove-nl-gas-sb101",
    description:
      "NL-GAS compact single burner stove with stainless steel body and brass burner. Ideal for bachelor flats, small kitchens and tea shops. ISI certified, manual ignition.",
    price: 1899,
    salePrice: 1599,
    sku: "NL-GAS-SB101",
    categoryId: "cat-single",
    categorySlug: "single-burner",
    categoryName: "Single Burner",
    brandName: "NL-GAS",
    images: [STOVE_IMG],
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    isActive: true,
    tags: ["single burner", "nl-gas", "gas stove", "compact"],
    rating: 4.7,
    reviewCount: 86,
    warranty: "1 Year Warranty",
    features: ["Brass burner", "SS body", "ISI certified", "Compact size"],
    specifications: { Burners: "1", Body: "Stainless Steel", Ignition: "Manual", SKU: "NL-GAS-SB101" },
    variants: [{ id: "v-1", stock: 24, sku: "NL-GAS-SB101" }],
  },
  {
    id: "prod-2",
    name: "Single Burner Heavy Duty NL-GAS-SB102",
    slug: "single-burner-heavy-duty-nl-gas-sb102",
    description:
      "NL-GAS heavy-duty single burner for small restaurants and catering. High flame output, reinforced pan support, long-life brass burner head.",
    price: 2499,
    sku: "NL-GAS-SB102",
    categoryId: "cat-single",
    categorySlug: "single-burner",
    categoryName: "Single Burner",
    brandName: "NL-GAS",
    images: [STOVE_IMG],
    isFeatured: false,
    isNew: true,
    isActive: true,
    tags: ["single burner", "heavy duty", "nl-gas", "shop"],
    rating: 4.6,
    reviewCount: 42,
    warranty: "1 Year Warranty",
    features: ["Heavy-duty burner", "High flame", "Reinforced stand"],
    variants: [{ id: "v-2", stock: 18, sku: "NL-GAS-SB102" }],
  },
  {
    id: "prod-3",
    name: "Double Burner Gas Stove NL-GAS-DB201",
    slug: "double-burner-gas-stove-nl-gas-db201",
    description:
      "NL-GAS 2-burner gas stove with stainless steel top. Efficient brass burners, stable design for everyday Kerala home cooking.",
    price: 2799,
    salePrice: 2399,
    sku: "NL-GAS-DB201",
    categoryId: "cat-double",
    categorySlug: "double-burner",
    categoryName: "Double Burner",
    brandName: "NL-GAS",
    images: [STOVE_IMG],
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    isActive: true,
    tags: ["double burner", "2 burner", "nl-gas", "home"],
    rating: 4.8,
    reviewCount: 112,
    warranty: "1 Year Warranty",
    features: ["2 brass burners", "SS top", "ISI certified", "Stable pan supports"],
    specifications: { Burners: "2", Top: "Stainless Steel", Ignition: "Manual", SKU: "NL-GAS-DB201" },
    variants: [{ id: "v-3", stock: 20, sku: "NL-GAS-DB201" }],
  },
  {
    id: "prod-4",
    name: "Double Burner Glass Top NL-GAS-DB202",
    slug: "double-burner-glass-top-nl-gas-db202",
    description:
      "NL-GAS premium double burner with toughened glass top and auto ignition. Modern look, easy to clean, perfect for modular kitchens.",
    price: 3499,
    salePrice: 2999,
    sku: "NL-GAS-DB202",
    categoryId: "cat-double",
    categorySlug: "double-burner",
    categoryName: "Double Burner",
    brandName: "NL-GAS",
    images: [KITCHEN_IMG],
    isFeatured: true,
    isNew: true,
    isActive: true,
    tags: ["double burner", "glass top", "auto ignition", "nl-gas"],
    rating: 4.7,
    reviewCount: 67,
    warranty: "1 Year Warranty",
    features: ["Toughened glass top", "Auto ignition", "2 brass burners"],
    variants: [{ id: "v-4", stock: 14, sku: "NL-GAS-DB202" }],
  },
  {
    id: "prod-5",
    name: "3 Burner Home Gas Stove NL-GAS-HB301",
    slug: "3-burner-home-gas-stove-nl-gas-hb301",
    description:
      "NL-GAS 3-burner home gas stove with stainless steel body. Three brass burners for busy family kitchens.",
    price: 4499,
    sku: "NL-GAS-HB301",
    categoryId: "cat-home",
    categorySlug: "home-stoves",
    categoryName: "Home Stoves",
    brandName: "NL-GAS",
    images: [KITCHEN_IMG],
    isFeatured: true,
    isNew: false,
    isActive: true,
    tags: ["3 burner", "home stove", "nl-gas"],
    rating: 4.6,
    reviewCount: 54,
    warranty: "1 Year Warranty",
    variants: [{ id: "v-5", stock: 12, sku: "NL-GAS-HB301" }],
  },
  {
    id: "prod-6",
    name: "4 Burner Home Glass Top NL-GAS-HB401",
    slug: "4-burner-home-glass-top-nl-gas-hb401",
    description:
      "NL-GAS 4-burner home gas stove with toughened glass top and auto ignition. Premium choice for large family kitchens.",
    price: 5999,
    salePrice: 4999,
    sku: "NL-GAS-HB401",
    categoryId: "cat-home",
    categorySlug: "home-stoves",
    categoryName: "Home Stoves",
    brandName: "NL-GAS",
    images: [STOVE_IMG],
    isFeatured: true,
    isNew: true,
    isBestSeller: true,
    isActive: true,
    tags: ["4 burner", "glass top", "home", "nl-gas"],
    rating: 4.8,
    reviewCount: 78,
    warranty: "1 Year Warranty",
    features: ["4 brass burners", "Toughened glass", "Auto ignition"],
    variants: [{ id: "v-6", stock: 10, sku: "NL-GAS-HB401" }],
  },
  {
    id: "prod-7",
    name: "Restaurant 4 Burner Commercial NL-GAS-RS401",
    slug: "restaurant-4-burner-commercial-nl-gas-rs401",
    description:
      "NL-GAS restaurant-type 4-burner commercial gas stove. Heavy-duty SS body, high-BTU burners for hotels, caterers and food courts. Built for continuous daily use.",
    price: 8999,
    salePrice: 7999,
    sku: "NL-GAS-RS401",
    categoryId: "cat-commercial",
    categorySlug: "commercial-stoves",
    categoryName: "Commercial / Restaurant",
    brandName: "NL-GAS",
    images: [STOVE_IMG],
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    isActive: true,
    tags: ["commercial", "restaurant", "4 burner", "nl-gas", "hotel"],
    rating: 4.9,
    reviewCount: 45,
    warranty: "1 Year Commercial Warranty",
    features: ["Heavy-duty 4 burners", "Restaurant grade SS", "High flame output", "Continuous use design"],
    specifications: { Burners: "4", Type: "Commercial", Body: "Heavy SS", SKU: "NL-GAS-RS401" },
    variants: [{ id: "v-7", stock: 8, sku: "NL-GAS-RS401" }],
  },
  {
    id: "prod-8",
    name: "Restaurant 6 Burner Commercial NL-GAS-RS601",
    slug: "restaurant-6-burner-commercial-nl-gas-rs601",
    description:
      "NL-GAS 6-burner commercial gas stove for large restaurants and catering units. Six high-power burners, wide cooking area, industrial-grade construction.",
    price: 12999,
    salePrice: 11499,
    sku: "NL-GAS-RS601",
    categoryId: "cat-commercial",
    categorySlug: "commercial-stoves",
    categoryName: "Commercial / Restaurant",
    brandName: "NL-GAS",
    images: [STOVE_IMG],
    isFeatured: true,
    isNew: true,
    isActive: true,
    tags: ["commercial", "restaurant", "6 burner", "nl-gas", "catering"],
    rating: 4.9,
    reviewCount: 31,
    warranty: "1 Year Commercial Warranty",
    features: ["6 heavy-duty burners", "Wide top", "Industrial grade", "For high-volume cooking"],
    specifications: { Burners: "6", Type: "Commercial", Body: "Heavy SS", SKU: "NL-GAS-RS601" },
    variants: [{ id: "v-8", stock: 5, sku: "NL-GAS-RS601" }],
  },
  {
    id: "prod-9",
    name: "Big Single Burner Commercial NL-GAS-RS101",
    slug: "big-single-burner-commercial-nl-gas-rs101",
    description:
      "NL-GAS big single burner commercial stove — restaurant type with oversized burner head for large vessels, kerala sadya cooking and bulk frying. Stand-alone heavy base.",
    price: 3499,
    salePrice: 2999,
    sku: "NL-GAS-RS101",
    categoryId: "cat-commercial",
    categorySlug: "commercial-stoves",
    categoryName: "Commercial / Restaurant",
    brandName: "NL-GAS",
    images: [STOVE_IMG],
    isFeatured: true,
    isNew: false,
    isActive: true,
    tags: ["big single burner", "commercial", "restaurant", "nl-gas", "large vessel"],
    rating: 4.8,
    reviewCount: 58,
    warranty: "1 Year Warranty",
    features: ["Oversized burner head", "For large vessels", "Restaurant type", "Heavy base stand"],
    specifications: { Burners: "1 (Big)", Type: "Commercial Single", SKU: "NL-GAS-RS101" },
    variants: [{ id: "v-9", stock: 15, sku: "NL-GAS-RS101" }],
  },
  {
    id: "prod-10",
    name: "LPG Regulator with Hose NL-GAS-ACC501",
    slug: "lpg-regulator-with-hose-nl-gas-acc501",
    description: "ISI-marked LPG regulator with 1.5m suraksha hose. Essential safety kit for all NL-GAS stoves.",
    price: 649,
    sku: "NL-GAS-ACC501",
    categoryId: "cat-accessories",
    categorySlug: "gas-accessories",
    categoryName: "Gas Accessories",
    brandName: "NL-GAS",
    images: [KITCHEN_IMG],
    isFeatured: false,
    isNew: false,
    isActive: true,
    tags: ["regulator", "lpg", "hose", "nl-gas"],
    rating: 4.7,
    reviewCount: 93,
    variants: [{ id: "v-10", stock: 40, sku: "NL-GAS-ACC501" }],
  },
  {
    id: "prod-11",
    name: "Gas Lighter & Ignition Kit NL-GAS-ACC502",
    slug: "gas-lighter-ignition-kit-nl-gas-acc502",
    description: "Long-handle gas lighter with child-lock. Safe ignition for manual gas stoves.",
    price: 149,
    sku: "NL-GAS-ACC502",
    categoryId: "cat-accessories",
    categorySlug: "gas-accessories",
    categoryName: "Gas Accessories",
    brandName: "NL-GAS",
    images: [PARTS_IMG],
    isFeatured: false,
    isNew: false,
    isActive: true,
    tags: ["lighter", "ignition", "nl-gas"],
    rating: 4.4,
    reviewCount: 36,
    variants: [{ id: "v-11", stock: 60, sku: "NL-GAS-ACC502" }],
  },
  {
    id: "prod-12",
    name: "Suraksha Gas Pipe 2m NL-GAS-ACC503",
    slug: "suraksha-gas-pipe-2m-nl-gas-acc503",
    description: "ISI-certified suraksha LPG hose pipe 2 metre. Oil-resistant, clip included.",
    price: 399,
    sku: "NL-GAS-ACC503",
    categoryId: "cat-accessories",
    categorySlug: "gas-accessories",
    categoryName: "Gas Accessories",
    brandName: "NL-GAS",
    images: [PARTS_IMG],
    isFeatured: false,
    isNew: true,
    isActive: true,
    tags: ["gas pipe", "hose", "suraksha", "nl-gas"],
    rating: 4.5,
    reviewCount: 28,
    variants: [{ id: "v-12", stock: 35, sku: "NL-GAS-ACC503" }],
  },
  {
    id: "prod-13",
    name: "Brass Burner Set (4 Pcs) NL-GAS-SP601",
    slug: "brass-burner-set-nl-gas-sp601",
    description: "Set of 4 brass burners compatible with NL-GAS and standard gas stoves. Improved flame and fuel efficiency.",
    price: 449,
    sku: "NL-GAS-SP601",
    categoryId: "cat-spare",
    categorySlug: "spare-parts",
    categoryName: "Spare Parts",
    brandName: "NL-GAS",
    images: [PARTS_IMG],
    isFeatured: false,
    isNew: false,
    isActive: true,
    tags: ["burner", "spare part", "brass", "nl-gas"],
    rating: 4.6,
    reviewCount: 22,
    variants: [{ id: "v-13", stock: 45, sku: "NL-GAS-SP601" }],
  },
  {
    id: "prod-14",
    name: "Gas Stove Knob Set NL-GAS-SP602",
    slug: "gas-stove-knob-set-nl-gas-sp602",
    description: "Universal gas stove knob set — 4 pieces. Replacement knobs for NL-GAS home and commercial stoves.",
    price: 199,
    sku: "NL-GAS-SP602",
    categoryId: "cat-spare",
    categorySlug: "spare-parts",
    categoryName: "Spare Parts",
    brandName: "NL-GAS",
    images: [PARTS_IMG],
    isFeatured: false,
    isNew: false,
    isActive: true,
    tags: ["knob", "spare part", "nl-gas"],
    rating: 4.3,
    reviewCount: 19,
    variants: [{ id: "v-14", stock: 50, sku: "NL-GAS-SP602" }],
  },
  {
    id: "prod-15",
    name: "Tawa Stand for Gas Stove NL-GAS-ACC504",
    slug: "tawa-stand-gas-stove-nl-gas-acc504",
    description: "Heavy iron tawa stand for roti/chapati cooking on gas stoves. Fits NL-GAS single and double burner models.",
    price: 299,
    sku: "NL-GAS-ACC504",
    categoryId: "cat-accessories",
    categorySlug: "gas-accessories",
    categoryName: "Gas Accessories",
    brandName: "NL-GAS",
    images: [KITCHEN_IMG],
    isFeatured: false,
    isNew: true,
    isActive: true,
    tags: ["tawa stand", "accessory", "nl-gas"],
    rating: 4.5,
    reviewCount: 14,
    variants: [{ id: "v-15", stock: 30, sku: "NL-GAS-ACC504" }],
  },
];

export const reviews: Review[] = [
  {
    id: "rev-web-1",
    author: "Rajesh K.",
    rating: 5,
    comment: "Bought NL-GAS double burner — solid build, fast delivery to Ernakulam. Genuine product!",
    productName: "NL Gas & Kitchen",
    createdAt: "2026-08-20",
  },
  {
    id: "rev-1",
    author: "Suresh N.",
    rating: 5,
    comment: "NL-GAS-RS401 commercial 4-burner is perfect for our hotel kitchen. Heavy duty and good flame.",
    productName: "Restaurant 4 Burner Commercial NL-GAS-RS401",
    createdAt: "2026-08-15",
  },
  {
    id: "rev-2",
    author: "Priya M.",
    rating: 5,
    comment: "Single burner NL-GAS-SB101 is compact and perfect for our tea shop. Great price.",
    productName: "Single Burner Gas Stove NL-GAS-SB101",
    createdAt: "2026-08-10",
  },
  {
    id: "rev-3",
    author: "Anil V.",
    rating: 5,
    comment: "6-burner commercial stove delivered and installed. NL-GAS quality is excellent for catering.",
    productName: "Restaurant 6 Burner Commercial NL-GAS-RS601",
    createdAt: "2026-08-05",
  },
  {
    id: "rev-4",
    author: "Faisal M.",
    rating: 4,
    comment: "Big single burner NL-GAS-RS101 handles our large vessels perfectly. Restaurant type quality.",
    productName: "Big Single Burner Commercial NL-GAS-RS101",
    createdAt: "2026-07-28",
  },
];

export const coupons: Coupon[] = [
  { code: "WELCOME10", discountType: "percentage", discountValue: 10, minOrder: 999 },
  { code: "NLGAS15", discountType: "percentage", discountValue: 15, minOrder: 2999 },
  { code: "FLAT300", discountType: "fixed", discountValue: 300, minOrder: 4999 },
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
      p.categoryName.toLowerCase().includes(q) ||
      (p.brandName?.toLowerCase().includes(q) ?? false) ||
      p.sku.toLowerCase().includes(q)
  );
}

export function validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message?: string } {
  const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
  if (!coupon) return { valid: false, discount: 0, message: "Invalid coupon code" };
  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return { valid: false, discount: 0, message: `Minimum order of ₹${coupon.minOrder} required` };
  }
  const discount =
    coupon.discountType === "percentage"
      ? (subtotal * coupon.discountValue) / 100
      : coupon.discountValue;
  return { valid: true, discount: Math.min(discount, subtotal) };
}
