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
  const current = images[Math.min(active, images.length - 1)];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#f7f5f1_0%,#efefec_100%)] ring-1 ring-black/5">
        {current ? (
          <Image
            key={current}
            src={current}
            alt={name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 46vw"
            className="object-contain p-6 duration-500 animate-in fade-in"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Image coming soon
          </div>
        )}
      </div>

      {images.length > 1 ? (
        <div className="flex flex-wrap gap-3">
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1} of ${name}`}
              aria-current={index === active}
              className={cn(
                "relative size-16 overflow-hidden rounded-xl bg-white transition sm:size-20",
                "ring-1 ring-black/5 hover:ring-primary/40",
                index === active && "ring-2 ring-primary",
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                loading="lazy"
                sizes="80px"
                className="object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
