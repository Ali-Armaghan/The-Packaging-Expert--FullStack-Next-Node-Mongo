import { ELITE_PAGE_DEFAULTS } from "@/lib/elite/defaults";
import type { GroupByCatalogMeta, GroupByContent } from "@/types/groupBy";

/** Seed content for a new Group By page (elite structure, empty product picks). */
export function getGroupByContentDefaults(
  name = "Packaging Expert",
): GroupByContent {
  const catalog: GroupByCatalogMeta = {
    eyebrow: ELITE_PAGE_DEFAULTS.catalog.eyebrow,
    title: ELITE_PAGE_DEFAULTS.catalog.title,
    description: ELITE_PAGE_DEFAULTS.catalog.description,
    viewAllHref: ELITE_PAGE_DEFAULTS.catalog.viewAllHref,
    viewAllLabel: ELITE_PAGE_DEFAULTS.catalog.viewAllLabel,
    tabs: ELITE_PAGE_DEFAULTS.catalog.tabs.map((tab) => ({
      id: tab.id,
      label: tab.label,
      productIds: [],
    })),
  };

  return {
    hero: {
      ...ELITE_PAGE_DEFAULTS.hero,
      brand: name,
      headline: `${name} packaging that builds brand identity`,
    },
    catalog,
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
