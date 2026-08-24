"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Home2ProductGalleryProps = {
  name: string;
  images: string[];
};

export function Home2ProductGallery({ name, images }: Home2ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[Math.min(active, Math.max(images.length - 1, 0))];

  return (
    <div className="home2-pdp__gallery">
      <div className="home2-pdp__stage">
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

      {images.length > 1 ? (
        <div className="home2-pdp__thumbs">
          {images.map((src, index) => {
            const isActive = index === active;
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`View image ${index + 1} of ${name}`}
                aria-current={isActive}
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
