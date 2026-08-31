"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsState {
  reviews: ProductReview[];
  addReview: (review: Omit<ProductReview, "id" | "createdAt">) => void;
  getProductReviews: (productId: string) => ProductReview[];
  getAverageRating: (productId: string) => number;
}

export const useReviewsStore = create<ReviewsState>()(
  persist(
    (set, get) => ({
      reviews: [],

      addReview: (review) =>
        set((state) => ({
          reviews: [
            {
              ...review,
              id: `rev-${Date.now()}`,
              createdAt: new Date().toISOString().split("T")[0],
            },
            ...state.reviews,
          ],
        })),

      getProductReviews: (productId) =>
        get().reviews.filter((r) => r.productId === productId),

      getAverageRating: (productId) => {
        const productReviews = get().reviews.filter((r) => r.productId === productId);
        if (productReviews.length === 0) return 0;
        return productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length;
      },
    }),
    { name: "rukza-reviews" }
  )
);
