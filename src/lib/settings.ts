export const CURRENCIES = [
  { code: "AED", name: "UAE Dirham", locale: "en-AE" },
  { code: "USD", name: "US Dollar", locale: "en-US" },
  { code: "EUR", name: "Euro", locale: "en-EU" },
  { code: "GBP", name: "British Pound", locale: "en-GB" },
  { code: "SAR", name: "Saudi Riyal", locale: "ar-SA" },
  { code: "PKR", name: "Pakistani Rupee", locale: "en-PK" },
  { code: "INR", name: "Indian Rupee", locale: "en-IN" },
  { code: "BDT", name: "Bangladeshi Taka", locale: "en-BD" },
  { code: "OMR", name: "Omani Rial", locale: "ar-OM" },
  { code: "QAR", name: "Qatari Riyal", locale: "ar-QA" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

export interface SiteSettings {
  storeName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  currency: CurrencyCode;
  locale: string;
  freeShippingThreshold: number;
  standardShippingPrice: number;
  expressShippingPrice: number;
  facebookUrl: string;
  instagramUrl: string;
  whatsappUrl: string;
  topBarMessage: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  storeName: "RukZa's Fashion Hub",
  tagline: "Style for Everyone",
  description:
    "Premium fashion marketplace for ladies, gents, and children. Abayas, hijabs, traditional wear, and more.",
  email: "hello@rukzasfashionhub.com",
  phone: "+971 XX XXX XXXX",
  address: "United Arab Emirates",
  currency: "AED",
  locale: "en-AE",
  freeShippingThreshold: 300,
  standardShippingPrice: 15,
  expressShippingPrice: 35,
  facebookUrl: "https://facebook.com/rukzasfashionhub",
  instagramUrl: "https://instagram.com/rukzasfashionhub",
  whatsappUrl: "https://wa.me/971XXXXXXXXX",
  topBarMessage: "Free shipping on orders over AED 300 | New arrivals every week",
};
