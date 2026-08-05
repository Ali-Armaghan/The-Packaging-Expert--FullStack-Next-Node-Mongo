import {
  deleteS3Urls,
  extractImageUrlsFromHtml,
} from "@/lib/s3";

type IndustryMedia = {
  icon?: string | null;
  attachedImages?: Array<string | null> | null;
  blogImageDetails?: Array<{ image?: string | null } | null> | null;
};

type BlogMedia = {
  featuredImage?: { url?: string | null } | null;
  ogImage?: string | null;
  twitterImage?: string | null;
  content?: string | null;
};

export function collectIndustryMediaUrls(doc: IndustryMedia) {
  const urls: string[] = [];
  if (doc.icon) urls.push(doc.icon);
  for (const url of doc.attachedImages ?? []) {
    if (url) urls.push(url);
  }
  for (const item of doc.blogImageDetails ?? []) {
    if (item?.image) urls.push(item.image);
  }
  return urls;
}

export function collectBlogMediaUrls(doc: BlogMedia) {
  const urls: string[] = [];
  if (doc.featuredImage?.url) urls.push(doc.featuredImage.url);
  if (doc.ogImage) urls.push(doc.ogImage);
  if (doc.twitterImage) urls.push(doc.twitterImage);
  urls.push(...extractImageUrlsFromHtml(doc.content));
  return urls;
}

/** Delete media that was removed between previous and next URL lists. */
export async function deleteRemovedMedia(
  previous: Array<string | null | undefined>,
  next: Array<string | null | undefined>,
) {
  const nextSet = new Set(
    next.map((url) => (url ?? "").trim()).filter(Boolean),
  );
  const removed = previous
    .map((url) => (url ?? "").trim())
    .filter((url) => url && !nextSet.has(url));

  if (!removed.length) return { deleted: [], skipped: [], failed: [] };
  return deleteS3Urls(removed);
}

export async function deleteAllMedia(urls: Array<string | null | undefined>) {
  return deleteS3Urls(urls);
}
