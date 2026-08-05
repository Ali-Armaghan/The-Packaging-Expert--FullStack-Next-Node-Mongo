"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { EliteCatalogContent } from "@/types/elitePage";
import { cn } from "@/lib/utils";
import { EliteSectionEyebrow } from "./ui";

export function EliteCatalog({ content }: { content: EliteCatalogContent }) {
  const [activeTab, setActiveTab] = useState(0);

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

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-5">
          {content.products.map((product) => (
            <Link
              key={product.name}
              href={product.href}
              className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.06] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(20,24,32,0.45)] hover:ring-primary/25"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#eef1f3]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  loading="lazy"
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80" />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-[color:var(--elite-ink)]">
                  {product.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Starting from{" "}
                  <span className="font-semibold text-primary">
                    {product.price}
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
