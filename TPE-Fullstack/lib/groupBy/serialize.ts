import { getGroupByContentDefaults } from "@/lib/groupBy/defaults";
import type {
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

/** Merge stored Mixed content with elite defaults (catalog without products). */
export function normalizeGroupByContent(
  raw: unknown,
  name?: string,
): GroupByContent {
  const defaults = getGroupByContentDefaults(name);
  const incoming = asObject(raw);

  const catalogRaw = asObject(incoming.catalog);
  const { products: _ignored, ...catalogFromRaw } = catalogRaw;

  return {
    hero: { ...defaults.hero, ...asObject(incoming.hero) } as ElitePageContent["hero"],
    catalog: {
      ...defaults.catalog,
      ...catalogFromRaw,
    } as GroupByContent["catalog"],
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
