import { unstable_cache } from "next/cache";
import { groupByTag } from "@/lib/cache/tags";
import {
  getActiveGroupByBySlug,
  getGroupBySection,
  listGroupBys,
} from "@/lib/groupBy/queries";
import type { GroupBySectionKey } from "@/types/groupBy";
import type { ElitePageContent } from "@/types/elitePage";

const REVALIDATE_SECONDS = 3600;

/** Prebuild candidates: active groups, lowest sortOrder first. */
export async function listActiveGroupBySlugsForStaticParams(limit = 30) {
  const items = await listGroupBys();
  return items
    .filter((item) => item.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
    .slice(0, limit)
    .map((item) => item.slug);
}

export function getCachedActiveGroupByBySlug(slug: string) {
  const normalized = slug.trim().toLowerCase();
  return unstable_cache(
    async () => getActiveGroupByBySlug(normalized),
    ["groupby-by-slug", normalized],
    {
      tags: [groupByTag(normalized)],
      revalidate: REVALIDATE_SECONDS,
    },
  )();
}

export function getCachedGroupBySection<K extends GroupBySectionKey>(
  slug: string,
  section: K,
): Promise<ElitePageContent[K] | null> {
  const normalized = slug.trim().toLowerCase();
  return unstable_cache(
    async () => getGroupBySection(normalized, section),
    ["groupby-section", normalized, section],
    {
      tags: [groupByTag(normalized)],
      revalidate: REVALIDATE_SECONDS,
    },
  )();
}
