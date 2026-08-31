"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useReviewsStore } from "@/store/reviews-store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ProductReviewsProps {
  productId: string;
  productName: string;
  defaultRating?: number;
  defaultCount?: number;
}

export function ProductReviews({
  productId,
  productName,
  defaultRating = 0,
  defaultCount = 0,
}: ProductReviewsProps) {
  const { getProductReviews, getAverageRating, addReview } = useReviewsStore();
  const reviews = getProductReviews(productId);
  const avgRating = reviews.length > 0 ? getAverageRating(productId) : defaultRating;
  const reviewCount = reviews.length > 0 ? reviews.length : defaultCount;

  const [showForm, setShowForm] = useState(false);
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;
    addReview({ productId, author: author.trim(), rating, comment: comment.trim() });
    setSubmitted(true);
    setShowForm(false);
    setAuthor("");
    setComment("");
    setRating(5);
  };

  return (
    <section className="mt-16 border-t border-cream-dark pt-12">
      <h2 className="font-display text-2xl font-bold text-charcoal mb-2">Customer Reviews</h2>
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={18}
              className={i < Math.round(avgRating) ? "fill-gold text-gold" : "text-cream-dark"}
            />
          ))}
        </div>
        <span className="text-charcoal/60">
          {avgRating.toFixed(1)} out of 5 ({reviewCount} reviews)
        </span>
      </div>

      {!showForm && !submitted && (
        <Button variant="outline" onClick={() => setShowForm(true)} className="mb-8">
          Write a Review
        </Button>
      )}

      {submitted && (
        <p className="text-green-600 text-sm mb-6 bg-green-50 p-3 rounded-sm">
          Thank you! Your review has been posted.
        </p>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 border border-cream-dark rounded-sm mb-8 space-y-4 max-w-lg">
          <p className="font-medium text-sm">Reviewing: {productName}</p>
          <Input label="Your Name" value={author} onChange={(e) => setAuthor(e.target.value)} required />
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className="p-1"
                >
                  <Star
                    size={24}
                    className={i < rating ? "fill-gold text-gold" : "text-cream-dark"}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              required
              className="w-full px-4 py-3 border border-cream-dark rounded-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30"
              placeholder="Share your experience with this product..."
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit">Submit Review</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-5 border border-cream-dark rounded-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-charcoal">{review.author}</p>
              <span className="text-xs text-charcoal/40">{review.createdAt}</span>
            </div>
            <div className="flex gap-0.5 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={i < review.rating ? "fill-gold text-gold" : "text-cream-dark"}
                />
              ))}
            </div>
            <p className="text-charcoal/80 text-sm leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
