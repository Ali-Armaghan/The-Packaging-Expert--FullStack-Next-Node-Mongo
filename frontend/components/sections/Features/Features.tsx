"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CarouselButton,
  carouselTrackClassName,
} from "@/components/ui/CarouselButton";
import { Container } from "@/components/ui/Container";
import { features, featuresContent, type Feature } from "@/constants/features";
import { cn } from "@/lib/utils";

function FeatureIcon({ icon }: Pick<Feature, "icon">) {
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
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 14v-2a4 4 0 118 0v2"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 14v1a3 3 0 01-3 3h-1"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 14v1a3 3 0 003 3h1"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 18h6"
          />
          <circle cx="12" cy="7" r="3" />
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
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 18c2.5-4.5 5-6.5 8-8s3.5-2 5-4"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 6h2.5v2.5"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 16v2.5h2.5"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 5l1.5 1.5M17 5l-1 1.5"
          />
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
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 20L20 4"
          />
          <path strokeLinecap="round" d="M7.5 16.5l1 1" />
          <path strokeLinecap="round" d="M10 14l1 1" />
          <path strokeLinecap="round" d="M12.5 11.5l1 1" />
          <path strokeLinecap="round" d="M15 9l1 1" />
          <path strokeLinecap="round" d="M17.5 6.5l1 1" />
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
          aria-hidden="true"
        >
          <circle cx="12" cy="9" r="5" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.5 9l1.5 1.5L14.5 7"
          />
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

export function Features() {
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
  }, [updateScrollState]);

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
              {featuresContent.title}{" "}
              <RotatingHighlight items={featuresContent.highlights} />
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {featuresContent.subtitle}
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
          {features.map((feature) => (
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
