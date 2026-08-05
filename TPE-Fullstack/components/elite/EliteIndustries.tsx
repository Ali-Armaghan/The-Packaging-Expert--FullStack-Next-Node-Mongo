import Image from "next/image";
import Link from "next/link";
import type { EliteIndustriesContent } from "@/types/elitePage";
import { cn } from "@/lib/utils";
import { EliteSectionEyebrow } from "./ui";

export function EliteIndustries({
  content,
}: {
  content: EliteIndustriesContent;
}) {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <EliteSectionEyebrow>{content.eyebrow}</EliteSectionEyebrow>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[color:var(--elite-ink)] sm:text-4xl">
            {content.title}
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group relative min-h-[360px] overflow-hidden rounded-[1.75rem]"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                loading="lazy"
                className="object-cover transition duration-700 group-hover:scale-110"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div
                className={cn(
                  "absolute inset-0 transition duration-500",
                  item.tone,
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-white/80">{item.subtitle}</p>
                <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white backdrop-blur transition group-hover:bg-white group-hover:text-[color:var(--elite-ink)]">
                  Shop now
                  <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
