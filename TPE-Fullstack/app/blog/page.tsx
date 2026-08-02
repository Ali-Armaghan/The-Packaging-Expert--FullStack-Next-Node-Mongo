import type { Metadata } from "next";
import {
  BlogBrowseAll,
  BlogCategorySection,
  BlogFeatured,
} from "@/components/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Packaging insights, design tips, business strategies, and sustainability guides from the Packaging Expert team.",
};

export default function BlogPage() {
  return (
    <>
      <BlogFeatured />
      <BlogCategorySection category="marketing" />
      <BlogCategorySection category="business" />
      <BlogCategorySection category="events" />
      <BlogCategorySection category="customer-success" />
      <BlogCategorySection category="sustainability" />
      <BlogBrowseAll />
    </>
  );
}
