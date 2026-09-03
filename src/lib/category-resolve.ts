import type { Category } from "@/types";
import { categories as seedCategories } from "@/data/category-tree";

const LEGACY_SLUGS = new Set([
  "ladies",
  "gents",
  "children",
  "gas-kitchen",
  "single-burner",
  "double-burner",
  "home-stoves",
  "commercial-stoves",
  "gas-accessories",
  "spare-parts",
]);

const LEGACY_NAMES = new Set(["Ladies", "Gents", "Children", "Gas & Kitchen"]);

function isLegacyCategory(category: Category): boolean {
  return LEGACY_SLUGS.has(category.slug) || LEGACY_NAMES.has(category.name);
}

/**
 * Always keep the full marketplace category tree (parents + every sub-item).
 * Extra custom categories from admin are preserved if they are not legacy stubs.
 */
export function resolveMarketplaceCategories(
  serverCategories: Category[] | undefined | null
): Category[] {
  const extras = (serverCategories ?? []).filter((category) => {
    if (isLegacyCategory(category)) return false;
    const inSeed = seedCategories.some(
      (seed) => seed.slug === category.slug || seed.id === category.id
    );
    return !inSeed;
  });

  return [...seedCategories, ...extras].sort((a, b) => {
    if (!a.parentSlug && b.parentSlug) return -1;
    if (a.parentSlug && !b.parentSlug) return 1;
    if (a.parentSlug && b.parentSlug && a.parentSlug !== b.parentSlug) {
      return a.parentSlug.localeCompare(b.parentSlug);
    }
    return a.sortOrder - b.sortOrder;
  });
}

export function needsCategoryTreeUpgrade(
  serverCategories: Category[] | undefined | null
): boolean {
  const list = serverCategories ?? [];
  if (list.length < seedCategories.length) return true;
  return list.some(isLegacyCategory);
}
