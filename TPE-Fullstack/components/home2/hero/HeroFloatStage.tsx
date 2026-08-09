"use client";

import { useEffect, useState } from "react";
import type { Home2FloatImage } from "@/lib/home2/content";

type Slot = {
  id: string;
  offset: number;
  interval: number;
};

const SLOTS: Slot[] = [
  { id: "a", offset: 0, interval: 3200 },
  { id: "b", offset: 2, interval: 3800 },
  { id: "c", offset: 4, interval: 4400 },
  { id: "d", offset: 1, interval: 3500 },
  { id: "e", offset: 3, interval: 4100 },
];

type HeroFloatStageProps = {
  images: Home2FloatImage[];
};

type SlotState = {
  current: number;
  previous: number;
  flip: boolean;
};

/**
 * Right-side floating packaging stage.
 * Each slot gently floats and crossfades through the PNG pool on its own beat.
 */
export function HeroFloatStage({ images }: HeroFloatStageProps) {
  const [slots, setSlots] = useState<SlotState[]>(() =>
    SLOTS.map((slot) => ({
      current: slot.offset % Math.max(images.length, 1),
      previous: slot.offset % Math.max(images.length, 1),
      flip: false,
    })),
  );

  useEffect(() => {
    if (images.length < 2) return;

    const timers = SLOTS.map((slot, index) =>
      window.setInterval(() => {
        setSlots((prev) => {
          const next = [...prev];
          const active = next[index]!;
          const upcoming = (active.current + 1) % images.length;
          next[index] = {
            previous: active.current,
            current: upcoming,
            flip: !active.flip,
          };
          return next;
        });
      }, slot.interval),
    );

    return () => {
      for (const timer of timers) window.clearInterval(timer);
    };
  }, [images.length]);

  return (
    <div className="home2-float" aria-hidden="true">
      <div className="home2-float__glow" />
      <div className="home2-float__ring" />
      <div className="home2-float__ring home2-float__ring--slow" />

      {SLOTS.map((slot, index) => {
        const state = slots[index]!;
        const current = images[state.current]!;
        const previous = images[state.previous]!;

        return (
          <div
            key={slot.id}
            className={`home2-float__slot home2-float__slot--${slot.id}`}
          >
            <div className="home2-float__card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={`${slot.id}-prev-${state.previous}-${state.flip}`}
                src={previous.src}
                alt=""
                className="home2-float__img home2-float__img--back"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={`${slot.id}-cur-${state.current}-${state.flip}`}
                src={current.src}
                alt=""
                className="home2-float__img home2-float__img--front"
              />
            </div>
          </div>
        );
      })}

      <p className="home2-float__caption">
        <span className="home2-float__caption-dot" />
        Live packaging gallery
      </p>
    </div>
  );
}
