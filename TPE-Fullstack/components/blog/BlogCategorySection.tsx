import Link from "next/link";
import { Container } from "@/components/ui/Container";
import {
  getCategorySectionTitle,
  type BlogCategory,
  type BlogPost,
} from "@/constants/blog";
import { BlogPostCard } from "./BlogPostCard";

type BlogCategorySectionProps = {
  category: BlogCategory;
  posts: BlogPost[];
};

export function BlogCategorySection({
  category,
  posts,
}: BlogCategorySectionProps) {
  const title = getCategorySectionTitle(category);
  const visible = posts.slice(0, 3);

  if (visible.length === 0) return null;

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
          {visible.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </section>
  );
}
