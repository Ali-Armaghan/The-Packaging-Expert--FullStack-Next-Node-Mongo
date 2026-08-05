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
import type { EliteCatalogContent, ElitePageContent } from "@/types/elitePage";

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

export async function getGroupBySection<K extends GroupBySectionKey>(
  slug: string,
  section: K,
): Promise<ElitePageContent[K] | null> {
  const group = await getActiveGroupByBySlug(slug);
  if (!group) return null;

  if (section === "catalog") {
    const products = await getCatalogProductsForGroup(group.id);
    const meta = group.content.catalog;
    return {
      ...meta,
      products,
    } as ElitePageContent[K];
  }

  return group.content[section] as ElitePageContent[K];
}

export async function getCatalogProductsForGroup(
  groupById: string,
): Promise<EliteCatalogContent["products"]> {
  await connectToDatabase();
  if (!mongoose.Types.ObjectId.isValid(groupById)) return [];

  const docs = await Product.find({
    groupByIds: new mongoose.Types.ObjectId(groupById),
    isActive: true,
  })
    .sort({ sortOrder: 1, name: 1 })
    .lean();

  return docs.map((doc) => {
    const price = "price" in doc && typeof doc.price === "string" ? doc.price : "";
    const image =
      ("image" in doc && typeof doc.image === "string" && doc.image) ||
      (Array.isArray(doc.images) && typeof doc.images[0] === "string"
        ? doc.images[0]
        : "") ||
      "";
    return {
      name: doc.name,
      price: price || "Quote",
      image,
      href: "/quote",
    };
  });
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
  // strip accidental products
  const { products: _p, ...catalog } = content.catalog as GroupByContent["catalog"] & {
    products?: unknown;
  };
  const doc = await GroupBy.create({
    name: input.name,
    slug: input.slug,
    isActive: input.isActive ?? true,
    sortOrder: input.sortOrder ?? 0,
    content: { ...content, catalog },
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
  const { products: _p, ...catalog } = nextContent.catalog as GroupByContent["catalog"] & {
    products?: unknown;
  };
  doc.set("content", { ...nextContent, catalog });
  await doc.save();
  return serializeGroupBy(doc.toObject());
}
