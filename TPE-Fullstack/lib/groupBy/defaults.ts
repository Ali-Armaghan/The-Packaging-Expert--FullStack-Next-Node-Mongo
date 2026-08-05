import { ELITE_PAGE_DEFAULTS } from "@/lib/elite/defaults";
import type { GroupByContent } from "@/types/groupBy";

/** Seed content for a new Group By page (elite structure, empty product grid). */
export function getGroupByContentDefaults(
  name = "Packaging Expert",
): GroupByContent {
  const { products: _products, ...catalogMeta } = ELITE_PAGE_DEFAULTS.catalog;
  return {
    hero: {
      ...ELITE_PAGE_DEFAULTS.hero,
      brand: name,
      headline: `${name} packaging that builds brand identity`,
    },
    catalog: catalogMeta,
    whyUs: ELITE_PAGE_DEFAULTS.whyUs,
    industries: ELITE_PAGE_DEFAULTS.industries,
    process: ELITE_PAGE_DEFAULTS.process,
    features: ELITE_PAGE_DEFAULTS.features,
    stats: ELITE_PAGE_DEFAULTS.stats,
    testimonials: ELITE_PAGE_DEFAULTS.testimonials,
    faq: ELITE_PAGE_DEFAULTS.faq,
    partners: ELITE_PAGE_DEFAULTS.partners,
  };
}
