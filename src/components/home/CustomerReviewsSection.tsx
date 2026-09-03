"use client";

import { useMemo, useState } from "react";
import { Star, MessageSquare, Package } from "lucide-react";
import { reviews as seedReviews } from "@/data/store";
import { useReviewsStore } from "@/store/reviews-store";
import { useCatalogStore } from "@/store/catalog-store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type ReviewTab = "website" | "product";

interface DisplayReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  label: string;
  type: "website" | "product";
  createdAt: string;
}

export function CustomerReviewsSection() {
  const storeReviews = useReviewsStore((s) => s.reviews);
  const addWebsiteReview = useReviewsStore((s) => s.addWebsiteReview);
  const addReview = useReviewsStore((s) => s.addReview);
  const products = useCatalogStore((s) => s.products);

  const [tab, setTab] = useState<ReviewTab>("website");
  const [showForm, setShowForm] = useState(false);
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [productId, setProductId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const allReviews = useMemo<DisplayReview[]>(() => {
    const fromStore: DisplayReview[] = storeReviews.map((review) => ({
      id: review.id,
      author: review.author,
      rating: review.rating,
      comment: review.comment,
      label:
        review.type === "website" || !review.productId
          ? "NexCart X"
          : review.productName || "Product",
      type: review.type ?? (review.productId ? "product" : "website"),
      createdAt: review.createdAt,
    }));

    const fromSeed: DisplayReview[] = seedReviews.map((review) => ({
      id: review.id,
      author: review.author,
      rating: review.rating,
      comment: review.comment,
      label: review.productName,
      type: review.id.startsWith("rev-web")
        ? ("website" as const)
        : ("product" as const),
      createdAt: review.createdAt,
    }));

    return [...fromStore, ...fromSeed].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [storeReviews]);

  const websiteReviews = allReviews.filter((r) => r.type === "website");
  const productReviews = allReviews.filter((r) => r.type === "product");
  const displayed = tab === "website" ? websiteReviews : productReviews;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    if (tab === "website") {
      addWebsiteReview({
        author: author.trim(),
        rating,
        comment: comment.trim(),
      });
    } else {
      if (!productId) return;
      const product = products.find((p) => p.id === productId);
      if (!product) return;
      addReview({
        productId,
        productName: product.name,
        author: author.trim(),
        rating,
        comment: comment.trim(),
      });
    }

    setSubmitted(true);
    setShowForm(false);
    setAuthor("");
    setComment("");
    setRating(5);
    setProductId("");
  };

  return (
    <section className="py-16 lg:py-24 bg-cream-dark/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-charcoal mb-3">
            Customer Reviews
          </h2>
          <p className="text-charcoal/60 max-w-xl mx-auto">
            Share your experience with our store or a product you purchased
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <div className="inline-flex bg-white border border-cream-dark rounded-sm p-1">
            <button
              type="button"
              onClick={() => { setTab("website"); setShowForm(false); setSubmitted(false); }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm transition-colors ${
                tab === "website"
                  ? "bg-burgundy text-cream"
                  : "text-charcoal/70 hover:text-charcoal"
              }`}
            >
              <MessageSquare size={16} />
              Website ({websiteReviews.length})
            </button>
            <button
              type="button"
              onClick={() => { setTab("product"); setShowForm(false); setSubmitted(false); }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm transition-colors ${
                tab === "product"
                  ? "bg-burgundy text-cream"
                  : "text-charcoal/70 hover:text-charcoal"
              }`}
            >
              <Package size={16} />
              Products ({productReviews.length})
            </button>
          </div>

          <Button onClick={() => { setShowForm(true); setSubmitted(false); }}>
            Write a Review
          </Button>
        </div>

        {submitted && (
          <p className="text-center text-green-600 text-sm mb-6 bg-green-50 border border-green-200 rounded-sm py-3 px-4 max-w-lg mx-auto">
            Thank you! Your review has been posted.
          </p>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 border border-cream-dark rounded-sm mb-10 max-w-xl mx-auto space-y-4"
          >
            <p className="font-medium text-charcoal">
              {tab === "website"
                ? "Review NexCart X"
                : "Review a Product"}
            </p>

            <Input
              label="Your Name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />

            {tab === "product" && (
              <div>
                <label className="block text-sm font-medium mb-1.5">Product</label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-cream-dark rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                >
                  <option value="">Select a product</option>
                  {products
                    .filter((p) => p.isActive)
                    .map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    className="p-1"
                    aria-label={`Rate ${i + 1} stars`}
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
                placeholder={
                  tab === "website"
                    ? "How was your shopping experience with us?"
                    : "Tell others about this product..."
                }
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit">Submit Review</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {displayed.length === 0 ? (
          <div className="text-center py-12 bg-white border border-cream-dark rounded-sm">
            <p className="text-charcoal/50">
              No {tab === "website" ? "website" : "product"} reviews yet. Be the first to share!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.slice(0, 9).map((review) => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-sm shadow-sm border border-cream-dark/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-sm ${
                      review.type === "website"
                        ? "bg-burgundy/10 text-burgundy"
                        : "bg-gold/20 text-charcoal"
                    }`}
                  >
                    {review.type === "website" ? "Store Review" : "Product Review"}
                  </span>
                  <span className="text-xs text-charcoal/40">{review.createdAt}</span>
                </div>
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
                  <p className="text-xs text-charcoal/40">{review.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
