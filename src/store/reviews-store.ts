"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReviewType = "product" | "website";

export interface StoreReview {
  id: string;
  type: ReviewType;
  productId?: string;
  productName?: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsState {
  reviews: StoreReview[];
  addReview: (review: Omit<StoreReview, "id" | "createdAt" | "type"> & { productId: string }) => void;
  addWebsiteReview: (review: Omit<StoreReview, "id" | "createdAt" | "type" | "productId" | "productName">) => void;
  getProductReviews: (productId: string) => StoreReview[];
  getWebsiteReviews: () => StoreReview[];
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
              type: "product",
              id: `rev-${Date.now()}`,
              createdAt: new Date().toISOString().split("T")[0],
            },
            ...state.reviews,
          ],
        })),

      addWebsiteReview: (review) =>
        set((state) => ({
          reviews: [
            {
              ...review,
              type: "website",
              id: `rev-web-${Date.now()}`,
              createdAt: new Date().toISOString().split("T")[0],
            },
            ...state.reviews,
          ],
        })),

      getProductReviews: (productId) =>
        get().reviews.filter(
          (r) =>
            r.productId === productId &&
            (r.type === "product" || r.type === undefined)
        ),

      getWebsiteReviews: () =>
        get().reviews.filter((r) => r.type === "website"),

      getAverageRating: (productId) => {
        const productReviews = get().reviews.filter(
          (r) => r.type === "product" && r.productId === productId
        );
        if (productReviews.length === 0) return 0;
        return productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length;
      },
    }),
    { name: "rukza-reviews" }
  )
);

export type ProductReview = StoreReview;
