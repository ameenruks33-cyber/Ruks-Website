import { Truck, Shield, Flame, Headphones } from "lucide-react";

const BADGES = [
  { icon: Flame, title: "NL-GAS Brand", desc: "Own-brand quality gas stoves" },
  { icon: Truck, title: "Kerala Delivery", desc: "PIN-code based home delivery" },
  { icon: Shield, title: "ISI Certified", desc: "Safe regulators & hoses" },
  { icon: Headphones, title: "WhatsApp Support", desc: "Quick help on every order" },
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
