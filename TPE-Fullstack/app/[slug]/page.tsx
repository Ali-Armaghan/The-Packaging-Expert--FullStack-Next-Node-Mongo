import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EliteLanding } from "@/components/elite/EliteLanding";
import { Button } from "@/components/ui/site-button";
import { Container } from "@/components/ui/Container";
import { ISR_REVALIDATE_SECONDS } from "@/lib/cache/revalidate";
import {
  getCachedActiveGroupByBySlug,
  listActiveGroupBySlugsForStaticParams,
} from "@/lib/groupBy/cache";
import { isReservedGroupSlug } from "@/lib/groupBy/reservedSlugs";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Fallback ISR window if on-demand revalidation is missed. */
export const revalidate = ISR_REVALIDATE_SECONDS;

/** Allow GroupBys created after build to be generated on first request. */
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const slugs = await listActiveGroupBySlugsForStaticParams(30);
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

function ComingSoon({ path }: { path: string }) {
  return (
    <section className="flex min-h-[calc(100dvh-8.5rem)] items-center bg-muted/40 py-16">
      <Container className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Coming soon
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          This page is under construction
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">{path}</span> isn&apos;t
          live yet. Browse our blog, get in touch, or head back home.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/" size="lg" className="w-full sm:w-auto">
            Back to home
          </Button>
          <Button
            href="/contact"
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            Contact us
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Looking for packaging help?{" "}
          <Link href="/blog" className="font-medium text-primary hover:underline">
            Read the blog
          </Link>
        </p>
      </Container>
    </section>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (isReservedGroupSlug(slug)) {
    return { title: "Not found" };
  }

  const group = await getCachedActiveGroupByBySlug(slug);
  if (group) {
    return {
      title: group.content.hero.brand || group.name,
      description: group.content.hero.description || group.name,
    };
  }

  return {
    title: "Coming soon",
    description: "This page is coming soon.",
  };
}

export default async function GroupByPage({ params }: PageProps) {
  const { slug } = await params;

  if (isReservedGroupSlug(slug)) {
    notFound();
  }

  const group = await getCachedActiveGroupByBySlug(slug);
  if (group) {
    return <EliteLanding hero={group.content.hero} slug={group.slug} />;
  }

  return <ComingSoon path={`/${slug}`} />;
}
