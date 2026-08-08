import { unstable_cache } from "next/cache";
import { ISR_REVALIDATE_SECONDS } from "@/lib/cache/revalidate";
import { PRODUCT_INDEX_TAG, productTag } from "@/lib/cache/tags";
import {
  getActiveProductSlugs,
  getPublicProductBySlug,
  getRelatedProducts,
} from "@/lib/product/queries";
import type { ProductCardItem, SerializedProduct } from "@/types/product";

export function getCachedProductBySlug(
  slug: string,
): Promise<SerializedProduct | null> {
  const normalized = slug.trim().toLowerCase();
  return unstable_cache(
    async () => getPublicProductBySlug(normalized),
    ["product-by-slug-v5", normalized],
    {
      tags: [productTag(normalized), PRODUCT_INDEX_TAG],
      revalidate: ISR_REVALIDATE_SECONDS,
    },
  )();
}

export function getCachedRelatedProducts(
  product: SerializedProduct,
  limit = 5,
): Promise<ProductCardItem[]> {
  return unstable_cache(
    async () => getRelatedProducts(product, limit),
    ["product-related", product.slug, String(limit)],
    {
      tags: [productTag(product.slug), PRODUCT_INDEX_TAG],
      revalidate: ISR_REVALIDATE_SECONDS,
    },
  )();
}

/** Prebuild active products for ISR. */
export async function listProductSlugsForStaticParams(limit = 50) {
  try {
    return await getActiveProductSlugs(limit);
  } catch {
    return [];
  }
}
