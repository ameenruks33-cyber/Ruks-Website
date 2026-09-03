"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import Link from "next/link";
import { useHomePanelsStore } from "@/store/home-panels-store";

export function DealsBar() {
  const dealsBar = useHomePanelsStore((s) => s.dealsBar);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const end = new Date(dealsBar.countdownEndsAt);

    const tick = () => {
      const diff = end.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ h: 0, m: 0, s: 0 });
        return;
      }
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [dealsBar.countdownEndsAt]);

  if (!dealsBar.enabled) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="bg-ink text-charcoal py-4 border-y border-burgundy/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Zap size={20} className="text-gold" />
          <div>
            <p className="font-semibold text-sm sm:text-base">{dealsBar.title}</p>
            <p className="text-charcoal/60 text-xs">{dealsBar.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 font-mono text-lg text-ink font-bold">
            <span className="bg-burgundy px-2 py-1 rounded-sm">{pad(timeLeft.h)}</span>
            <span className="text-burgundy">:</span>
            <span className="bg-burgundy px-2 py-1 rounded-sm">{pad(timeLeft.m)}</span>
            <span className="text-burgundy">:</span>
            <span className="bg-burgundy px-2 py-1 rounded-sm">{pad(timeLeft.s)}</span>
          </div>
          <Link
            href={dealsBar.buttonLink}
            className="bg-burgundy text-ink px-5 py-2 text-sm font-bold hover:bg-burgundy-dark transition-all btn-press whitespace-nowrap"
          >
            {dealsBar.buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
