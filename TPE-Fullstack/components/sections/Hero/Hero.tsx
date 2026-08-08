import Image from "next/image";
import { Button } from "@/components/ui/site-button";
import { Container } from "@/components/ui/Container";
import type { HomeHeroContent } from "@/types/homePage";

function StarRating() {
  return (
    <div className="flex items-center gap-0.5" aria-label="4.6 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="h-4 w-4 fill-primary"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

type HeroProps = {
  content: HomeHeroContent;
};

export function Hero({ content }: HeroProps) {
  const imageSrc = content.image || "/images/hero-packaging.png";

  return (
    <section className="relative">
      <div className="relative min-h-[min(52vh,480px)] overflow-hidden">
        <Image
          src={imageSrc}
          alt={content.imageAlt || content.title}
          fill
          priority
          className="home-hero-image-enter object-cover object-center"
          sizes="100vw"
        />

        {/* Readability overlay — keeps copy clear over any CMS image */}
        <div
          className="home-enter absolute inset-0 bg-gradient-to-r from-[#1a1f2c]/90 via-[#1a1f2c]/55 to-[#1a1f2c]/25"
          aria-hidden="true"
        />
        <div
          className="home-enter absolute inset-0 bg-gradient-to-t from-[#1a1f2c]/50 via-transparent to-[#1a1f2c]/20"
          aria-hidden="true"
        />

        <Container className="relative z-10 flex min-h-[min(52vh,480px)] items-center py-10 sm:py-12 lg:py-14">
          <div className="max-w-xl">
            <h1 className="home-enter home-enter-delay-1 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              {content.title}
            </h1>
            <p className="home-enter home-enter-delay-2 mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
              {content.subtitle}
            </p>
            <div className="home-enter home-enter-delay-3 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                href={content.primaryCta.href || "/quote"}
                size="lg"
                className="w-full rounded-full px-8 sm:w-auto"
              >
                {content.primaryCta.label || "Request a Quote"}
              </Button>
              <Button
                href={content.secondaryCta.href || "/packaging"}
                variant="outline"
                size="lg"
                className="w-full rounded-full border-white bg-white px-8 text-primary hover:bg-white/90 hover:text-primary-dark sm:w-auto"
              >
                {content.secondaryCta.label || "Choose Packaging style"}
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <div className="home-enter home-enter-delay-4 border-b border-border bg-white">
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 py-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-sm font-semibold text-foreground sm:text-base">
                {content.socialProofText}
              </p>
              <div className="flex items-center gap-2">
                <StarRating />
                <span className="text-sm font-medium text-muted-foreground">
                  {content.ratingLabel}
                </span>
              </div>
            </div>

            <div className="flex w-full items-center gap-x-6 overflow-x-auto pb-1 sm:w-auto sm:flex-wrap sm:overflow-visible sm:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {content.brandLogos.map((brand) => (
                <span
                  key={brand}
                  className="shrink-0 text-xs font-bold uppercase tracking-wider text-muted-foreground/60 sm:text-sm"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
