"use client";

import { Camera } from "lucide-react";
import Image from "next/image";
import { useSettingsStore } from "@/store/settings-store";

const INSTAGRAM_IMAGES = [
  "https://images.unsplash.com/photo-1483985988354-763728e36855?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=400&fit=crop",
];

export function InstagramSection() {
  const instagramUrl = useSettingsStore((s) => s.instagramUrl);
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-burgundy mb-3">
            <Camera size={20} />
            <span className="text-sm font-semibold tracking-wider uppercase">
              @rukzasfashionhub
            </span>
          </div>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-charcoal mb-3">
            Follow Us on Instagram
          </h2>
          <p className="text-charcoal/60">
            Get inspired by our latest styles and customer looks
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 lg:gap-3">
          {INSTAGRAM_IMAGES.map((src, i) => (
            <a
              key={i}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square overflow-hidden rounded-sm group"
            >
              <Image
                src={src}
                alt={`Instagram post ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 33vw, 16vw"
              />
              <div className="absolute inset-0 bg-burgundy/0 group-hover:bg-burgundy/30 transition-colors flex items-center justify-center">
                <Camera
                  size={24}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
