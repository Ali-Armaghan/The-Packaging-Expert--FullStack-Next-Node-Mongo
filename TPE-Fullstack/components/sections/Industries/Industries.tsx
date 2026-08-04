"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CarouselButton,
  carouselTrackClassName,
} from "@/components/ui/CarouselButton";
import { Container } from "@/components/ui/Container";
import { getActiveSectionItems } from "@/lib/home/items";
import { cn } from "@/lib/utils";
import type { HomeCardItem, HomeIndustriesContent } from "@/types/homePage";

function IndustryCard({ industry }: { industry: HomeCardItem }) {
  return (
    <Link
      href={industry.href || "#"}
      data-industry-card
      className="group flex h-auto w-[85vw] max-w-[320px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-border/60 bg-white shadow-sm transition-shadow hover:shadow-md sm:w-[300px] lg:w-[calc((100%-3rem)/3.15)] lg:max-w-none"
    >
      <div className="relative aspect-[4/3] bg-muted">
        {industry.image ? (
          <Image
            src={industry.image}
            alt={industry.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 30vw"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="min-h-[3.25rem] text-base font-bold leading-snug text-foreground sm:min-h-[3.5rem] sm:text-lg">
          {industry.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {industry.description}
        </p>
      </div>
    </Link>
  );
}

type IndustriesProps = {
  content: HomeIndustriesContent;
};

export function Industries({ content }: IndustriesProps) {
  const items = useMemo(
    () => getActiveSectionItems(content.cards),
    [content.cards],
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const updateScrollState = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScroll = scrollWidth - clientWidth;

    setCanScrollPrev(scrollLeft > 8);
    setCanScrollNext(scrollLeft < maxScroll - 8);

    const cards = container.querySelectorAll<HTMLElement>("[data-industry-card]");
    if (cards.length === 0) return;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - scrollLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
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

    const card = container.querySelector<HTMLElement>("[data-industry-card]");
    const gap = 24;
    const amount = (card?.offsetWidth ?? 300) + gap;

    container.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  const scrollToIndex = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;

    const card = container.querySelectorAll<HTMLElement>("[data-industry-card]")[index];
    if (!card) return;

    container.scrollTo({
      left: card.offsetLeft,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 max-w-2xl flex-1">
            <h2 className="section-heading">{content.title}</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {content.subtitle}
            </p>
          </div>

          <div className="flex shrink-0 gap-3">
            <CarouselButton
              direction="prev"
              label="Previous industries"
              onClick={() => scroll("prev")}
              disabled={!canScrollPrev}
            />
            <CarouselButton
              direction="next"
              label="Next industries"
              onClick={() => scroll("next")}
              disabled={!canScrollNext}
            />
          </div>
        </div>

        <div
          ref={scrollRef}
          className={carouselTrackClassName("mt-10 items-stretch")}
        >
          {items.map((industry) => (
            <IndustryCard key={industry.id} industry={industry} />
          ))}
        </div>

        <div className="mt-8 flex max-w-full flex-wrap items-center justify-center gap-2 px-2">
          {items.map((industry, index) => (
            <button
              key={industry.id}
              type="button"
              aria-label={`Go to ${industry.title}`}
              aria-current={activeIndex === index ? "true" : undefined}
              onClick={() => scrollToIndex(index)}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                activeIndex === index
                  ? "w-8 bg-primary"
                  : "w-4 bg-border hover:bg-muted-foreground/40",
              )}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
