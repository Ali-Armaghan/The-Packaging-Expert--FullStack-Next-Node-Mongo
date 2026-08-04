"use client";

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
  const [openId, setOpenId] = useState(items[0]?.id ?? "");

  return (
    <section id="faq" className="bg-muted py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h2 className="section-heading text-center">{content.title}</h2>

          <div className="mt-10 divide-y divide-border overflow-hidden rounded-2xl border border-border/60 bg-white">
            {items.map((item) => {
              const isOpen = openId === item.id;

              return (
                <div key={item.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? "" : item.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left sm:px-6 sm:py-5"
                  >
                    <span className="min-w-0 flex-1 text-sm font-semibold text-foreground sm:text-base">
                      {item.question}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform",
                        isOpen && "rotate-45",
                      )}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
