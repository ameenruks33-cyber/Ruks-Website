import { Star } from "lucide-react";
import type { Review } from "@/types";

interface ReviewsProps {
  reviews: Review[];
}

export function Reviews({ reviews }: ReviewsProps) {
  return (
    <section className="py-16 lg:py-24 bg-cream-dark/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-charcoal mb-3">
            What Our Customers Say
          </h2>
          <p className="text-charcoal/60">Trusted by thousands of happy shoppers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-sm shadow-sm border border-cream-dark/50"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < review.rating ? "fill-gold text-gold" : "text-cream-dark"}
                  />
                ))}
              </div>
              <p className="text-charcoal/80 text-sm leading-relaxed mb-4 line-clamp-4">
                &ldquo;{review.comment}&rdquo;
              </p>
              <div>
                <p className="font-medium text-charcoal text-sm">{review.author}</p>
                <p className="text-xs text-charcoal/40">{review.productName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
