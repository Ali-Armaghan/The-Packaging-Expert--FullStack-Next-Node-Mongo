import type { Metadata } from "next";
import {
  BlogBrowseAll,
  BlogCategorySection,
  BlogFeatured,
} from "@/components/blog";
import {
  getBrowseAllPublicPosts,
  getFeaturedPublicPost,
  getFeaturedSidebarPublicPosts,
  getPublicPostsByCategory,
} from "@/lib/blog/queries";
import type { BlogCategory } from "@/constants/blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Packaging insights, design tips, business strategies, and sustainability guides from the Packaging Expert team.",
};

const categories: BlogCategory[] = [
  "marketing",
  "business",
  "events",
  "customer-success",
  "sustainability",
];

export default async function BlogPage() {
  const [featured, sidebarPosts, browseAll, ...categoryPosts] =
    await Promise.all([
      getFeaturedPublicPost(),
      getFeaturedSidebarPublicPosts(),
      getBrowseAllPublicPosts(),
      ...categories.map((category) => getPublicPostsByCategory(category)),
    ]);

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
