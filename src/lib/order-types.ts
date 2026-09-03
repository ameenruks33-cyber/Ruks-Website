export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED";

export interface OrderItem {
  productId?: string;
  variantId?: string;
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  image?: string;
}

export interface OrderCustomer {
  email: string;
  fullName: string;
  phone: string;
}

export interface OrderAddress {
  line1: string;
  line2?: string;
  city: string;
  postalCode?: string;
  country: string;
}

export interface OrderShipping {
  method: string;
  methodName: string;
  cost: number;
}

export interface OrderPayment {
  method: string;
  methodName: string;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currency: string;
  couponCode?: string;
}

export interface StoredOrder {
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  customer: OrderCustomer;
  address: OrderAddress;
  shipping: OrderShipping;
  payment: OrderPayment;
  totals: OrderTotals;
  createdAt: string;
  whatsappNotified?: boolean;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  customer: OrderCustomer;
  address: OrderAddress;
  shipping: OrderShipping;
  payment: OrderPayment;
  totals: OrderTotals;
}

/** Safe order view for public tracking (no email/phone/address). */
export interface PublicOrderView {
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
    image?: string;
  }>;
  shipping: { methodName: string; cost: number };
  payment: { methodName: string };
  totals: {
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    currency: string;
  };
  customer: { fullName: string };
}
