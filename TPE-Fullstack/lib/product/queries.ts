import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/mongoose";
import { serializeProduct } from "@/lib/product/serialize";
import { Product } from "@/models/Product";
import type { ProductCardItem, SerializedProduct } from "@/types/product";

/** Fields needed for related / catalog cards — avoids loading heavy `detail`. */
const CARD_SELECT = {
  name: 1,
  slug: 1,
  price: 1,
  image: 1,
  images: 1,
} as const;

function toCard(doc: {
  _id: { toString(): string };
  name: string;
  slug: string;
  price?: string | null;
  image?: string | null;
  images?: string[] | null;
}): ProductCardItem {
  return {
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    price: doc.price ?? "",
    image: doc.image || doc.images?.[0] || "",
  };
}

export async function getPublicProductBySlug(
  slug: string,
): Promise<SerializedProduct | null> {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return null;

  await connectToDatabase();
  const doc = await Product.findOne({ slug: normalized, isActive: true })
    .select({
      name: 1,
      slug: 1,
      description: 1,
      price: 1,
      image: 1,
      images: 1,
      groupByIds: 1,
      isActive: 1,
      sortOrder: 1,
      detail: 1,
    })
    .lean();
  return doc ? serializeProduct(doc) : null;
}

/** Explicit picks first, then same-group fallbacks, capped at `limit`. */
export async function getRelatedProducts(
  product: SerializedProduct,
  limit = 5,
): Promise<ProductCardItem[]> {
  await connectToDatabase();

  const picked = product.detail.relatedProductIds.filter((id) =>
    mongoose.Types.ObjectId.isValid(id),
  );

  const results: ProductCardItem[] = [];
  const seen = new Set<string>([product.id]);

  if (picked.length) {
    const docs = await Product.find({ isActive: true })
      .where("_id")
      .in(picked)
      .select(CARD_SELECT)
      .lean();
    const byId = new Map(docs.map((doc) => [String(doc._id), toCard(doc)]));
    for (const id of picked) {
      const item = byId.get(id);
      if (item && !seen.has(item.id)) {
        seen.add(item.id);
        results.push(item);
      }
    }
  }

  if (results.length < limit && product.groupByIds.length) {
    const groupIds = product.groupByIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id),
    );
    if (groupIds.length) {
      const docs = await Product.find({ isActive: true })
        .where("_id")
        .ne(product.id)
        .where("groupByIds")
        .in(groupIds)
        .select(CARD_SELECT)
        .sort({ sortOrder: 1, name: 1 })
        .limit(limit - results.length + 2)
        .lean();
      for (const doc of docs) {
        const item = toCard(doc);
        if (seen.has(item.id)) continue;
        seen.add(item.id);
        results.push(item);
        if (results.length >= limit) break;
      }
    }
  }

  if (results.length < limit) {
    const docs = await Product.find({ isActive: true })
      .where("_id")
      .ne(product.id)
      .select(CARD_SELECT)
      .sort({ sortOrder: 1, name: 1 })
      .limit(limit - results.length + 2)
      .lean();
    for (const doc of docs) {
      const item = toCard(doc);
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      results.push(item);
      if (results.length >= limit) break;
    }
  }

  return results.slice(0, limit);
}

/** Single DB round-trip bundle for the public product page. */
export async function getProductPageData(
  slug: string,
): Promise<{ product: SerializedProduct; related: ProductCardItem[] } | null> {
  const product = await getPublicProductBySlug(slug);
  if (!product) return null;
  const related = await getRelatedProducts(product, 5);
  return { product, related };
}

export async function getActiveProductSlugs(limit = 100): Promise<string[]> {
  await connectToDatabase();
  const docs = await Product.find({ isActive: true })
    .select({ slug: 1 })
    .sort({ sortOrder: 1, name: 1 })
    .limit(limit)
    .lean();
  return docs.map((doc) => doc.slug).filter(Boolean);
}
