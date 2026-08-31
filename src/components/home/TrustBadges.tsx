import { Truck, Shield, RotateCcw, Headphones } from "lucide-react";

const BADGES = [
  { icon: Truck, title: "Free Delivery", desc: "On orders above threshold" },
  { icon: Shield, title: "Secure Payments", desc: "100% protected checkout" },
  { icon: RotateCcw, title: "Easy Returns", desc: "7-day return policy" },
  { icon: Headphones, title: "24/7 Support", desc: "WhatsApp & email help" },
];

export function TrustBadges() {
  return (
    <section className="py-10 border-y border-cream-dark bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {BADGES.map((badge) => (
            <div key={badge.title} className="flex items-center gap-4">
              <div className="p-3 bg-burgundy/10 rounded-full flex-shrink-0">
                <badge.icon size={22} className="text-burgundy" />
              </div>
              <div>
                <p className="font-semibold text-charcoal text-sm">{badge.title}</p>
                <p className="text-xs text-charcoal/50">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
