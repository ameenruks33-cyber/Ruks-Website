/** Kerala PIN codes — sample zones for delivery charge calculation */
const KERALA_PIN_PREFIXES: Record<string, { district: string; charge: number }> = {
  "682": { district: "Ernakulam", charge: 49 },
  "683": { district: "Ernakulam / Thrissur", charge: 59 },
  "684": { district: "Alappuzha / Kottayam", charge: 69 },
  "685": { district: "Idukki / Kottayam", charge: 79 },
  "686": { district: "Kottayam / Pathanamthitta", charge: 79 },
  "687": { district: "Alappuzha", charge: 69 },
  "688": { district: "Alappuzha / Kollam", charge: 79 },
  "689": { district: "Pathanamthitta / Kollam", charge: 89 },
  "690": { district: "Kollam / Thiruvananthapuram", charge: 89 },
  "691": { district: "Thiruvananthapuram", charge: 99 },
  "695": { district: "Thiruvananthapuram", charge: 99 },
  "670": { district: "Kannur / Kasaragod", charge: 99 },
  "673": { district: "Kozhikode / Malappuram", charge: 89 },
  "676": { district: "Malappuram / Palakkad", charge: 89 },
  "678": { district: "Palakkad / Thrissur", charge: 79 },
  "679": { district: "Palakkad", charge: 89 },
};

export interface DeliveryCheckResult {
  available: boolean;
  district?: string;
  deliveryCharge: number;
  message: string;
}

export function checkPincodeDelivery(pincode: string): DeliveryCheckResult {
  const cleaned = pincode.replace(/\D/g, "");
  if (cleaned.length !== 6) {
    return {
      available: false,
      deliveryCharge: 0,
      message: "Enter a valid 6-digit PIN code",
    };
  }

  const prefix = cleaned.slice(0, 3);
  const zone = KERALA_PIN_PREFIXES[prefix];

  if (zone) {
    return {
      available: true,
      district: zone.district,
      deliveryCharge: zone.charge,
      message: `Home delivery available to ${zone.district} — ₹${zone.charge} delivery charge`,
    };
  }

  if (cleaned.startsWith("6")) {
    return {
      available: true,
      district: "Kerala (extended)",
      deliveryCharge: 129,
      message: "Delivery available with extended Kerala shipping — ₹129 charge",
    };
  }

  return {
    available: false,
    deliveryCharge: 0,
    message: "Sorry, we currently deliver only within Kerala. Store pickup is available.",
  };
}
