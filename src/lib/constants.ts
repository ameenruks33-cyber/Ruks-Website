export const SITE = {
  name: "RukZa's Fashion Hub",
  tagline: "Style for Everyone",
  description:
    "Premium fashion marketplace for ladies, gents, and children. Abayas, hijabs, traditional wear, and more.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  email: "hello@rukzasfashionhub.com",
  phone: "+971 XX XXX XXXX",
  social: {
    facebook: "https://facebook.com/rukzasfashionhub",
    instagram: "https://instagram.com/rukzasfashionhub",
    whatsapp: "https://wa.me/971XXXXXXXXX",
  },
} as const;

export const NAV_LINKS = [
  { label: "Abayas", href: "/shop?category=abayas" },
  { label: "Ladies", href: "/shop?category=ladies" },
  { label: "Gents", href: "/shop?category=gents" },
  { label: "Kids", href: "/shop?category=children" },
  { label: "New Arrivals", href: "/shop?filter=new" },
  { label: "Best Sellers", href: "/shop?filter=bestsellers" },
  { label: "Offers", href: "/shop?filter=offers" },
] as const;

export const SHIPPING_METHODS = [
  { id: "standard", name: "Standard Delivery", price: 15, days: "3-5 business days" },
  { id: "express", name: "Express Delivery", price: 35, days: "1-2 business days" },
  { id: "pickup", name: "Store Pickup", price: 0, days: "Same day" },
] as const;

export const PAYMENT_METHODS = [
  { id: "card", name: "Credit / Debit Card", icon: "credit-card" },
  { id: "apple_pay", name: "Apple Pay", icon: "smartphone" },
  { id: "cod", name: "Cash on Delivery", icon: "banknote" },
] as const;
