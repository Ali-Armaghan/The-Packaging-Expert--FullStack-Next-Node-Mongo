"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  name: string;
  images: string[];
};

export function ProductGallery({ name, images }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[Math.min(active, Math.max(images.length - 1, 0))];

  return (
    <div className="flex flex-col gap-3.5">
      <div className="relative aspect-square overflow-hidden rounded-[3px] bg-[#f3f3f1]">
        {current ? (
          <Image
            key={current}
            src={current}
            alt={name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Image coming soon
          </div>
        )}
      </div>

      {images.length > 1 ? (
        <div className="flex gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((src, index) => {
            const isActive = index === active;
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`View image ${index + 1} of ${name}`}
                aria-current={isActive}
                className={cn(
                  "relative size-[4.5rem] shrink-0 overflow-hidden rounded-[3px] bg-[#f3f3f1] transition sm:size-20",
                  "ring-1 ring-black/8 hover:ring-primary/40",
                  isActive && "ring-2 ring-primary ring-offset-1",
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
