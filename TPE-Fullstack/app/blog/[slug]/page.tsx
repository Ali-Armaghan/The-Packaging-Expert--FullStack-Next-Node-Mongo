import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import {
  getPublishedPostBySlug,
  getPublishedSlugs,
} from "@/lib/blog/queries";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const ogImage = post.ogImage || post.featuredImage.url;
  const url = `${siteConfig.url}/blog/${post.slug}`;

  return {
    title,
    description,
    keywords: post.seoKeywords.length ? post.seoKeywords : undefined,
    alternates: {
      canonical: post.canonicalUrl || url,
    },
    robots: {
      index: post.robotsIndex,
      follow: post.robotsFollow,
    },
    openGraph: {
      type: "article",
      title: post.ogTitle || title,
      description: post.ogDescription || description,
      url,
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
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const safeHtml = DOMPurify.sanitize(post.content || "", {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["target", "rel"],
  });

  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <article className="bg-white py-10 sm:py-14">
      <Container className="max-w-3xl">
        <Link
          href="/blog"
          className="text-sm font-semibold text-primary hover:text-primary-dark"
        >
          ← Back to Blog
        </Link>

        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
          {post.categoryLabel}
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
          <span>{post.authorName || "Packaging Expert Team"}</span>
          {dateLabel && (
            <>
              <span aria-hidden="true">·</span>
              <time dateTime={post.publishedAt ?? undefined}>{dateLabel}</time>
            </>
          )}
        </div>

        {post.featuredImage.url && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        {post.excerpt && (
          <p className="mt-8 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {post.excerpt}
          </p>
        )}

        {safeHtml ? (
          <div
            className="prose prose-neutral mt-8 max-w-none prose-headings:scroll-mt-24 prose-a:text-primary prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
        ) : null}
      </Container>
    </article>
  );
}
