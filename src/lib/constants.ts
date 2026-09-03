export const SITE = {
  name: "NL Gas & Kitchen",
  tagline: "Quality Gas Stoves. Genuine Parts. Kerala Delivery.",
  description:
    "NL-GAS gas stoves — single burner, double burner, home and commercial restaurant stoves. Regulators, hoses, spare parts and repair service across Kerala.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  email: "info@nlgas.in",
  phone: "+91 98765 43210",
  social: {
    facebook: "https://facebook.com/nlgas",
    instagram: "https://instagram.com/nlgas",
    whatsapp: "https://wa.me/919876543210",
  },
} as const;

export const NAV_LINKS = [
  { label: "Single Burner", href: "/shop?category=single-burner" },
  { label: "Double Burner", href: "/shop?category=double-burner" },
  { label: "Home Stoves", href: "/shop?category=home-stoves" },
  { label: "Commercial", href: "/shop?category=commercial-stoves" },
  { label: "Accessories", href: "/shop?category=gas-accessories" },
  { label: "Spare Parts", href: "/shop?category=spare-parts" },
  { label: "Repair Service", href: "/repair" },
  { label: "Offers", href: "/shop?filter=offers" },
] as const;

export const SHIPPING_METHODS = [
  { id: "standard", name: "Kerala Home Delivery", price: 79, days: "2-4 business days" },
  { id: "express", name: "Express Delivery", price: 149, days: "1-2 business days" },
  { id: "pickup", name: "Store Pickup", price: 0, days: "Same day from shop" },
] as const;

export const PAYMENT_METHODS = [
  { id: "razorpay", name: "Pay Online (UPI / Card / Net Banking)", icon: "smartphone" },
  { id: "cod", name: "Cash on Delivery", icon: "banknote" },
  { id: "whatsapp", name: "Order via WhatsApp", icon: "message-circle" },
] as const;

export const REPAIR_PRODUCT_TYPES = [
  "Gas Stove",
  "Commercial Burner",
  "LPG Regulator",
  "Gas Hose / Pipe",
  "Other Gas Equipment",
] as const;

export const REPAIR_PROBLEMS = [
  "Not working",
  "Gas leakage",
  "Low flame",
  "Ignition problem",
  "Burner clogged",
  "Regulator issue",
  "Noise / vibration",
  "Other",
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
