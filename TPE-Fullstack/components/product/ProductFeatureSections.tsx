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
      {sections.map((section, index) => {
        const imageRight = section.imageSide === "right";
        return (
          <section
            key={`${section.title}-${index}`}
            className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16 xl:gap-20"
          >
            <div
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-[3px] bg-[#f3f3f1] sm:aspect-[5/3.6]",
                imageRight && "lg:order-2",
              )}
            >
              {section.image ? (
                <Image
                  src={section.image}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                />
              ) : null}
            </div>

            <div
              className={cn(
                "max-w-md lg:py-4",
                imageRight ? "lg:order-1 lg:justify-self-start" : "lg:justify-self-end",
              )}
            >
              <h2 className="text-[1.55rem] font-bold leading-[1.2] tracking-[-0.025em] text-foreground sm:text-[1.85rem]">
                {section.title}
              </h2>
              {section.description ? (
                <p className="mt-4 text-[15px] leading-[1.7] text-muted-foreground">
                  {section.description}
                </p>
              ) : null}
              {section.linkLabel ? (
                <Link
                  href={section.linkHref || "/quote"}
                  className="group mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-primary"
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
        );
      })}
    </div>
  );
}
