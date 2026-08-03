import { blogCategories, type BlogCategory } from "@/constants/blog";

export function getCategoryLabel(
  category: string,
  override?: string | null,
): string {
  if (override?.trim()) return override.trim();
  return (
    blogCategories.find((item) => item.id === category)?.label ?? category
  );
}

export function serializeBlogPost(doc: {
  _id: { toString(): string };
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  featuredImage?: { url?: string | null; alt?: string | null } | null;
  category: string;
  categoryLabel?: string | null;
  tags?: string[] | null;
  authorName?: string | null;
  status?: string | null;
  featured?: boolean | null;
  featuredSidebar?: boolean | null;
  publishedAt?: Date | null;
  sortOrder?: number | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[] | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  robotsIndex?: boolean | null;
  robotsFollow?: boolean | null;
  focusKeyword?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt ?? "",
    content: doc.content ?? "",
    featuredImage: {
      url: doc.featuredImage?.url ?? "",
      alt: doc.featuredImage?.alt ?? "",
    },
    category: doc.category as BlogCategory,
    categoryLabel: getCategoryLabel(doc.category, doc.categoryLabel),
    tags: doc.tags ?? [],
    authorName: doc.authorName ?? "",
    status: (doc.status ?? "draft") as "draft" | "published",
    featured: Boolean(doc.featured),
    featuredSidebar: Boolean(doc.featuredSidebar),
    publishedAt: doc.publishedAt ? doc.publishedAt.toISOString() : null,
    sortOrder: doc.sortOrder ?? 0,
    seoTitle: doc.seoTitle ?? "",
    seoDescription: doc.seoDescription ?? "",
    seoKeywords: doc.seoKeywords ?? [],
    canonicalUrl: doc.canonicalUrl ?? "",
    ogImage: doc.ogImage ?? "",
    ogTitle: doc.ogTitle ?? "",
    ogDescription: doc.ogDescription ?? "",
    robotsIndex: doc.robotsIndex ?? true,
    robotsFollow: doc.robotsFollow ?? true,
    focusKeyword: doc.focusKeyword ?? "",
    createdAt: doc.createdAt?.toISOString?.() ?? undefined,
    updatedAt: doc.updatedAt?.toISOString?.() ?? undefined,
  };
}

export type SerializedBlogPost = ReturnType<typeof serializeBlogPost>;

/** Shape used by existing public blog card components */
export function toPublicCardPost(post: SerializedBlogPost) {
  const dateSource = post.publishedAt ?? post.createdAt ?? null;
  const date = dateSource
    ? new Date(dateSource).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    image: post.featuredImage.url || "/images/hero-packaging.png",
    category: post.category,
    categoryLabel: post.categoryLabel,
    date,
    author: post.authorName || "Packaging Expert Team",
    featured: post.featured,
    featuredSidebar: post.featuredSidebar,
  };
}
