import { cache } from "react";
import { unstable_cache } from "next/cache";
import { ISR_REVALIDATE_SECONDS } from "@/lib/cache/revalidate";
import { PRODUCT_INFO_TABS_TAG } from "@/lib/cache/tags";
import { findContentItemBySlug, listContentItemSlugs } from "./queries";

export function getCachedContentItemBySlug(slug: string) {
  const normalized = slug.trim().toLowerCase();
  return unstable_cache(
    async () => findContentItemBySlug(normalized),
    ["content-item-v1", normalized],
    {
      tags: [PRODUCT_INFO_TABS_TAG],
      revalidate: ISR_REVALIDATE_SECONDS,
    },
  )();
}

export const getContentItemPage = cache(async (slug: string) =>
  getCachedContentItemBySlug(slug),
);

export async function listContentItemSlugsForStaticParams(limit = 80) {
  try {
    return await listContentItemSlugs(limit);
  } catch {
    return [];
  }
}
