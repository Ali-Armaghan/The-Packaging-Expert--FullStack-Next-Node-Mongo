"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/site-button";
import { Container } from "@/components/ui/Container";

export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Blog post error:", error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] items-center py-16">
      <Container className="max-w-lg text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Couldn&apos;t load this article
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Something went wrong while opening this post. Try again, or go back to
          the blog.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <Button href="/blog" variant="outline">
            Back to blog
          </Button>
        </div>
        <p className="mt-4 text-sm">
          <Link href="/" className="text-primary hover:underline">
            Home
          </Link>
        </p>
      </Container>
    </section>
  );
}
