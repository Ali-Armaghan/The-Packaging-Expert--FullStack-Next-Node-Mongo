import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/mongoose";
import { serializeProduct } from "@/lib/product/serialize";
import { Product } from "@/models/Product";
import type { ProductCardItem, SerializedProduct } from "@/types/product";

function toCard(product: SerializedProduct): ProductCardItem {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    image: product.image,
  };
}

export async function getPublicProductBySlug(
  slug: string,
): Promise<SerializedProduct | null> {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return null;

  await connectToDatabase();
  const doc = await Product.findOne({ slug: normalized, isActive: true }).lean();
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
    // `.where().in()` avoids mongoose's strict `$in` ObjectId typing clash.
    const docs = await Product.find({ isActive: true })
      .where("_id")
      .in(picked)
      .lean();
    const byId = new Map(
      docs.map((doc) => {
        const item = toCard(serializeProduct(doc));
        return [item.id, item] as const;
      }),
    );
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
        .where("groupByIds")
        .in(groupIds)
        .sort({ sortOrder: 1, name: 1 })
        .limit(limit + results.length + 1)
        .lean();
      for (const doc of docs) {
        const item = toCard(serializeProduct(doc));
        if (seen.has(item.id)) continue;
        seen.add(item.id);
        results.push(item);
        if (results.length >= limit) break;
      }
    }
  }

  if (results.length < limit) {
    const docs = await Product.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .limit(limit + results.length + 1)
      .lean();
    for (const doc of docs) {
      const item = toCard(serializeProduct(doc));
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      results.push(item);
      if (results.length >= limit) break;
    }
  }

  return results.slice(0, limit);
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
