import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getActiveSectionItems } from "@/lib/home/items";
import type { HomeCardItem, HomeSustainabilityContent } from "@/types/homePage";

function SustainabilityCard({
  title,
  description,
  image,
  href,
}: HomeCardItem) {
  return (
    <Link
      href={href || "#"}
      className="group relative block overflow-hidden rounded-2xl"
    >
      <div className="relative aspect-[16/10] sm:aspect-[16/9]">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
        <h3 className="text-lg font-bold text-white sm:text-2xl">{title}</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
          {description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white transition-colors group-hover:text-primary-light">
          Read more
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

type SustainabilityProps = {
  content: HomeSustainabilityContent;
};

export function Sustainability({ content }: SustainabilityProps) {
  const cards = getActiveSectionItems(content.cards);

  return (
    <section className="bg-muted py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {cards.map((card) => (
            <SustainabilityCard key={card.id} {...card} />
          ))}
        </div>
      </Container>
    </section>
  );
}
