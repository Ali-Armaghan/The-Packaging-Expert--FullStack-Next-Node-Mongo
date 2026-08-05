import Image from "next/image";
import type { EliteHeroContent } from "@/types/elitePage";
import { EliteOutlineBtn, ElitePrimaryBtn, EliteSectionEyebrow } from "./ui";

export function EliteHero({ content }: { content: EliteHeroContent }) {
  return (
    <section className="relative">
      <div className="relative min-h-[min(58vh,480px)] w-full overflow-hidden">
        <Image
          src={content.image}
          alt={content.brand}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(105deg,rgba(251,250,248,0.96)_0%,rgba(251,250,248,0.88)_38%,rgba(20,24,32,0.35)_70%,rgba(20,24,32,0.55)_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex min-h-[min(58vh,480px)] max-w-7xl items-center px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <div className="max-w-xl">
            <div className="elite-reveal">
              <EliteSectionEyebrow>{content.eyebrow}</EliteSectionEyebrow>
            </div>
            <h1 className="elite-reveal elite-reveal-d1 mt-5 text-[2.35rem] font-bold leading-[1.05] tracking-[-0.035em] text-[color:var(--elite-ink)] sm:text-[3rem] lg:text-[3.4rem]">
              {content.brand}
            </h1>
            <p className="elite-reveal elite-reveal-d2 mt-4 max-w-md text-lg font-medium leading-snug text-[color:var(--elite-ink)]/80 sm:text-xl">
              {content.headline}
            </p>
            <p className="elite-reveal elite-reveal-d2 mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
              {content.description}
            </p>
            <div className="elite-reveal elite-reveal-d3 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ElitePrimaryBtn href={content.primaryCta.href}>
                {content.primaryCta.label}
              </ElitePrimaryBtn>
              <EliteOutlineBtn href={content.secondaryCta.href}>
                {content.secondaryCta.label}
              </EliteOutlineBtn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
