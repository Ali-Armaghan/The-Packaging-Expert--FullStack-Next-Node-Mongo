"use client";

import Link from "next/link";
import { useState } from "react";
import type { EliteFaqContent } from "@/types/elitePage";
import { cn } from "@/lib/utils";
import { EliteSectionEyebrow } from "./ui";

export function EliteFaq({ content }: { content: EliteFaqContent }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-[linear-gradient(180deg,#efe6da,#f7f2eb)] px-6 py-12 sm:px-10">
        <div className="text-center">
          <EliteSectionEyebrow>{content.eyebrow}</EliteSectionEyebrow>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[color:var(--elite-ink)] sm:text-4xl">
            {content.title}
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {content.items.map((faq, index) => {
            const open = openFaq === index;
            return (
              <div
                key={faq.q}
                className={cn(
                  "overflow-hidden rounded-2xl bg-white/80 ring-1 transition",
                  open ? "ring-primary/30 shadow-md" : "ring-black/5",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={open}
                >
                  <span className="text-sm font-bold text-[color:var(--elite-ink)] sm:text-base">
                    {faq.q}
                  </span>
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white transition",
                      open
                        ? "rotate-45 bg-[color:var(--elite-ink)]"
                        : "bg-primary",
                    )}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300",
                    open
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Still have questions?{" "}
          <Link
            href={content.contactHref}
            className="font-bold text-primary underline-offset-4 hover:underline"
          >
            Contact us
          </Link>
        </p>
      </div>
    </section>
  );
}
