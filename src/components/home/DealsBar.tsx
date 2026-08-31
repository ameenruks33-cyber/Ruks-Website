"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import Link from "next/link";
import { useSettingsStore } from "@/store/settings-store";

export function DealsBar() {
  const formatPrice = useSettingsStore((s) => s.formatPrice);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const tick = () => {
      const diff = end.getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="bg-charcoal text-cream py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Zap size={20} className="text-gold" />
          <div>
            <p className="font-semibold text-sm sm:text-base">Today&apos;s Deals — Ends in</p>
            <p className="text-cream/60 text-xs">Up to 40% off + free shipping over {formatPrice(300)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 font-mono text-lg">
            <span className="bg-burgundy px-2 py-1 rounded-sm">{pad(timeLeft.h)}</span>
            <span>:</span>
            <span className="bg-burgundy px-2 py-1 rounded-sm">{pad(timeLeft.m)}</span>
            <span>:</span>
            <span className="bg-burgundy px-2 py-1 rounded-sm">{pad(timeLeft.s)}</span>
          </div>
          <Link
            href="/shop?filter=offers"
            className="bg-gold text-charcoal px-5 py-2 text-sm font-semibold hover:bg-gold-light transition-colors whitespace-nowrap"
          >
            Shop Deals
          </Link>
        </div>
      </div>
    </section>
  );
}
