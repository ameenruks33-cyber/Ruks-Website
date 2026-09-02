"use client";

import { create } from "zustand";
import type { MarketingPost, SocialConnections } from "@/types/marketing";
import { DEFAULT_SOCIAL_CONNECTIONS } from "@/types/marketing";
import { scheduleCatalogSync } from "@/lib/catalog-sync";

interface MarketingState {
  marketingPosts: MarketingPost[];
  socialConnections: SocialConnections;

  setMarketingData: (posts: MarketingPost[], connections?: SocialConnections) => void;
  addPost: (post: MarketingPost) => void;
  updatePost: (id: string, data: Partial<MarketingPost>) => void;
  deletePost: (id: string) => void;
  approvePost: (id: string) => void;
  schedulePost: (id: string, scheduledAt: string) => void;
  markPublished: (id: string) => void;
  markFailed: (id: string, error: string) => void;
  updateSocialConnections: (connections: Partial<SocialConnections>) => void;
  getPostById: (id: string) => MarketingPost | undefined;
}

export const useMarketingStore = create<MarketingState>()((set, get) => ({
  marketingPosts: [],
  socialConnections: DEFAULT_SOCIAL_CONNECTIONS,

  setMarketingData: (posts, connections) => {
    set({
      marketingPosts: posts,
      socialConnections: connections ?? get().socialConnections,
    });
  },

  addPost: (post) => {
    set((state) => ({
      marketingPosts: [post, ...state.marketingPosts],
    }));
    scheduleCatalogSync();
  },

  updatePost: (id, data) => {
    set((state) => ({
      marketingPosts: state.marketingPosts.map((p) =>
        p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
      ),
    }));
    scheduleCatalogSync();
  },

  deletePost: (id) => {
    set((state) => ({
      marketingPosts: state.marketingPosts.filter((p) => p.id !== id),
    }));
    scheduleCatalogSync();
  },

  approvePost: (id) => {
    get().updatePost(id, { status: "approved", publishError: undefined });
  },

  schedulePost: (id, scheduledAt) => {
    get().updatePost(id, { status: "scheduled", scheduledAt });
  },

  markPublished: (id) => {
    get().updatePost(id, {
      status: "published",
      publishedAt: new Date().toISOString(),
      publishError: undefined,
    });
  },

  markFailed: (id, error) => {
    get().updatePost(id, { status: "failed", publishError: error });
  },

  updateSocialConnections: (connections) => {
    set((state) => ({
      socialConnections: {
        instagram: { ...state.socialConnections.instagram, ...connections.instagram },
        whatsapp: { ...state.socialConnections.whatsapp, ...connections.whatsapp },
        facebook: { ...state.socialConnections.facebook, ...connections.facebook },
      },
    }));
    scheduleCatalogSync();
  },

  getPostById: (id) => get().marketingPosts.find((p) => p.id === id),
}));
