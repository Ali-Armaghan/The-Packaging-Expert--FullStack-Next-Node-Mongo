import type { Metadata } from "next";
import { Suspense } from "react";
import {
  BlogBrowseAll,
  BlogCategorySection,
  BlogFeatured,
} from "@/components/blog";
import { BlogIndexSkeleton } from "@/components/blog/BlogIndexSkeleton";
import { getCachedBlogIndexData } from "@/lib/blog/cache";

/** Fallback ISR window if on-demand revalidation is missed (1 day). */
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Packaging insights, design tips, business strategies, and sustainability guides from the Packaging Expert team.",
};

async function BlogPageContent() {
  const { featured, sidebarPosts, browseAll, categories, categoryPosts } =
    await getCachedBlogIndexData();

  return (
    <>
      <BlogFeatured featured={featured} sidebarPosts={sidebarPosts} />
      {categories.map((category, index) => (
        <BlogCategorySection
          key={category}
          category={category}
          posts={categoryPosts[index] ?? []}
        />
      ))}
      <BlogBrowseAll posts={browseAll} />
    </>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogIndexSkeleton />}>
      <BlogPageContent />
    </Suspense>
  );
}
