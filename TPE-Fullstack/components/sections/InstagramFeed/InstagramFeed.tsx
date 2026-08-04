import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getActiveSectionItems } from "@/lib/home/items";
import type { HomeInstagramContent } from "@/types/homePage";

type InstagramFeedProps = {
  content: HomeInstagramContent;
};

export function InstagramFeed({ content }: InstagramFeedProps) {
  const posts = getActiveSectionItems(content.posts);
  const profileHref =
    content.profileUrl ||
    `https://instagram.com/${content.handle.replace(/^@/, "")}`;

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="text-center">
          <h2 className="section-heading">{content.title}</h2>
          <Link
            href={profileHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-base font-semibold text-primary hover:text-primary-dark sm:text-lg"
          >
            {content.handle}
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={post.href || profileHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
            >
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              ) : null}
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
