import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { BlogPost } from "@/constants/blog";

type BlogFeaturedProps = {
  featured: BlogPost | null;
  sidebarPosts: BlogPost[];
};

export function BlogFeatured({ featured, sidebarPosts }: BlogFeaturedProps) {
  if (!featured) {
    return (
      <section className="bg-gradient-to-b from-[#f4faf7] to-white py-16">
        <Container>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
            Blog
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            Packaging insights
          </h1>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground">
            No published posts yet. Check back soon for design tips, business
            strategies, and sustainability guides.
          </p>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-[#f4faf7] to-white py-8 sm:py-10 lg:py-12">
      <Container>
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
            Blog
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Packaging insights
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Ideas and guides from the Packaging Expert team.
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-12">
          <article className="group overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/5">
            <Link href={`/blog/${featured.slug}`} className="block">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#dce8ef]">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
              </div>
            </Link>

            <div className="px-6 py-6 sm:px-8 sm:py-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1b4332]">
                Featured
              </p>

              <Link href={`/blog/${featured.slug}`}>
                <h2 className="mt-2.5 text-[1.35rem] font-bold leading-[1.25] tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-[1.5rem]">
                  {featured.title}
                </h2>
              </Link>

              <p className="mt-3 max-w-xl text-sm leading-[1.65] text-muted-foreground sm:text-[0.9375rem]">
                {featured.excerpt}
              </p>

              <div className="mt-6 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                <p>{featured.author}</p>
                <time dateTime={featured.date}>{featured.date}</time>
              </div>
            </div>
          </article>

          <aside className="lg:pt-1">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-[#1b4332] sm:text-xl">
                Featured Posts
              </h2>
              <Link
                href="/blog"
                className="shrink-0 text-sm font-bold text-[#1b4332] transition-colors hover:text-primary"
              >
                More Posts &gt;
              </Link>
            </div>

            {sidebarPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sidebar posts.</p>
            ) : (
              <ul className="space-y-5">
                {sidebarPosts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex gap-4 rounded-xl bg-white p-1 shadow-[0_1px_8px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
                    >
                      <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-lg bg-[#dce8ef] sm:h-[96px] sm:w-[96px]">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-center py-1 pr-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1b4332]">
                          {post.categoryLabel}
                        </p>
                        <h3 className="mt-1.5 line-clamp-3 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-[0.9375rem]">
                          {post.title}
                        </h3>
                        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                          {post.author}{" "}
                          <time dateTime={post.date}>{post.date}</time>
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </Container>
    </section>
  );
}
