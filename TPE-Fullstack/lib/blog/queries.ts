import { connectToDatabase } from "@/lib/db/mongoose";
import { BlogPost, type BlogCategoryId } from "@/models/BlogPost";
import {
  serializeBlogPost,
  toPublicCardPost,
  type SerializedBlogPost,
} from "@/lib/blog/serialize";
import type { BlogPost as PublicBlogPost } from "@/constants/blog";

function publishedFilter() {
  return { status: "published" as const };
}

export async function getPublishedPosts(): Promise<SerializedBlogPost[]> {
  await connectToDatabase();
  const docs = await BlogPost.find(publishedFilter())
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean();
  return docs.map(serializeBlogPost);
}

export async function getPublishedPostBySlug(
  slug: string,
): Promise<SerializedBlogPost | null> {
  await connectToDatabase();
  const doc = await BlogPost.findOne({
    ...publishedFilter(),
    slug: slug.toLowerCase(),
  }).lean();
  return doc ? serializeBlogPost(doc) : null;
}

export async function getPublishedSlugs(): Promise<string[]> {
  await connectToDatabase();
  const docs = await BlogPost.find(publishedFilter()).select("slug").lean();
  return docs.map((doc) => doc.slug);
}

export async function getPublicCardPosts(): Promise<PublicBlogPost[]> {
  const posts = await getPublishedPosts();
  return posts.map(toPublicCardPost);
}

export async function getFeaturedPublicPost(): Promise<PublicBlogPost | null> {
  await connectToDatabase();
  const featured = await BlogPost.findOne({
    ...publishedFilter(),
    featured: true,
  })
    .sort({ publishedAt: -1 })
    .lean();

  if (featured) return toPublicCardPost(serializeBlogPost(featured));

  const latest = await BlogPost.findOne(publishedFilter())
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean();

  return latest ? toPublicCardPost(serializeBlogPost(latest)) : null;
}

export async function getFeaturedSidebarPublicPosts(): Promise<
  PublicBlogPost[]
> {
  await connectToDatabase();
  const docs = await BlogPost.find({
    ...publishedFilter(),
    featuredSidebar: true,
  })
    .sort({ publishedAt: -1 })
    .limit(4)
    .lean();

  if (docs.length > 0) return docs.map((d) => toPublicCardPost(serializeBlogPost(d)));

  const fallback = await BlogPost.find({
    ...publishedFilter(),
    featured: { $ne: true },
  })
    .sort({ publishedAt: -1 })
    .limit(2)
    .lean();

  return fallback.map((d) => toPublicCardPost(serializeBlogPost(d)));
}

export async function getPublicPostsByCategory(
  category: BlogCategoryId,
): Promise<PublicBlogPost[]> {
  await connectToDatabase();
  const docs = await BlogPost.find({
    ...publishedFilter(),
    category,
  })
    .sort({ publishedAt: -1 })
    .limit(6)
    .lean();
  return docs.map((d) => toPublicCardPost(serializeBlogPost(d)));
}

export async function getBrowseAllPublicPosts(): Promise<PublicBlogPost[]> {
  await connectToDatabase();
  const docs = await BlogPost.find(publishedFilter())
    .sort({ publishedAt: -1 })
    .limit(9)
    .lean();
  return docs.map((d) => toPublicCardPost(serializeBlogPost(d)));
}
