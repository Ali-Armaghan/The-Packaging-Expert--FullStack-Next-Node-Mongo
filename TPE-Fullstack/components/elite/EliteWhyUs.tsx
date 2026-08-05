import Image from "next/image";
import { Clock3, Palette, ShieldCheck, type LucideIcon } from "lucide-react";
import type { EliteWhyUsContent } from "@/types/elitePage";
import { cn } from "@/lib/utils";
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

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {content.collage.map((src, i) => (
              <div
                key={src}
                className={cn(
                  "relative aspect-[4/5] overflow-hidden rounded-3xl shadow-lg ring-1 ring-black/5",
                  i % 2 === 1 && "translate-y-6",
                )}
              >
                <Image
                  src={src}
                  alt="Packaging detail"
                  fill
                  loading="lazy"
                  className="object-cover transition duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 45vw, 22vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
