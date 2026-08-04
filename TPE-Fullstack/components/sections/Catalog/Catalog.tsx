import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/site-button";
import { Container } from "@/components/ui/Container";
import { getActiveSectionItems } from "@/lib/home/items";
import type { HomeCardItem, HomeCatalogContent } from "@/types/homePage";

function CatalogCard({ category }: { category: HomeCardItem }) {
  return (
    <Link
      href={category.href || "#"}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#dce8ef]">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.title}
            fill
            className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : null}
      </div>
      <div className="p-5">
        <h3 className="text-base font-bold text-foreground sm:text-lg">
          {category.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {category.description}
        </p>
      </div>
    </Link>
  );
}

function CatalogCtaCard({
  titleLines,
  buttonLabel,
  buttonHref,
}: HomeCatalogContent["ctaCard"]) {
  return (
    <article className="flex min-h-[320px] h-full flex-col rounded-2xl bg-[#ebebeb] p-6 sm:min-h-0">
      <h3 className="text-left text-[1.35rem] font-bold leading-[1.2] text-[#1a1c22]">
        {titleLines.map((line, index) => (
          <span key={`${line}-${index}`}>
            {line}
            {index < titleLines.length - 1 ? <br /> : null}
          </span>
        ))}
      </h3>

      <div className="min-h-24 flex-1" aria-hidden="true" />

      <Link
        href={buttonHref || "/quote"}
        className="block w-full rounded-[6px] border border-[#1a1c22] bg-transparent py-3.5 text-center text-[0.9375rem] font-bold leading-[1.35] text-[#1a1c22] transition-colors hover:bg-black/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1c22]"
      >
        {buttonLabel || "Request a custom quote"}
      </Link>
    </article>
  );
}

type CatalogProps = {
  content: HomeCatalogContent;
};

export function Catalog({ content }: CatalogProps) {
  const cards = getActiveSectionItems(content.cards);

  return (
    <section className="bg-muted py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="min-w-0 flex-1">
            <h2 className="section-heading lg:whitespace-nowrap lg:text-[clamp(1.35rem,2vw,2.25rem)]">
              {content.title}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {content.subtitle}
            </p>
          </div>

          <Button
            href={content.browseCta.href || "/catalog"}
            variant="outline"
            size="lg"
            className="w-full shrink-0 rounded-full px-8 sm:w-fit"
          >
            {content.browseCta.label || "Browse full catalog"}
          </Button>
        </div>

        <div className="mt-10 grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((category) => (
            <CatalogCard key={category.id} category={category} />
          ))}
          <CatalogCtaCard {...content.ctaCard} />
        </div>
      </Container>
    </section>
  );
}
