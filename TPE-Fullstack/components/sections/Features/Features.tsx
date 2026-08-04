"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CarouselButton,
  carouselTrackClassName,
} from "@/components/ui/CarouselButton";
import { Container } from "@/components/ui/Container";
import { getActiveSectionItems } from "@/lib/home/items";
import { cn } from "@/lib/utils";
import type { HomeFeatureItem, HomeFeaturesContent } from "@/types/homePage";

function FeatureIcon({ icon }: Pick<HomeFeatureItem, "icon">) {
  const className = "h-8 w-8";

  switch (icon) {
    case "headset":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 13a8 8 0 0116 0" />
          <path d="M4 13v3a2 2 0 002 2h1" />
          <path d="M20 13v3a2 2 0 01-2 2h-1" />
          <rect x="2.5" y="12" width="3.5" height="6" rx="1.5" />
          <rect x="18" y="12" width="3.5" height="6" rx="1.5" />
          <path d="M15 19h2a2 2 0 002-2v-1" />
          <circle cx="19" cy="19.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "journey":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="5" cy="18" r="2" />
          <circle cx="19" cy="6" r="2" />
          <path d="M7 17c2.5-1.5 4-4.5 6-6.5S16.5 7 17.5 7" />
          <path d="M15.5 4.5L19 6l-1.5 3.5" />
        </svg>
      );
    case "ruler":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4.8 15.2 15.2 4.8a2 2 0 012.8 2.8L7.6 18a2 2 0 01-2.8-2.8z" />
          <path d="M7.5 12.5l1.5 1.5M10 10l1.5 1.5M12.5 7.5l1.5 1.5M15 5l1.5 1.5" />
        </svg>
      );
    case "promise":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="9" r="5" />
          <path d="M8.5 13.5 7 21l5-2.5L17 21l-1.5-7.5" />
          <path d="M9.5 9l1.5 1.5L14.5 7" />
        </svg>
      );
  }
}

function RotatingHighlight({ items }: { items: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <span className="relative inline-grid whitespace-nowrap align-bottom text-primary">
      <span className="sr-only">{items.join(", ")}</span>
      {items.map((item, index) => (
        <span
          key={item}
          className={cn(
            "col-start-1 row-start-1 whitespace-nowrap transition-opacity duration-500",
            index === activeIndex ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={index !== activeIndex}
        >
          {item}
        </span>
      ))}
    </span>
  );
}

type FeaturesProps = {
  content: HomeFeaturesContent;
};

export function Features({ content }: FeaturesProps) {
  const items = useMemo(
    () => getActiveSectionItems(content.items),
    [content.items],
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const updateScrollState = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScroll = scrollWidth - clientWidth;

    setCanScrollPrev(scrollLeft > 8);
    setCanScrollNext(scrollLeft < maxScroll - 8);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updateScrollState();
    container.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, items.length]);

  const scroll = (direction: "prev" | "next") => {
    const container = scrollRef.current;
    if (!container) return;

    const card = container.querySelector<HTMLElement>("[data-feature-card]");
    const gap = 24;
    const amount = (card?.offsetWidth ?? 280) + gap;

    container.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="section-heading text-[1.5rem] sm:text-[1.75rem] lg:whitespace-nowrap lg:text-[2rem]">
              {content.title}{" "}
              <RotatingHighlight items={content.highlights} />
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {content.subtitle}
            </p>
          </div>

          <div className="flex shrink-0 gap-3">
            <CarouselButton
              direction="prev"
              label="Previous features"
              onClick={() => scroll("prev")}
              disabled={!canScrollPrev}
            />
            <CarouselButton
              direction="next"
              label="Next features"
              onClick={() => scroll("next")}
              disabled={!canScrollNext}
            />
          </div>
        </div>

        <div
          ref={scrollRef}
          className={cn(
            carouselTrackClassName("mt-10 items-stretch"),
            "lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0 lg:snap-none lg:pb-0",
          )}
        >
          {items.map((feature) => (
            <article
              key={feature.id}
              data-feature-card
              className="flex h-auto w-[85vw] max-w-[320px] shrink-0 snap-start flex-col rounded-xl bg-[#f3f4f6] p-6 sm:w-[320px] lg:w-auto lg:max-w-none lg:shrink"
            >
              <div className="mb-5 inline-flex text-primary">
                <FeatureIcon icon={feature.icon} />
              </div>
              <h3 className="text-base font-bold text-foreground sm:text-lg">
                {feature.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
