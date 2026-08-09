"use client";

import { useEffect, useState } from "react";
import type { Home2FloatImage } from "@/lib/home2/content";

const INTERVAL_MS = 4200;

type HeroFloatStageProps = {
  images: Home2FloatImage[];
};

/**
 * Single-image showcase: one packaging shot at a time, floating in a
 * glass frame with depth stacks and a cinematic crossfade.
 */
export function HeroFloatStage({ images }: HeroFloatStageProps) {
  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
      setFlip((prev) => prev + 1);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) return null;

  const current = images[index]!;
  const previous = images[(index + images.length - 1) % images.length]!;

  return (
    <div className="home2-stage" aria-hidden="true">
      <div className="home2-stage__glow" />
      <div className="home2-stage__orbit" />

      {/* Soft depth plates behind the main frame */}
      <div className="home2-stage__stack home2-stage__stack--back" />
      <div className="home2-stage__stack home2-stage__stack--mid" />

      <div className="home2-stage__frame">
        <div className="home2-stage__shine" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={`prev-${flip}`}
          src={previous.src}
          alt=""
          className="home2-stage__img home2-stage__img--out"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={`cur-${flip}`}
          src={current.src}
          alt=""
          className="home2-stage__img home2-stage__img--in"
        />
      </div>

      <div className="home2-stage__reflection" />

      <div className="home2-stage__meta">
        <p className="home2-stage__label">{current.alt}</p>
        <div className="home2-stage__dots" role="presentation">
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              className={`home2-stage__dot ${i === index ? "home2-stage__dot--active" : ""}`}
              aria-label={`Show ${image.alt}`}
              onClick={() => {
                setIndex(i);
                setFlip((prev) => prev + 1);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
