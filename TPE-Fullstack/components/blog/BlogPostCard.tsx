import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/constants/blog";

type BlogPostCardProps = {
  post: BlogPost;
};

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#dce8ef]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
          {post.categoryLabel}
        </p>

        <Link href={`/blog/${post.slug}`}>
          <h3 className="mt-2 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-[1.05rem]">
            {post.title}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs">
          <Link
            href={`/blog/${post.slug}`}
            className="font-semibold text-foreground transition-colors hover:text-primary"
          >
            Read More
          </Link>
          <time dateTime={post.date} className="text-muted-foreground">
            {post.date}
          </time>
        </div>
      </div>
    </article>
  );
}
