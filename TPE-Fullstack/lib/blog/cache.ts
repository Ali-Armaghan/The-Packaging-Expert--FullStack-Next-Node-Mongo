import { unstable_cache } from "next/cache";
import { ISR_REVALIDATE_SECONDS } from "@/lib/cache/revalidate";
import {
  BLOG_INDEX_TAG,
  BLOG_NAV_TAG,
  blogPostTag,
} from "@/lib/cache/tags";
import type { BlogCategory } from "@/constants/blog";
import type { BlogPost as PublicBlogPost } from "@/constants/blog";
import {
  getBrowseAllPublicPosts,
  getFeaturedPublicPost,
  getFeaturedSidebarPublicPosts,
  getPublishedPostBySlug,
  getPublishedSlugs,
  getPublicPostsByCategory,
  getRelatedPublicPosts,
} from "@/lib/blog/queries";
import type { SerializedBlogPost } from "@/lib/blog/serialize";
import { getPublicBlogHeaderNav } from "@/lib/nav/queries";
import type { BlogCategoryId } from "@/models/BlogPost";

const INDEX_CATEGORIES: BlogCategory[] = [
  "marketing",
  "business",
  "events",
  "customer-success",
  "sustainability",
];

export type BlogIndexData = {
  featured: PublicBlogPost | null;
  sidebarPosts: PublicBlogPost[];
  browseAll: PublicBlogPost[];
  categories: BlogCategory[];
  categoryPosts: PublicBlogPost[][];
};

export function getCachedBlogIndexData(): Promise<BlogIndexData> {
  return unstable_cache(
    async () => {
      const [featured, sidebarPosts, browseAll, ...categoryPosts] =
        await Promise.all([
          getFeaturedPublicPost(),
          getFeaturedSidebarPublicPosts(),
          getBrowseAllPublicPosts(),
          ...INDEX_CATEGORIES.map((category) =>
            getPublicPostsByCategory(category),
          ),
        ]);

      return {
        featured,
        sidebarPosts,
        browseAll,
        categories: INDEX_CATEGORIES,
        categoryPosts,
      };
    },
    ["blog-index-data"],
    {
      tags: [BLOG_INDEX_TAG],
      revalidate: ISR_REVALIDATE_SECONDS,
    },
  )();
}

export function getCachedPublishedPostBySlug(
  slug: string,
): Promise<SerializedBlogPost | null> {
  const normalized = slug.trim().toLowerCase();
  return unstable_cache(
    async () => getPublishedPostBySlug(normalized),
    ["blog-post-by-slug", normalized],
    {
      tags: [blogPostTag(normalized), BLOG_INDEX_TAG],
      revalidate: ISR_REVALIDATE_SECONDS,
    },
  )();
}

export function getCachedRelatedPublicPosts(
  category: BlogCategoryId,
  excludeSlug: string,
  limit = 3,
): Promise<PublicBlogPost[]> {
  const normalized = excludeSlug.trim().toLowerCase();
  return unstable_cache(
    async () => getRelatedPublicPosts(category, normalized, limit),
    ["blog-related", category, normalized, String(limit)],
    {
      tags: [blogPostTag(normalized), BLOG_INDEX_TAG],
      revalidate: ISR_REVALIDATE_SECONDS,
    },
  )();
}

export function getCachedPublicBlogHeaderNav() {
  return unstable_cache(
    async () => getPublicBlogHeaderNav(),
    ["blog-header-nav"],
    {
      tags: [BLOG_NAV_TAG],
      revalidate: ISR_REVALIDATE_SECONDS,
    },
  )();
}

/** Prebuild published posts for ISR (newest first). */
export async function listPublishedSlugsForStaticParams(limit = 50) {
  try {
    const slugs = await getPublishedSlugs();
    return slugs.slice(0, limit);
  } catch {
    return [];
  }
}
