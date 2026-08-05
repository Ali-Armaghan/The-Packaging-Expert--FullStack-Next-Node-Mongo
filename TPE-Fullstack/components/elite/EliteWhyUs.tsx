import Image from "next/image";
import { Clock3, Palette, ShieldCheck, type LucideIcon } from "lucide-react";
import type { EliteWhyUsContent } from "@/types/elitePage";
import { EliteSectionEyebrow } from "./ui";

const ICONS: Record<EliteWhyUsContent["items"][number]["icon"], LucideIcon> = {
  palette: Palette,
  clock: Clock3,
  shield: ShieldCheck,
};

export function EliteWhyUs({ content }: { content: EliteWhyUsContent }) {
  return (
    <section className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[linear-gradient(160deg,#efe6da_0%,#f7f1e9_45%,#e8f6ef_100%)] px-6 py-12 sm:px-10 sm:py-14 lg:px-14">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <EliteSectionEyebrow>{content.eyebrow}</EliteSectionEyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[color:var(--elite-ink)] sm:text-4xl">
              {content.title}
            </h2>
            <div className="mt-10 space-y-5">
              {content.items.map((item) => {
                const Icon = ICONS[item.icon];
                return (
                  <div
                    key={item.title}
                    className="flex gap-4 rounded-2xl bg-white/70 p-4 ring-1 ring-black/5 backdrop-blur transition hover:bg-white"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_12px_24px_-14px_rgba(52,173,120,0.9)]">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[color:var(--elite-ink)]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Single styled image composition */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 rounded-full bg-primary/20 blur-2xl sm:-right-6 sm:-top-6"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-6 -left-4 h-32 w-32 rounded-full bg-[#e4d5c3]/80 blur-2xl"
              aria-hidden
            />

            {/* Soft offset frame behind the photo */}
            <div
              className="absolute inset-3 translate-x-3 translate-y-3 rounded-[1.75rem] bg-primary/15 sm:inset-4 sm:translate-x-4 sm:translate-y-4"
              aria-hidden
            />
            <div
              className="absolute inset-3 -translate-x-2 -translate-y-2 rounded-[1.75rem] bg-[color:var(--elite-ink)]/8 sm:inset-4 sm:-translate-x-3 sm:-translate-y-3"
              aria-hidden
            />

            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-[0_28px_60px_-28px_rgba(20,24,32,0.45)] ring-1 ring-black/5">
              <Image
                src={content.image}
                alt={content.imageAlt ?? "Why choose us packaging"}
                fill
                loading="lazy"
                className="object-cover transition duration-700 hover:scale-[1.03]"
                sizes="(max-width: 1024px) 90vw, 42vw"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[color:var(--elite-ink)]/40 via-transparent to-white/10"
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">
                  Crafted for brands
                </p>
                <p className="mt-1 text-lg font-bold text-white sm:text-xl">
                  Premium packaging, made simple
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
