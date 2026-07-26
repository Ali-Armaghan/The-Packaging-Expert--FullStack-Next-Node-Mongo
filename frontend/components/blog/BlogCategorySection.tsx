import Link from "next/link";
import { Container } from "@/components/ui/Container";
import {
  getCategorySectionTitle,
  getPostsByCategory,
  type BlogCategory,
} from "@/constants/blog";
import { BlogPostCard } from "./BlogPostCard";

type BlogCategorySectionProps = {
  category: BlogCategory;
};

export function BlogCategorySection({ category }: BlogCategorySectionProps) {
  const posts = getPostsByCategory(category).slice(0, 3);
  const title = getCategorySectionTitle(category);

  return (
    <section
      id={category}
      className="scroll-mt-24 bg-white pb-10 pt-4 sm:pb-12 sm:pt-6"
    >
      <Container>
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-[#1b4332] sm:text-xl">
            {title}
          </h2>
          <Link
            href={`/blog?category=${category}`}
            className="shrink-0 text-sm font-bold text-[#1b4332] transition-colors hover:text-primary"
          >
            More Posts &gt;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </section>
  );
}
