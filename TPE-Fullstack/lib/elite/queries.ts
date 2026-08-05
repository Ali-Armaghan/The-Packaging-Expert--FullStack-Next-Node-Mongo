import { ELITE_PAGE_DEFAULTS } from "@/lib/elite/defaults";
import type { ElitePageContent, EliteSectionKey } from "@/types/elitePage";

/**
 * Resolve a single elite section.
 * Swap the body for Mongo when CMS is wired — keep the same return shape.
 */
export async function getEliteSection<K extends EliteSectionKey>(
  section: K,
): Promise<ElitePageContent[K]> {
  // TODO: load from Mongo (ElitePage singleton), fall back to defaults
  return ELITE_PAGE_DEFAULTS[section];
}
