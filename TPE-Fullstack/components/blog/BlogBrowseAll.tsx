import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { BlogPost } from "@/constants/blog";

type BlogBrowseAllProps = {
  posts: BlogPost[];
};

export function BlogBrowseAll({ posts }: BlogBrowseAllProps) {
  if (posts.length === 0) return null;

  return (
    <section className="bg-white py-10 sm:py-12">
      <Container>
        <h2 className="mb-8 text-xl font-bold text-foreground sm:text-[1.35rem]">
          Browse All
        </h2>

        <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex items-start gap-4"
            >
              <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-md bg-[#dce8ef]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              </div>
              <div className="min-w-0 pt-0.5">
                <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
                <time
                  dateTime={post.date}
                  className="mt-1.5 block text-xs text-muted-foreground"
                >
                  {post.date}
                </time>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
