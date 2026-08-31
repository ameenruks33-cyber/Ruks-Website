import Link from "next/link";
import { Store, TrendingUp, Users, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const BENEFITS = [
  { icon: Users, title: "Millions of Shoppers", desc: "Reach customers looking for fashion & lifestyle products" },
  { icon: TrendingUp, title: "Grow Your Business", desc: "Low commission, fast payouts, seller dashboard" },
  { icon: Shield, title: "Secure Platform", desc: "Protected payments and verified buyer network" },
  { icon: Store, title: "Easy Setup", desc: "List products in minutes — no tech skills needed" },
];

const STEPS = [
  "Register as a seller",
  "Upload your products & photos",
  "Set your prices & inventory",
  "Start selling & get paid",
];

export default function SellPage() {
  return (
    <div>
      <section className="bg-burgundy text-cream py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Store size={48} className="mx-auto text-gold mb-6" />
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">
            Sell on RukZa&apos;s Fashion Hub
          </h1>
          <p className="text-cream/80 text-lg mb-8 max-w-2xl mx-auto">
            Join our marketplace like Amazon, Flipkart &amp; Meesho. Start your online business
            and reach customers across the region.
          </p>
          <Link href="/account/register">
            <Button variant="secondary" size="lg">
              Start Selling Free
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center text-charcoal mb-12">
            Why Sell With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {BENEFITS.map((b) => (
              <div key={b.title} className="text-center p-6">
                <div className="w-14 h-14 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <b.icon size={24} className="text-burgundy" />
                </div>
                <h3 className="font-semibold text-charcoal mb-2">{b.title}</h3>
                <p className="text-sm text-charcoal/60">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-dark/30 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center text-charcoal mb-10">
            How It Works
          </h2>
          <div className="space-y-4">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-4 bg-white p-5 rounded-sm border border-cream-dark">
                <span className="w-10 h-10 bg-burgundy text-cream rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <p className="font-medium text-charcoal">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 text-center px-4">
        <h2 className="font-display text-2xl font-bold text-charcoal mb-4">Ready to start?</h2>
        <p className="text-charcoal/60 mb-6">Contact us on WhatsApp or register to become a seller.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/account/register"><Button size="lg">Register as Seller</Button></Link>
          <Link href="/contact"><Button variant="outline" size="lg">Contact Us</Button></Link>
        </div>
      </section>
    </div>
  );
}
