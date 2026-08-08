import { revalidatePath, revalidateTag } from "next/cache";
import { PRODUCT_INDEX_TAG, productTag } from "@/lib/cache/tags";

const IMMEDIATE = { expire: 0 } as const;

/** Invalidate product detail pages plus the shared product listing cache. */
export function revalidateProductSlugs(
  ...slugs: Array<string | null | undefined>
) {
  revalidateTag(PRODUCT_INDEX_TAG, IMMEDIATE);

  const unique = new Set(
    slugs.map((slug) => (slug ?? "").trim().toLowerCase()).filter(Boolean),
  );
  for (const slug of unique) {
    revalidateTag(productTag(slug), IMMEDIATE);
    revalidatePath(`/products/${slug}`);
  }
}
