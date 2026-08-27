"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Home2ProductGalleryProps = {
  name: string;
  images: string[];
};

export function Home2ProductGallery({ name, images }: Home2ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const total = images.length;

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      setActive((index + total) % total);
    },
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(active - 1);
      if (e.key === "ArrowRight") goTo(active + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goTo]);

  return (
    <div className="home2-pdp__gallery">
      <div className="home2-pdp__stage-wrap">
        <div className="home2-pdp__stage">
          <div className="home2-pdp__stage-glow" aria-hidden="true" />
          {images.length > 0 ? (
            images.map((src, index) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={src}
                src={src}
                alt={index === active ? name : ""}
                className={cn(
                  "home2-pdp__stage-img",
                  index === active && "home2-pdp__stage-img--active",
                )}
                draggable={false}
              />
            ))
          ) : (
            <div className="home2-pdp__stage-empty">Image coming soon</div>
          )}

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
              <div className="home2-pdp__stage-dots" aria-hidden="true">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "home2-pdp__stage-dot",
                      i === active && "home2-pdp__stage-dot--active",
                    )}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
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
                className={cn(
                  "home2-pdp__thumb",
                  isActive && "home2-pdp__thumb--active",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="home2-pdp__thumb-img"
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
