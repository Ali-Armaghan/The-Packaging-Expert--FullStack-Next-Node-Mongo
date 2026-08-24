"use client";

import Image from "next/image";
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
          <Image
            key={current}
            src={current}
            alt={name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 52vw"
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
                <Image
                  src={src}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="72px"
                  className="home2-pdp__thumb-img"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
