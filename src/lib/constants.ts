export const SITE = {
  name: "NexCart X",
  tagline: "Shop the next look",
  description:
    "Discover fashion, lifestyle and everyday essentials — women, men, kids, jewellery, beauty, footwear and more.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  email: "hello@nexcartx.store",
  phone: "+91 98765 43210",
  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    whatsapp: "https://wa.me/919876543210",
  },
} as const;

export const NAV_LINKS = [
  { label: "Women Ethnic", href: "/shop?category=women-ethnic-wear" },
  { label: "Women Western", href: "/shop?category=women-western-wear" },
  { label: "Men", href: "/shop?category=mens-clothing" },
  { label: "Kids", href: "/shop?category=kids" },
  { label: "Jewellery", href: "/shop?category=jewellery-and-accessories" },
  { label: "Beauty", href: "/shop?category=beauty-and-personal-care" },
  { label: "Footwear", href: "/shop?category=footwear" },
  { label: "Bags", href: "/shop?category=bags-and-luggage" },
  { label: "Offers", href: "/shop?filter=offers" },
] as const;

export const SHIPPING_METHODS = [
  { id: "standard", name: "Standard Delivery", price: 79, days: "2-4 business days" },
  { id: "express", name: "Express Delivery", price: 149, days: "1-2 business days" },
  { id: "pickup", name: "Store Pickup", price: 0, days: "Same day from shop" },
] as const;

export const PAYMENT_METHODS = [
  { id: "razorpay", name: "Pay Online (UPI / Card / Net Banking)", icon: "smartphone" },
  { id: "cod", name: "Cash on Delivery", icon: "banknote" },
  { id: "whatsapp", name: "Order via WhatsApp", icon: "message-circle" },
] as const;

export const KERALA_DISTRICTS = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
] as const;
