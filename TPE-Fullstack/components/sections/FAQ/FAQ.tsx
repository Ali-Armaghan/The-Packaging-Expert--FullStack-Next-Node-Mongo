"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { getActiveSectionItems } from "@/lib/home/items";
import type { HomeFaqContent } from "@/types/homePage";
import { cn } from "@/lib/utils";

type FAQProps = {
  content: HomeFaqContent;
};

export function FAQ({ content }: FAQProps) {
  const items = getActiveSectionItems(content.items);
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <section id="faq" className="bg-[#fbfaf8] py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-[linear-gradient(180deg,#efe6da,#f7f2eb)] px-6 py-12 sm:px-10">
          <div className="text-center">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              <span className="h-px w-6 bg-primary/70" aria-hidden />
              Support
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-navy sm:text-4xl">
              {content.title}
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {items.map((item) => {
              const isOpen = openId === item.id;

              return (
                <div
                  key={item.id}
                  className={cn(
                    "overflow-hidden rounded-2xl bg-white/80 ring-1 transition duration-300",
                    isOpen
                      ? "ring-primary/30 shadow-md"
                      : "ring-black/5 hover:ring-primary/20",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                  >
                    <span className="min-w-0 flex-1 text-sm font-bold text-navy sm:text-base">
                      {item.question}
                    </span>
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white transition duration-300",
                        isOpen ? "rotate-45 bg-navy" : "bg-primary",
                      )}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-out",
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6">
                        {item.answer}
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
              href="/contact"
              className="font-bold text-primary underline-offset-4 hover:underline"
            >
              Contact us
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
