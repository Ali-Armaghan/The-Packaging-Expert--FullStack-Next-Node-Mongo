"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { EliteCatalogContent } from "@/types/elitePage";
import { cn } from "@/lib/utils";
import { EliteSectionEyebrow } from "./ui";

export function EliteCatalog({ content }: { content: EliteCatalogContent }) {
  const [activeTab, setActiveTab] = useState(0);

  const visibleProducts = useMemo(() => {
    const tab = content.tabs[activeTab];
    if (!tab) return content.products;
    const matched = content.products.filter(
      (p) => p.name.toLowerCase() === tab.toLowerCase(),
    );
    // Keep a full grid feel — show match first, then the rest
    if (matched.length === 0) return content.products;
    const rest = content.products.filter(
      (p) => p.name.toLowerCase() !== tab.toLowerCase(),
    );
    return [...matched, ...rest];
  }, [activeTab, content.products, content.tabs]);

  return (
    <section className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <EliteSectionEyebrow>{content.eyebrow}</EliteSectionEyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[color:var(--elite-ink)] sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-3 max-w-lg text-muted-foreground">
              {content.description}
            </p>
          </div>
          <Link
            href={content.viewAllHref}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            {content.viewAllLabel}
            <span className="transition group-hover:translate-x-1" aria-hidden>
              →
            </span>
          </Link>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {content.tabs.map((tab, i) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(i)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition duration-300",
                activeTab === i
                  ? "bg-primary text-white shadow-[0_10px_24px_-12px_rgba(52,173,120,0.8)]"
                  : "bg-white text-muted-foreground ring-1 ring-black/5 hover:text-foreground hover:ring-primary/30",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5 lg:gap-6">
          {visibleProducts.map((product, index) => {
            const isFeatured =
              product.name.toLowerCase() ===
              content.tabs[activeTab]?.toLowerCase();

            return (
              <Link
                key={product.name}
                href={product.href}
                className={cn(
                  "group relative flex flex-col rounded-[1.35rem] bg-[linear-gradient(180deg,#f7f3ed_0%,#f3efe8_100%)] p-2.5 transition duration-300 sm:p-3",
                  "hover:-translate-y-1 hover:bg-[linear-gradient(180deg,#f3ebe1_0%,#eaf6f0_100%)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  isFeatured && "ring-1 ring-primary/25",
                )}
                style={{ transitionDelay: `${Math.min(index, 8) * 15}ms` }}
              >
                <div className="relative aspect-square overflow-hidden rounded-[1.1rem] bg-white/70 shadow-[inset_0_0_0_1px_rgba(20,24,32,0.04)]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    loading="lazy"
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color:var(--elite-ink)]/25 via-transparent to-white/10 opacity-70 transition group-hover:opacity-90"
                    aria-hidden
                  />
                  <span className="absolute right-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-primary shadow-sm backdrop-blur-sm">
                    {product.price}
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-1.5 pb-1 pt-3.5 sm:px-2 sm:pt-4">
                  <h3 className="text-[0.95rem] font-bold leading-snug tracking-[-0.01em] text-[color:var(--elite-ink)] sm:text-base">
                    {product.name}
                  </h3>
                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      Custom sizes
                    </span>
                    <span className="inline-flex h-8 items-center gap-1 rounded-full bg-white/80 px-3 text-xs font-semibold text-primary ring-1 ring-primary/15 transition duration-300 group-hover:bg-primary group-hover:text-white group-hover:ring-primary">
                      Quote
                      <span
                        className="transition group-hover:translate-x-0.5"
                        aria-hidden
                      >
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
