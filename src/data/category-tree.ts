import type { Category } from "@/types";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const IMAGES = {
  ethnic: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1000&fit=crop",
  western: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop",
  men: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&h=1000&fit=crop",
  kids: "https://images.unsplash.com/photo-1503919545889-aef636e10ad1?w=800&h=1000&fit=crop",
  jewellery: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=1000&fit=crop",
  beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=1000&fit=crop",
  electronics: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=1000&fit=crop",
  footwear: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop",
  bags: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop",
  sports: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=1000&fit=crop",
  auto: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=1000&fit=crop",
  stationery: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&h=1000&fit=crop",
} as const;

interface CategorySeed {
  name: string;
  image: string;
  description?: string;
  children: string[];
}

const TREE: CategorySeed[] = [
  {
    name: "Women Ethnic Wear",
    image: IMAGES.ethnic,
    description: "Sarees, kurtis, suits and festive ethnic looks",
    children: ["Sarees", "Kurtis", "Salwar Suits", "Dupattas", "Lehenga Choli", "Dress Materials"],
  },
  {
    name: "Women Western Wear",
    image: IMAGES.western,
    description: "Everyday western styles for women",
    children: ["Tops", "T-Shirts", "Dresses", "Jeans", "Trousers", "Jumpsuits", "Skirts"],
  },
  {
    name: "Men's Clothing",
    image: IMAGES.men,
    description: "Shirts, jeans, kurtas and essentials for men",
    children: ["T-Shirts", "Shirts", "Jeans", "Trousers", "Kurtas", "Track Pants", "Innerwear"],
  },
  {
    name: "Kids",
    image: IMAGES.kids,
    description: "Clothing, toys and care for kids & babies",
    children: [
      "Boys Clothing",
      "Girls Clothing",
      "Baby Clothing",
      "Toys",
      "School Accessories",
      "Baby Care",
    ],
  },
  {
    name: "Jewellery & Accessories",
    image: IMAGES.jewellery,
    description: "Jewellery, watches and finishing accessories",
    children: [
      "Artificial Jewellery",
      "Earrings",
      "Necklaces",
      "Bangles",
      "Rings",
      "Watches",
      "Hair Accessories",
      "Handbags",
    ],
  },
  {
    name: "Beauty & Personal Care",
    image: IMAGES.beauty,
    description: "Makeup, skincare, grooming and home care",
    children: [
      "Makeup",
      "Skincare",
      "Hair Care",
      "Fragrances",
      "Grooming Products",
      "Beauty Accessories",
      "Curtains",
      "Cleaning Products",
      "Bathroom Accessories",
    ],
  },
  {
    name: "Electronics",
    image: IMAGES.electronics,
    description: "Mobile accessories, audio and charging",
    children: ["Mobile Accessories", "Chargers", "Earphones", "Speakers"],
  },
  {
    name: "Footwear",
    image: IMAGES.footwear,
    description: "Shoes, sandals and slippers for everyone",
    children: [
      "Women's Footwear",
      "Men's Footwear",
      "Kids' Footwear",
      "Sandals",
      "Slippers",
      "Shoes",
    ],
  },
  {
    name: "Bags & Luggage",
    image: IMAGES.bags,
    description: "Handbags, travel bags and everyday carry",
    children: [
      "Handbags",
      "Backpacks",
      "Wallets",
      "Travel Bags",
      "School Bags",
      "Bathroom Fittings",
    ],
  },
  {
    name: "Sports & Fitness",
    image: IMAGES.sports,
    description: "Gym, yoga and activewear essentials",
    children: ["Gym Accessories", "Yoga Products", "Sportswear", "Fitness Equipment"],
  },
  {
    name: "Automotive",
    image: IMAGES.auto,
    description: "Car and bike accessories",
    children: ["Car Accessories", "Bike Accessories", "Cleaning Products", "Car Electronics"],
  },
  {
    name: "Stationery & Office Supplies",
    image: IMAGES.stationery,
    description: "School and office stationery",
    children: ["Pens", "Notebooks", "School Supplies", "Office Accessories"],
  },
];

/** Unique child slug when the same label appears under multiple parents */
function childSlug(parentSlug: string, childName: string): string {
  const base = slugify(childName);
  // Disambiguate repeated labels across parents
  const shared = ["t-shirts", "jeans", "trousers", "handbags", "cleaning-products"];
  if (shared.includes(base)) {
    return `${parentSlug}-${base}`;
  }
  return base;
}

export const categories: Category[] = TREE.flatMap((parent, parentIndex) => {
  const parentSlug = slugify(parent.name);
  const parentCategory: Category = {
    id: `cat-${parentSlug}`,
    name: parent.name,
    slug: parentSlug,
    description: parent.description,
    image: parent.image,
    sortOrder: parentIndex + 1,
  };

  const children: Category[] = parent.children.map((childName, childIndex) => ({
    id: `cat-${parentSlug}-${slugify(childName)}`,
    name: childName,
    slug: childSlug(parentSlug, childName),
    description: `${childName} in ${parent.name}`,
    image: parent.image,
    parentSlug,
    sortOrder: childIndex + 1,
  }));

  return [parentCategory, ...children];
});

export const PARENT_CATEGORIES = categories.filter((c) => !c.parentSlug);

export function getChildCategories(parentSlug: string): Category[] {
  return categories
    .filter((c) => c.parentSlug === parentSlug)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export const CATEGORY_NAV_LINKS = PARENT_CATEGORIES.map((c) => ({
  label: c.name,
  href: `/shop?category=${c.slug}`,
}));
