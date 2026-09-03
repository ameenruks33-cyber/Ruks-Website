export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  colorHex?: string;
  stock: number;
  sku: string;
  price?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  sku: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  brandName?: string;
  images: string[];
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller?: boolean;
  isActive: boolean;
  tags: string[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  warranty?: string;
  specifications?: Record<string, string>;
  features?: string[];
  hsnCode?: string;
  gstRate?: number;
}


export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentSlug?: string;
  sortOrder: number;
}

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
  maxStock: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  productName: string;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
}

export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrder?: number;
  isActive?: boolean;
}

export interface OrderSummary {
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
}
