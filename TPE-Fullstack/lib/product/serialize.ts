import { getProductDetailDefaults } from "@/lib/product/defaults";
import type {
  ProductBanner,
  ProductDetailContent,
  ProductDimensionField,
  ProductFeatureSection,
  ProductHighlight,
  ProductHighlightIcon,
  ProductOptionGroup,
  ProductOrderProcess,
  ProductOrderProcessIcon,
  ProductOrderProcessStep,
  ProductSelector,
  ProductTab,
  SerializedProduct,
} from "@/types/product";

const HIGHLIGHT_ICONS: ProductHighlightIcon[] = [
  "globe",
  "box",
  "leaf",
  "shield",
  "clock",
];

const ORDER_ICONS: ProductOrderProcessIcon[] = [
  "customize",
  "quote",
  "consult",
  "shipping",
];

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function strList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((v): v is string => typeof v === "string" && v.trim() !== "")
    : [];
}

function slugifyId(label: string, index: number, prefix: string) {
  const base = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `${prefix}-${index + 1}`;
}

function normalizeGroups<T extends ProductSelector | ProductOptionGroup>(
  raw: unknown,
  fallback: T[],
  prefix: string,
): T[] {
  if (!Array.isArray(raw)) return fallback;

  const items = raw
    .map((entry, index) => {
      const row = asObject(entry);
      const label = str(row.label).trim();
      if (!label) return null;
      return {
        id: str(row.id).trim() || slugifyId(label, index, prefix),
        label,
        options: strList(row.options),
      } as T;
    })
    .filter((item): item is T => item !== null);

  return items;
}

function normalizeTabs(raw: unknown, fallback: ProductTab[]): ProductTab[] {
  if (!Array.isArray(raw)) return fallback;

  return raw
    .map((entry, index) => {
      const row = asObject(entry);
      const label = str(row.label).trim();
      if (!label) return null;
      return {
        id: str(row.id).trim() || slugifyId(label, index, "tab"),
        label,
        body: str(row.body),
      };
    })
    .filter((tab): tab is ProductTab => tab !== null);
}

function normalizeHighlights(
  raw: unknown,
  fallback: ProductHighlight[],
): ProductHighlight[] {
  if (!Array.isArray(raw)) return fallback;

  return raw
    .map((entry) => {
      const row = asObject(entry);
      const title = str(row.title).trim();
      if (!title) return null;
      const icon = str(row.icon) as ProductHighlightIcon;
      return {
        icon: HIGHLIGHT_ICONS.includes(icon) ? icon : "box",
        title,
        text: str(row.text),
      };
    })
    .filter((item): item is ProductHighlight => item !== null);
}

function normalizeBanner(raw: unknown, fallback: ProductBanner): ProductBanner {
  const row = asObject(raw);
  return {
    eyebrow: str(row.eyebrow, fallback.eyebrow),
    title: str(row.title, fallback.title),
    description: str(row.description, fallback.description),
    buttonLabel: str(row.buttonLabel, fallback.buttonLabel),
    buttonHref: str(row.buttonHref, fallback.buttonHref),
    image: str(row.image, fallback.image),
  };
}

function normalizeFeatureSections(
  raw: unknown,
  fallback: ProductFeatureSection[],
): ProductFeatureSection[] {
  if (!Array.isArray(raw)) return fallback;

  return raw
    .map((entry) => {
      const row = asObject(entry);
      const title = str(row.title).trim();
      if (!title) return null;
      return {
        title,
        description: str(row.description),
        linkLabel: str(row.linkLabel),
        linkHref: str(row.linkHref),
        image: str(row.image),
        imageSide: row.imageSide === "right" ? "right" : "left",
      } as ProductFeatureSection;
    })
    .filter((item): item is ProductFeatureSection => item !== null);
}

function normalizeDimensionFields(
  raw: unknown,
  fallback: ProductDimensionField[],
): ProductDimensionField[] {
  if (!Array.isArray(raw)) return fallback;

  const items = raw
    .map((entry, index) => {
      const row = asObject(entry);
      const label = str(row.label).trim();
      if (!label) return null;
      return {
        id: str(row.id).trim() || slugifyId(label, index, "dim"),
        label,
        required: row.required !== false,
      } as ProductDimensionField;
    })
    .filter((item): item is ProductDimensionField => item !== null);

  return items.length ? items : fallback;
}

function normalizeOrderProcess(
  raw: unknown,
  fallback: ProductOrderProcess,
): ProductOrderProcess {
  const row = asObject(raw);
  const stepsRaw = Array.isArray(row.steps) ? row.steps : null;

  const steps: ProductOrderProcessStep[] = stepsRaw
    ? stepsRaw
        .map((entry) => {
          const step = asObject(entry);
          const title = str(step.title).trim();
          if (!title) return null;
          const icon = str(step.icon) as ProductOrderProcessIcon;
          return {
            icon: ORDER_ICONS.includes(icon) ? icon : "customize",
            title,
            text: str(step.text),
          };
        })
        .filter((item): item is ProductOrderProcessStep => item !== null)
    : fallback.steps;

  return {
    title: str(row.title, fallback.title),
    description: str(row.description, fallback.description),
    steps: steps.length ? steps : fallback.steps,
  };
}

/** Merge stored Mixed detail with defaults so the page always renders. */
export function normalizeProductDetail(
  raw: unknown,
  name?: string,
): ProductDetailContent {
  const defaults = getProductDetailDefaults(name);
  const incoming = asObject(raw);

  return {
    sku: str(incoming.sku, defaults.sku),
    breadcrumbLabel: str(incoming.breadcrumbLabel, defaults.breadcrumbLabel),
    summary: str(incoming.summary, defaults.summary),
    gallery: strList(incoming.gallery),
    dimensionFields: normalizeDimensionFields(
      incoming.dimensionFields,
      defaults.dimensionFields,
    ),
    selectors: normalizeGroups<ProductSelector>(
      incoming.selectors,
      defaults.selectors,
      "selector",
    ),
    optionGroups: normalizeGroups<ProductOptionGroup>(
      incoming.optionGroups,
      defaults.optionGroups,
      "option",
    ),
    quantityOptions: Array.isArray(incoming.quantityOptions)
      ? strList(incoming.quantityOptions)
      : defaults.quantityOptions,
    ctaLabel: str(incoming.ctaLabel, defaults.ctaLabel),
    ctaHref: str(incoming.ctaHref, defaults.ctaHref),
    priceNoteLabel: str(incoming.priceNoteLabel, defaults.priceNoteLabel),
    priceNoteHref: str(incoming.priceNoteHref, defaults.priceNoteHref),
    tabs: normalizeTabs(incoming.tabs, defaults.tabs),
    orderProcess: normalizeOrderProcess(
      incoming.orderProcess,
      defaults.orderProcess,
    ),
    highlights: normalizeHighlights(incoming.highlights, defaults.highlights),
    banner: normalizeBanner(incoming.banner, defaults.banner),
    featureSections: normalizeFeatureSections(
      incoming.featureSections,
      defaults.featureSections,
    ),
    relatedTitle: str(incoming.relatedTitle, defaults.relatedTitle),
    relatedProductIds: strList(incoming.relatedProductIds),
  };
}

export function serializeProduct(doc: {
  _id: { toString(): string };
  name: string;
  slug: string;
  description?: string | null;
  price?: string | null;
  image?: string | null;
  images?: string[] | null;
  groupByIds?: { toString(): string }[] | null;
  isActive?: boolean | null;
  sortOrder?: number | null;
  detail?: unknown;
  createdAt?: Date;
  updatedAt?: Date;
}): SerializedProduct {
  return {
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    description: doc.description ?? "",
    price: doc.price ?? "",
    image: doc.image || doc.images?.[0] || "",
    images: (doc.images ?? []).filter(
      (url): url is string => typeof url === "string" && url.trim() !== "",
    ),
    groupByIds: (doc.groupByIds ?? []).map((id) => String(id)),
    isActive: doc.isActive ?? true,
    sortOrder: doc.sortOrder ?? 0,
    detail: normalizeProductDetail(doc.detail, doc.name),
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  };
}

/** Admin list / related pickers — skips normalizing heavy `detail`. */
export function serializeProductLite(doc: {
  _id: { toString(): string };
  name: string;
  slug: string;
  price?: string | null;
  image?: string | null;
  images?: string[] | null;
  groupByIds?: { toString(): string }[] | null;
  isActive?: boolean | null;
  sortOrder?: number | null;
}) {
  return {
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    price: doc.price ?? "",
    image: doc.image || doc.images?.[0] || "",
    groupByIds: (doc.groupByIds ?? []).map((id) => String(id)),
    isActive: doc.isActive ?? true,
    sortOrder: doc.sortOrder ?? 0,
  };
}

/** Prefer gallery images; fall back to primary image. */
export function resolveProductImages(
  gallery: string[] | undefined,
  primaryImage: string | undefined,
): { image: string; images: string[] } {
  const fromGallery = (gallery ?? []).filter((url) => url.trim() !== "");
  if (fromGallery.length) {
    return { image: primaryImage?.trim() || fromGallery[0]!, images: fromGallery };
  }
  const image = primaryImage?.trim() || "";
  return { image, images: image ? [image] : [] };
}
