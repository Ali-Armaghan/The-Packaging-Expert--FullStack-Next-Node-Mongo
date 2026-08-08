import Image from "next/image";
import Link from "next/link";
import type { ProductBanner as ProductBannerContent } from "@/types/product";

export function ProductBanner({
  banner,
}: {
  banner: ProductBannerContent;
}) {
  if (!banner.title) return null;

  return (
    <section className="overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#f7f5f1_0%,#f1efe9_100%)]">
      <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:gap-12">
        <div>
          {banner.eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {banner.eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">
            {banner.title}
          </h2>
          {banner.description ? (
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              {banner.description}
            </p>
          ) : null}
          {banner.buttonLabel ? (
            <Link
              href={banner.buttonHref || "/products"}
              className="mt-7 inline-flex h-11 items-center rounded-lg border border-foreground/15 bg-white px-6 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
            >
              {banner.buttonLabel}
            </Link>
          ) : null}
        </div>

        {banner.image ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl lg:aspect-[5/3]">
            <Image
              src={banner.image}
              alt=""
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
