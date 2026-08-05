import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { sanitizeBlogHtml } from "@/lib/blog/sanitizeHtml";
import {
  getPublishedPostBySlug,
  getRelatedPublicPosts,
} from "@/lib/blog/queries";
import { estimateReadingMinutes } from "@/lib/blog/seoScore";
import { isHttpUrl, safeAbsoluteUrl } from "@/lib/url";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await getPublishedPostBySlug(slug);

    if (!post) {
      return { title: "Post Not Found" };
    }

    const title = post.seoTitle || post.title;
    const description = post.seoDescription || post.excerpt;
    const pageUrl = `${siteConfig.url}/blog/${post.slug}`;
    const canonical = safeAbsoluteUrl(post.canonicalUrl, pageUrl);
    const ogImage = safeAbsoluteUrl(
      post.ogImage || post.featuredImage.url,
      "",
    );

    return {
      title,
      description,
      keywords: post.seoKeywords.length ? post.seoKeywords : undefined,
      alternates: {
        canonical,
      },
      robots: {
        index: post.robotsIndex,
        follow: post.robotsFollow,
      },
      openGraph: {
        type: "article",
        title: post.ogTitle || title,
        description: post.ogDescription || description,
        url: pageUrl,
        images: ogImage
          ? [
              {
                url: ogImage,
                alt: post.featuredImage.alt || post.title,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: post.ogTitle || title,
        description: post.ogDescription || description,
        images: ogImage ? [ogImage] : undefined,
      },
    };
  } catch {
    return { title: "Blog" };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  let post;
  try {
    post = await getPublishedPostBySlug(slug);
  } catch {
    throw new Error("Unable to load this blog post right now.");
  }

  if (!post) {
    notFound();
  }

  let related: Awaited<ReturnType<typeof getRelatedPublicPosts>> = [];
  try {
    related = await getRelatedPublicPosts(post.category, post.slug, 3);
  } catch {
    related = [];
  }

  const safeHtml = await sanitizeBlogHtml(post.content || "");

  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const readingMins = estimateReadingMinutes(post.content);
  const shareUrl = `${siteConfig.url}/blog/${post.slug}`;
  const featuredUrl = post.featuredImage.url;
  const canShowImage = isHttpUrl(featuredUrl);

  return (
    <article className="bg-gradient-to-b from-[#f4faf7] via-white to-white py-10 sm:py-14">
      <Container className="max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          ← Back to Blog
        </Link>

        <header className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
            {post.categoryLabel}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span>{post.authorName || "Packaging Expert Team"}</span>
            {dateLabel && (
              <>
                <span aria-hidden="true">·</span>
                <time dateTime={post.publishedAt ?? undefined}>{dateLabel}</time>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{readingMins} min read</span>
          </div>
        </header>

        {canShowImage ? (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-muted shadow-sm ring-1 ring-black/5">
            <Image
              src={featuredUrl}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        ) : null}

        {post.excerpt && (
          <p className="mt-8 border-l-4 border-primary/40 pl-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {post.excerpt}
          </p>
        )}

        {safeHtml ? (
          <div
            className="prose prose-neutral mt-10 max-w-none prose-headings:scroll-mt-24 prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl prose-blockquote:border-primary/40"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
        ) : null}

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#e8f6ef] px-3 py-1 text-xs font-medium text-[#1a6b45]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-white/80 px-4 py-3 text-sm">
          <p className="text-muted-foreground">Share this article</p>
          <div className="flex gap-3">
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-primary"
            >
              X / Twitter
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-primary"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </Container>

      {related.length > 0 && (
        <Container className="mt-14 max-w-6xl">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                Keep reading
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                Related articles
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-sm font-semibold text-primary hover:text-primary-dark"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <BlogPostCard key={item.slug} post={item} />
            ))}
          </div>
        </Container>
      )}
    </article>
  );
}
