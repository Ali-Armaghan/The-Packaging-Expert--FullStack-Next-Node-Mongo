import { getGroupByContentDefaults } from "@/lib/groupBy/defaults";
import type {
  GroupByCatalogMeta,
  GroupByCatalogTab,
  GroupByContent,
  SerializedGroupBy,
  SerializedGroupByListItem,
} from "@/types/groupBy";
import type { ElitePageContent } from "@/types/elitePage";

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function slugifyTabId(label: string, index: number) {
  const base = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `tab-${index + 1}`;
}

/** Accept new `{ id, label, productIds }` tabs and legacy `string[]` tabs. */
export function normalizeCatalogTabs(
  raw: unknown,
  defaults: GroupByCatalogTab[],
): GroupByCatalogTab[] {
  if (!Array.isArray(raw) || raw.length === 0) return defaults;

  const tabs = raw
    .map((entry, index) => {
      if (typeof entry === "string") {
        const label = entry.trim();
        if (!label) return null;
        return {
          id: slugifyTabId(label, index),
          label,
          productIds: [] as string[],
        };
      }

      if (!entry || typeof entry !== "object") return null;
      const tab = entry as Record<string, unknown>;
      const label =
        (typeof tab.label === "string" && tab.label.trim()) ||
        (typeof tab.name === "string" && tab.name.trim()) ||
        "";
      if (!label) return null;

      const id =
        (typeof tab.id === "string" && tab.id.trim()) ||
        slugifyTabId(label, index);

      const productIds = Array.isArray(tab.productIds)
        ? tab.productIds
            .filter((id): id is string => typeof id === "string")
            .map((id) => id.trim())
            .filter(Boolean)
        : [];

      return { id, label, productIds };
    })
    .filter((tab): tab is GroupByCatalogTab => Boolean(tab));

  return tabs.length > 0 ? tabs : defaults;
}

function normalizeCatalog(
  raw: unknown,
  defaults: GroupByCatalogMeta,
): GroupByCatalogMeta {
  const catalogRaw = asObject(raw);
  const { products: _ignored, tabs: rawTabs, ...rest } = catalogRaw;

  return {
    ...defaults,
    ...rest,
    eyebrow:
      typeof rest.eyebrow === "string" ? rest.eyebrow : defaults.eyebrow,
    title: typeof rest.title === "string" ? rest.title : defaults.title,
    description:
      typeof rest.description === "string"
        ? rest.description
        : defaults.description,
    viewAllHref:
      typeof rest.viewAllHref === "string"
        ? rest.viewAllHref
        : defaults.viewAllHref,
    viewAllLabel:
      typeof rest.viewAllLabel === "string"
        ? rest.viewAllLabel
        : defaults.viewAllLabel,
    tabs: normalizeCatalogTabs(rawTabs, defaults.tabs),
  };
}

/** Merge stored Mixed content with elite defaults (catalog without products). */
export function normalizeGroupByContent(
  raw: unknown,
  name?: string,
): GroupByContent {
  const defaults = getGroupByContentDefaults(name);
  const incoming = asObject(raw);

  return {
    hero: { ...defaults.hero, ...asObject(incoming.hero) } as ElitePageContent["hero"],
    catalog: normalizeCatalog(incoming.catalog, defaults.catalog),
    whyUs: { ...defaults.whyUs, ...asObject(incoming.whyUs) } as ElitePageContent["whyUs"],
    industries: {
      ...defaults.industries,
      ...asObject(incoming.industries),
    } as ElitePageContent["industries"],
    process: {
      ...defaults.process,
      ...asObject(incoming.process),
    } as ElitePageContent["process"],
    features: {
      ...defaults.features,
      ...asObject(incoming.features),
    } as ElitePageContent["features"],
    stats: { ...defaults.stats, ...asObject(incoming.stats) } as ElitePageContent["stats"],
    testimonials: {
      ...defaults.testimonials,
      ...asObject(incoming.testimonials),
    } as ElitePageContent["testimonials"],
    faq: { ...defaults.faq, ...asObject(incoming.faq) } as ElitePageContent["faq"],
    partners: {
      ...defaults.partners,
      ...asObject(incoming.partners),
    } as ElitePageContent["partners"],
  };
}

type LeanGroupBy = {
  _id: { toString(): string };
  name: string;
  slug: string;
  isActive?: boolean | null;
  sortOrder?: number | null;
  content?: unknown;
  createdAt?: Date;
  updatedAt?: Date;
};

export function serializeGroupByListItem(
  doc: LeanGroupBy,
): SerializedGroupByListItem {
  return {
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    isActive: doc.isActive ?? true,
    sortOrder: doc.sortOrder ?? 0,
    updatedAt: doc.updatedAt?.toISOString(),
  };
}

export function serializeGroupBy(doc: LeanGroupBy): SerializedGroupBy {
  return {
    ...serializeGroupByListItem(doc),
    content: normalizeGroupByContent(doc.content, doc.name),
    createdAt: doc.createdAt?.toISOString(),
  };
}
