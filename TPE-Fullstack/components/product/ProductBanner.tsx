import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { ProductBanner as ProductBannerContent } from "@/types/product";

export function ProductBanner({
  banner,
}: {
  banner: ProductBannerContent;
}) {
  if (!banner.title) return null;

  return (
    <section className="border-y border-black/[0.05] bg-[#f4f4f2]">
      <Container className="py-12 sm:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="max-w-lg">
            {banner.eyebrow ? (
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {banner.eyebrow}
              </p>
            ) : null}
            <h2 className="mt-3 text-[1.65rem] font-bold leading-[1.2] tracking-[-0.025em] text-foreground sm:text-[2rem]">
              {banner.title}
            </h2>
            {banner.description ? (
              <p className="mt-4 text-[15px] leading-[1.7] text-muted-foreground">
                {banner.description}
              </p>
            ) : null}
            {banner.buttonLabel ? (
              <Link
                href={banner.buttonHref || "/products"}
                className="mt-8 inline-flex h-11 items-center rounded-[3px] border border-foreground/20 bg-transparent px-6 text-[13px] font-semibold text-foreground transition hover:border-primary hover:text-primary"
              >
                {banner.buttonLabel}
              </Link>
            ) : null}
          </div>

          {banner.image ? (
            <div className="relative aspect-[5/3.4] overflow-hidden rounded-[3px] bg-white/60 sm:aspect-[16/10]">
              <Image
                src={banner.image}
                alt=""
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
              />
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
