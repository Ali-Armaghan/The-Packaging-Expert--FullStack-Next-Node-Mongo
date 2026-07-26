"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { faqItems } from "@/constants/faq";
import { cn } from "@/lib/utils";

export function FAQ() {
  const [openId, setOpenId] = useState(faqItems[0].id);

  return (
    <section id="faq" className="bg-muted py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h2 className="section-heading text-center">
            Frequently asked questions
          </h2>

          <div className="mt-10 divide-y divide-border overflow-hidden rounded-2xl border border-border/60 bg-white">
            {faqItems.map((item) => {
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
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>

                  <div
                    className={cn(
                      "grid transition-all duration-300",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-5 sm:text-base">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
