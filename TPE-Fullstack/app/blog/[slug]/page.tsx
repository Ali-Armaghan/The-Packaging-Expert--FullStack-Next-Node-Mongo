import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { blogPosts } from "@/constants/blog";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

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
          <span>{post.author}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.date}>{post.date}</time>
        </div>
        <p className="mt-8 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {post.excerpt}
        </p>
      </Container>
    </article>
  );
}
