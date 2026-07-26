import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { instagramHandle, instagramPosts } from "@/constants/instagram";

export function InstagramFeed() {
  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="text-center">
          <h2 className="section-heading">
            Follow us on Instagram
          </h2>
          <Link
            href="https://instagram.com/packingexpert"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-base font-semibold text-primary hover:text-primary-dark sm:text-lg"
          >
            {instagramHandle}
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {instagramPosts.map((post) => (
            <Link
              key={post.id}
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
            >
              <Image
                src={post.image}
                alt={post.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
