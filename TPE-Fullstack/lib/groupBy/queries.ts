import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/mongoose";
import { getGroupByContentDefaults } from "@/lib/groupBy/defaults";
import {
  normalizeGroupByContent,
  serializeGroupBy,
  serializeGroupByListItem,
} from "@/lib/groupBy/serialize";
import { GROUP_BY_SECTIONS, GroupBy } from "@/models/GroupBy";
import { Product } from "@/models/Product";
import type { GroupByContent, GroupBySectionKey } from "@/types/groupBy";
import type {
  EliteCatalogContent,
  EliteCatalogProduct,
  ElitePageContent,
} from "@/types/elitePage";

export async function listGroupBys() {
  await connectToDatabase();
  const docs = await GroupBy.find({})
    .sort({ sortOrder: 1, name: 1 })
    .lean();
  return docs.map(serializeGroupByListItem);
}

export async function getGroupByById(id: string) {
  await connectToDatabase();
  const doc = await GroupBy.findById(id).lean();
  return doc ? serializeGroupBy(doc) : null;
}

export async function getActiveGroupByBySlug(slug: string) {
  await connectToDatabase();
  const doc = await GroupBy.findOne({
    slug: slug.toLowerCase(),
    isActive: true,
  }).lean();
  return doc ? serializeGroupBy(doc) : null;
}

function mapProductDoc(doc: {
  _id: { toString(): string };
  name: string;
  price?: string | null;
  image?: string | null;
  images?: string[] | null;
}): EliteCatalogProduct {
  const price = typeof doc.price === "string" ? doc.price : "";
  const image =
    (typeof doc.image === "string" && doc.image) ||
    (Array.isArray(doc.images) && typeof doc.images[0] === "string"
      ? doc.images[0]
      : "") ||
    "";
  return {
    id: String(doc._id),
    name: doc.name,
    price: price || "Quote",
    image,
    href: "/quote",
  };
}

export async function getProductsByIds(
  productIds: string[],
): Promise<Map<string, EliteCatalogProduct>> {
  await connectToDatabase();
  const validIds = productIds.filter((id) =>
    mongoose.Types.ObjectId.isValid(id),
  );
  if (validIds.length === 0) return new Map();

  const docs = await Product.find({
    _id: { $in: validIds.map((id) => new mongoose.Types.ObjectId(id)) },
    isActive: true,
  }).lean();

  const map = new Map<string, EliteCatalogProduct>();
  for (const doc of docs) {
    const product = mapProductDoc(doc);
    if (product.id) map.set(product.id, product);
  }
  return map;
}

export async function resolveCatalogContent(
  catalog: GroupByContent["catalog"],
): Promise<EliteCatalogContent> {
  const allIds = Array.from(
    new Set(catalog.tabs.flatMap((tab) => tab.productIds)),
  );
  const productMap = await getProductsByIds(allIds);

  return {
    eyebrow: catalog.eyebrow,
    title: catalog.title,
    description: catalog.description,
    viewAllHref: catalog.viewAllHref,
    viewAllLabel: catalog.viewAllLabel,
    tabs: catalog.tabs.map((tab) => ({
      id: tab.id,
      label: tab.label,
      products: tab.productIds
        .map((id) => productMap.get(id))
        .filter((product): product is EliteCatalogProduct => Boolean(product)),
    })),
  };
}

export async function getGroupBySection<K extends GroupBySectionKey>(
  slug: string,
  section: K,
): Promise<ElitePageContent[K] | null> {
  const group = await getActiveGroupByBySlug(slug);
  if (!group) return null;

  if (section === "catalog") {
    return (await resolveCatalogContent(
      group.content.catalog,
    )) as ElitePageContent[K];
  }

  return group.content[section] as ElitePageContent[K];
}

/** @deprecated Prefer tab productIds; kept for product→group revalidation helpers. */
export async function getCatalogProductsForGroup(
  groupById: string,
): Promise<EliteCatalogProduct[]> {
  await connectToDatabase();
  if (!mongoose.Types.ObjectId.isValid(groupById)) return [];

  const docs = await Product.find({
    groupByIds: new mongoose.Types.ObjectId(groupById),
    isActive: true,
  })
    .sort({ sortOrder: 1, name: 1 })
    .lean();

  return docs.map(mapProductDoc);
}

export function isGroupBySection(value: string): value is GroupBySectionKey {
  return (GROUP_BY_SECTIONS as readonly string[]).includes(value);
}

export async function createGroupByDoc(input: {
  name: string;
  slug: string;
  isActive?: boolean;
  sortOrder?: number;
  content?: Partial<GroupByContent>;
}) {
  await connectToDatabase();
  const base = getGroupByContentDefaults(input.name);
  const content = normalizeGroupByContent(
    { ...base, ...input.content },
    input.name,
  );
  const doc = await GroupBy.create({
    name: input.name,
    slug: input.slug,
    isActive: input.isActive ?? true,
    sortOrder: input.sortOrder ?? 0,
    content: {
      ...content,
      catalog: {
        ...content.catalog,
        tabs: content.catalog.tabs.map((tab) => ({
          id: tab.id,
          label: tab.label,
          productIds: tab.productIds,
        })),
      },
    },
  });
  return serializeGroupBy(doc.toObject());
}

export async function updateGroupBySection(
  id: string,
  section: GroupBySectionKey,
  data: unknown,
) {
  await connectToDatabase();
  const doc = await GroupBy.findById(id);
  if (!doc) return null;

  const current = normalizeGroupByContent(doc.content, doc.name);
  let nextSection = data;

  if (section === "catalog" && data && typeof data === "object") {
    const { products: _products, ...meta } = data as Record<string, unknown>;
    nextSection = meta;
  }

  const nextContent = normalizeGroupByContent(
    { ...current, [section]: nextSection },
    doc.name,
  );
  doc.set("content", nextContent);
  await doc.save();
  return serializeGroupBy(doc.toObject());
}
