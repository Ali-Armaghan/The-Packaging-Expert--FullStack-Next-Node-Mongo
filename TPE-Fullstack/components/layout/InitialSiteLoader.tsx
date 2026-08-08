"use client";

import { useEffect } from "react";

const MIN_VISIBLE_MS = 2200;
const MAX_WAIT_MS = 5000;
const LOADER_ID = "initial-site-loader";

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function waitForWindowLoad() {
  return new Promise<void>((resolve) => {
    if (document.readyState === "complete") {
      resolve();
      return;
    }
    window.addEventListener("load", () => resolve(), { once: true });
  });
}

function waitForPriorityImages() {
  return new Promise<void>((resolve) => {
    const candidates = Array.from(
      document.querySelectorAll<HTMLImageElement>(
        "#site-header img, main section:first-of-type img",
      ),
    );

    if (candidates.length === 0) {
      resolve();
      return;
    }

    let remaining = candidates.length;
    const done = () => {
      remaining -= 1;
      if (remaining <= 0) resolve();
    };

    for (const img of candidates) {
      if (img.complete && img.naturalWidth > 0) {
        done();
        continue;
      }
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    }
  });
}

function hideLoader() {
  const el = document.getElementById(LOADER_ID);
  if (!el || el.dataset.done === "1") return;
  el.dataset.done = "1";
  el.classList.add("initial-site-loader--hide");
  document.body.classList.remove("initial-loader-active");
  window.setTimeout(() => {
    el.remove();
  }, 450);
}

/**
 * Hides the SSR splash (#initial-site-loader) after assets are ready.
 * The markup itself lives in root layout so it paints before React hydrates.
 */
export function InitialSiteLoader() {
  useEffect(() => {
    document.body.classList.add("initial-loader-active");

    let cancelled = false;

    void (async () => {
      await Promise.all([
        wait(MIN_VISIBLE_MS),
        Promise.race([
          Promise.all([
            waitForWindowLoad(),
            waitForPriorityImages(),
            document.fonts?.ready ?? Promise.resolve(),
          ]),
          wait(MAX_WAIT_MS),
        ]),
      ]);
      if (!cancelled) hideLoader();
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
