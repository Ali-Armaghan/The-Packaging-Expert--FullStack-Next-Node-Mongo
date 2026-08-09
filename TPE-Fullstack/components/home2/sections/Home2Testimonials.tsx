"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Home2TestimonialsContent } from "@/lib/home2/content";

type Home2TestimonialsProps = {
  content: Home2TestimonialsContent;
};

/**
 * Social proof reviews — horizontal carousel with seamless loop + autoplay.
 */
export function Home2Testimonials({ content }: Home2TestimonialsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [paused, setPaused] = useState(false);
  const items = content.items;

  const getStep = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const card = track.querySelector<HTMLElement>("[data-review-card]");
    if (!card) return 0;
    const styles = getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "16") || 16;
    return card.offsetWidth + gap;
  }, []);

  const scrollByCard = useCallback(
    (dir: 1 | -1) => {
      const track = trackRef.current;
      if (!track) return;
      const step = getStep();
      if (!step) return;

      // Half track = original set (cloned once)
      const loopWidth = track.scrollWidth / 2;
      let next = track.scrollLeft + dir * step;

      if (dir > 0 && next >= loopWidth - 2) {
        // Smooth into clone, then snap back to matching start
        track.scrollTo({ left: next, behavior: "smooth" });
        window.setTimeout(() => {
          if (!trackRef.current) return;
          trackRef.current.scrollTo({
            left: next - loopWidth,
            behavior: "auto",
          });
        }, 420);
        return;
      }

      if (dir < 0 && next < 0) {
        track.scrollTo({ left: loopWidth + next, behavior: "auto" });
        requestAnimationFrame(() => {
          track.scrollBy({ left: -step, behavior: "smooth" });
        });
        return;
      }

      track.scrollTo({ left: next, behavior: "smooth" });
    },
    [getStep],
  );

  // Auto-advance loop
  useEffect(() => {
    if (paused || items.length < 2) return;
    const id = window.setInterval(() => {
      scrollByCard(1);
    }, 2000);
    return () => window.clearInterval(id);
  }, [paused, items.length, scrollByCard]);

  const pauseTemporarily = () => {
    setPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), 6000);
  };

  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  return (
    <section className="home2-quotes" aria-label="Customer reviews">
      <div className="home2-quotes__inner">
        <header className="home2-quotes__header">
          <div className="home2-quotes__intro">
            <p className="home2-vision__eyebrow">
              <span className="home2-vision__eyebrow-dot" />
              {content.eyebrow}
            </p>
            <h2 className="home2-quotes__title">{content.title}</h2>
            <p className="home2-quotes__subtitle">{content.subtitle}</p>
          </div>

          <div className="home2-quotes__nav">
            <button
              type="button"
              className="home2-quotes__btn"
              aria-label="Previous review"
              onClick={() => {
                pauseTemporarily();
                scrollByCard(-1);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="home2-quotes__btn"
              aria-label="Next review"
              onClick={() => {
                pauseTemporarily();
                scrollByCard(1);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M9 18l6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </header>

        <div
          ref={trackRef}
          className="home2-quotes__track"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onTouchStart={pauseTemporarily}
        >
          {items.map((item) => (
            <article
              key={item.id}
              className="home2-quotes__item"
              data-review-card
            >
              <div className="home2-quotes__stars" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} aria-hidden="true">
                    ★
                  </span>
                ))}
              </div>
              <blockquote className="home2-quotes__quote">
                “{item.quote}”
              </blockquote>
              <footer className="home2-quotes__meta">
                <cite className="home2-quotes__name">{item.name}</cite>
                <span className="home2-quotes__role">{item.role}</span>
              </footer>
            </article>
          ))}
          {/* Clone first cards so the loop never feels empty at the end */}
          {items.map((item) => (
            <article
              key={`loop-${item.id}`}
              className="home2-quotes__item"
              data-review-card
              aria-hidden="true"
            >
              <div className="home2-quotes__stars" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <blockquote className="home2-quotes__quote">
                “{item.quote}”
              </blockquote>
              <footer className="home2-quotes__meta">
                <cite className="home2-quotes__name">{item.name}</cite>
                <span className="home2-quotes__role">{item.role}</span>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
