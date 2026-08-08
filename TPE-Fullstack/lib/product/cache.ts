import { cache } from "react";
import { unstable_cache } from "next/cache";
import { ISR_REVALIDATE_SECONDS } from "@/lib/cache/revalidate";
import { PRODUCT_INDEX_TAG, productTag } from "@/lib/cache/tags";
import {
  getActiveProductSlugs,
  getProductPageData,
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
    ["product-by-slug-v6", normalized],
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
    ["product-related-v2", product.slug, String(limit)],
    {
      tags: [productTag(product.slug), PRODUCT_INDEX_TAG],
      revalidate: ISR_REVALIDATE_SECONDS,
    },
  )();
}

/** Product + related in one cache entry (preferred for the public page). */
export function getCachedProductPageData(slug: string) {
  const normalized = slug.trim().toLowerCase();
  return unstable_cache(
    async () => getProductPageData(normalized),
    ["product-page-v1", normalized],
    {
      tags: [productTag(normalized), PRODUCT_INDEX_TAG],
      revalidate: ISR_REVALIDATE_SECONDS,
    },
  )();
}

/**
 * Per-request dedupe so generateMetadata + page share one cached fetch.
 */
export const getProductPage = cache(async (slug: string) =>
  getCachedProductPageData(slug),
);

/** Prebuild active products for ISR. */
export async function listProductSlugsForStaticParams(limit = 50) {
  try {
    return await getActiveProductSlugs(limit);
  } catch {
    return [];
  }
}
