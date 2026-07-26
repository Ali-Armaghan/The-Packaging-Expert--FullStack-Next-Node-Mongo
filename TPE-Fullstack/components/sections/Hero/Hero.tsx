import Image from "next/image";
import { Button } from "@/components/ui/site-button";
import { Container } from "@/components/ui/Container";

const brandLogos = [
  "REVLON",
  "FOUR SEASONS",
  "native pet",
  "GLOSSIER",
  "BOMBAS",
];

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

export function Hero() {
  return (
    <section className="relative">
      <div className="relative overflow-hidden bg-[#b8d9ea]">
        <div
          className="absolute inset-0 bg-[#e8a87c] [clip-path:polygon(100%_0,100%_100%,55%_100%)] md:[clip-path:polygon(100%_0,100%_100%,35%_100%)]"
          aria-hidden="true"
        />

        <Container className="relative z-10">
          <div className="grid items-center gap-8 py-10 sm:py-12 lg:grid-cols-2 lg:gap-12 lg:py-16 xl:py-20">
            <div className="max-w-xl">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
                Create custom boxes &amp; packaging of your dreams
              </h1>
              <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
                Order personalized, high-quality custom printed packaging and
                branded boxes your customers will love all-in-one place.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  href="/quote"
                  size="lg"
                  className="w-full rounded-full px-8 sm:w-auto"
                >
                  Request a Quote
                </Button>
                <Button
                  href="/packaging"
                  variant="outline"
                  size="lg"
                  className="w-full rounded-full border-white bg-white px-8 text-primary hover:bg-white/90 hover:text-primary-dark sm:w-auto"
                >
                  Choose Packaging style
                </Button>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md sm:max-w-lg lg:max-w-none lg:justify-self-end">
              <div className="relative aspect-[4/3] w-full sm:aspect-[5/4] lg:aspect-auto lg:h-[420px]">
                <Image
                  src="/images/hero-packaging.png"
                  alt="Custom branded packaging boxes, mailers, and pouches"
                  fill
                  priority
                  className="object-contain object-bottom"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </Container>
      </div>

      <div className="border-b border-border bg-white">
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 py-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-sm font-semibold text-foreground sm:text-base">
                3,000+ brands big and small love us!
              </p>
              <div className="flex items-center gap-2">
                <StarRating />
                <span className="text-sm font-medium text-muted-foreground">
                  4.6 Google Reviews
                </span>
              </div>
            </div>

            <div className="flex w-full items-center gap-x-6 overflow-x-auto pb-1 sm:w-auto sm:flex-wrap sm:overflow-visible sm:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {brandLogos.map((brand) => (
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
