import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductFeatureSection } from "@/types/product";

export function ProductFeatureSections({
  sections,
}: {
  sections: ProductFeatureSection[];
}) {
  if (sections.length === 0) return null;

  return (
    <div className="space-y-16 sm:space-y-24">
      {sections.map((section) => (
        <section
          key={section.title}
          className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
        >
          <div
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted",
              section.imageSide === "right" && "lg:order-2",
            )}
          >
            {section.image ? (
              <Image
                src={section.image}
                alt=""
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover"
              />
            ) : null}
          </div>

          <div className={cn(section.imageSide === "right" && "lg:order-1")}>
            <h2 className="text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">
              {section.title}
            </h2>
            {section.description ? (
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                {section.description}
              </p>
            ) : null}
            {section.linkLabel ? (
              <Link
                href={section.linkHref || "/quote"}
                className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                {section.linkLabel}
                <ArrowRightIcon
                  className="size-4 transition group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            ) : null}
          </div>
        </section>
      ))}
    </div>
  );
}
