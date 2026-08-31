"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <section className="bg-burgundy py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <Mail size={32} className="mx-auto text-gold mb-4" />
        <h2 className="font-display text-2xl font-bold text-cream mb-2">
          Get Exclusive Deals
        </h2>
        <p className="text-cream/70 text-sm mb-6">
          Subscribe for new arrivals, sales alerts &amp; fashion tips — like Flipkart &amp; Meesho deals!
        </p>
        {subscribed ? (
          <p className="text-gold font-medium">You&apos;re subscribed! Check your inbox soon.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white"
            />
            <Button type="submit" variant="secondary" className="whitespace-nowrap">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
