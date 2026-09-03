export const CURRENCIES = [
  { code: "INR", name: "Indian Rupee", locale: "en-IN" },
  { code: "AED", name: "UAE Dirham", locale: "en-AE" },
  { code: "USD", name: "US Dollar", locale: "en-US" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

export interface SiteSettings {
  storeName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  gstin: string;
  currency: CurrencyCode;
  locale: string;
  freeShippingThreshold: number;
  standardShippingPrice: number;
  expressShippingPrice: number;
  facebookUrl: string;
  instagramUrl: string;
  whatsappUrl: string;
  topBarMessage: string;
  googleMapsEmbedUrl: string;
  storeLatitude: number;
  storeLongitude: number;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  storeName: "NexCart X",
  tagline: "Shop the next look",
  description:
    "Discover fashion, lifestyle and everyday essentials — women, men, kids, jewellery, beauty, footwear and more.",
  email: "hello@nexcartx.store",
  phone: "+91 98765 43210",
  address: "Main Road, Ernakulam, Kerala 682001, India",
  district: "Ernakulam",
  gstin: "32XXXXX0000X1Z5",
  currency: "INR",
  locale: "en-IN",
  freeShippingThreshold: 999,
  standardShippingPrice: 79,
  expressShippingPrice: 149,
  facebookUrl: "https://facebook.com/",
  instagramUrl: "https://instagram.com/",
  whatsappUrl: "https://wa.me/919876543210",
  topBarMessage: "Free delivery over ₹999 · New season styles just dropped",
  googleMapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.838947837!2d76.2673!3d9.9312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwNTUnNTIuMyJOIDc2wrAxNicwMi4zIkU!5e0!3m2!1sen!2sin!4v1700000000000",
  storeLatitude: 9.9312,
  storeLongitude: 76.2673,
};
