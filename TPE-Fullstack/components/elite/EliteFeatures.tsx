import Image from "next/image";
import type { EliteFeaturesContent } from "@/types/elitePage";
import { EliteOutlineBtn, ElitePrimaryBtn, EliteSectionEyebrow } from "./ui";

export function EliteFeatures({ content }: { content: EliteFeaturesContent }) {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-16 lg:space-y-24">
        {content.blocks.map((block) => {
          const image = (
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-black/5">
              <Image
                src={block.image}
                alt={block.imageAlt}
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          );

          const copy = (
            <div>
              <EliteSectionEyebrow>{block.eyebrow}</EliteSectionEyebrow>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[color:var(--elite-ink)] sm:text-4xl">
                {block.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {block.description}
              </p>
              {block.bullets?.length ? (
                <ul className="mt-7 space-y-3 text-sm text-muted-foreground">
                  {block.bullets.map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                        ✓
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
              ) : null}
              {block.cta.variant === "primary" ? (
                <ElitePrimaryBtn href={block.cta.href} className="mt-8">
                  {block.cta.label}
                </ElitePrimaryBtn>
              ) : (
                <EliteOutlineBtn href={block.cta.href} className="mt-8">
                  {block.cta.label}
                </EliteOutlineBtn>
              )}
            </div>
          );

          return (
            <div
              key={block.title}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              {block.imageSide === "left" ? (
                <>
                  <div className="order-2 lg:order-1">{image}</div>
                  <div className="order-1 lg:order-2">{copy}</div>
                </>
              ) : (
                <>
                  {copy}
                  {image}
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
