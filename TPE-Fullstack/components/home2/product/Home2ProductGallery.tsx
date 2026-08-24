"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

type Home2ProductGalleryProps = {
  name: string;
  images: string[];
};

export function Home2ProductGallery({ name, images }: Home2ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const total = images.length;
  const current = images[Math.min(active, Math.max(total - 1, 0))];

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      setActive((index + total) % total);
    },
    [total],
  );

  return (
    <div className="home2-pdp__gallery">
      <div className="home2-pdp__stage-wrap">
        <div className="home2-pdp__stage">
          <div className="home2-pdp__stage-shine" aria-hidden="true" />
          {current ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={current}
              src={current}
              alt={name}
              className="home2-pdp__stage-img"
            />
          ) : (
            <div className="home2-pdp__stage-empty">Image coming soon</div>
          )}
        </div>

        {total > 1 ? (
          <>
            <button
              type="button"
              className="home2-pdp__stage-nav home2-pdp__stage-nav--prev"
              onClick={() => goTo(active - 1)}
              aria-label="Previous image"
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
              className="home2-pdp__stage-nav home2-pdp__stage-nav--next"
              onClick={() => goTo(active + 1)}
              aria-label="Next image"
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
            <span className="home2-pdp__stage-count" aria-live="polite">
              {active + 1} / {total}
            </span>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="home2-pdp__thumbs" role="tablist" aria-label="Product images">
          {images.map((src, index) => {
            const isActive = index === active;
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                role="tab"
                onClick={() => setActive(index)}
                aria-label={`View image ${index + 1} of ${name}`}
                aria-selected={isActive}
                className={cn("home2-pdp__thumb", isActive && "home2-pdp__thumb--active")}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="home2-pdp__thumb-img" loading="lazy" />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
