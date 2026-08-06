import mongoose from "mongoose";
import { revalidatePath, revalidateTag } from "next/cache";
import { connectToDatabase } from "@/lib/db/mongoose";
import { groupByTag } from "@/lib/cache/tags";
import { GroupBy } from "@/models/GroupBy";

/** Immediate expire so admin edits show on the next request. */
const IMMEDIATE = { expire: 0 } as const;

export function revalidateGroupBySlug(slug: string) {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return;
  revalidateTag(groupByTag(normalized), IMMEDIATE);
  revalidatePath(`/${normalized}`);
}

/** When a slug changes, invalidate both old and new paths/tags. */
export function revalidateGroupBySlugs(...slugs: Array<string | null | undefined>) {
  const unique = new Set(
    slugs.map((s) => (s ?? "").trim().toLowerCase()).filter(Boolean),
  );
  for (const slug of unique) {
    revalidateGroupBySlug(slug);
  }
}

export async function revalidateGroupBysByIds(
  ids: Array<string | { toString(): string } | null | undefined>,
) {
  const validIds = Array.from(
    new Set(
      ids
        .map((id) => (id == null ? "" : String(id)).trim())
        .filter((id) => mongoose.isValidObjectId(id)),
    ),
  );
  if (!validIds.length) return;

  await connectToDatabase();
  // `.where().in()` avoids mongoose's strict `$in` ObjectId typing clash.
  const docs = await GroupBy.find()
    .where("_id")
    .in(validIds)
    .select({ slug: 1 })
    .lean();
  revalidateGroupBySlugs(...docs.map((doc) => doc.slug));
}

/** Invalidate group pages that pick this product in catalog tabs. */
export async function revalidateGroupBysUsingProduct(
  productId: string | { toString(): string } | null | undefined,
) {
  const id = productId == null ? "" : String(productId).trim();
  if (!id || !mongoose.isValidObjectId(id)) return;

  await connectToDatabase();
  const docs = await GroupBy.find({
    "content.catalog.tabs.productIds": id,
  })
    .select({ slug: 1 })
    .lean();
  revalidateGroupBySlugs(...docs.map((doc) => doc.slug));
}
