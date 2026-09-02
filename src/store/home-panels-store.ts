"use client";

import { create } from "zustand";
import {
  DEFAULT_HOME_PANELS,
  normalizeHomePanels,
  type HomePanelsConfig,
} from "@/lib/home-panels";
import { scheduleCatalogSync } from "@/lib/catalog-sync";

interface HomePanelsState extends HomePanelsConfig {
  updateDealsBar: (partial: Partial<HomePanelsConfig["dealsBar"]>) => void;
  updatePromoBanner: (partial: Partial<HomePanelsConfig["promoBanner"]>) => void;
  updateNewsletter: (partial: Partial<HomePanelsConfig["newsletter"]>) => void;
  setHomePanels: (panels: HomePanelsConfig) => void;
  resetHomePanels: () => void;
}

export const useHomePanelsStore = create<HomePanelsState>()((set) => ({
  ...DEFAULT_HOME_PANELS,

  updateDealsBar: (partial) => {
    set((state) => ({
      dealsBar: { ...state.dealsBar, ...partial },
    }));
    scheduleCatalogSync();
  },

  updatePromoBanner: (partial) => {
    set((state) => ({
      promoBanner: { ...state.promoBanner, ...partial },
    }));
    scheduleCatalogSync();
  },

  updateNewsletter: (partial) => {
    set((state) => ({
      newsletter: { ...state.newsletter, ...partial },
    }));
    scheduleCatalogSync();
  },

  setHomePanels: (panels) => {
    set(normalizeHomePanels(panels));
  },

  resetHomePanels: () => {
    set({ ...DEFAULT_HOME_PANELS });
    scheduleCatalogSync();
  },
}));
