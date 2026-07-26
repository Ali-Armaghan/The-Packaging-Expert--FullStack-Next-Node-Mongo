"use client";

import { useEffect, useState } from "react";
import { AgenticLoader } from "./AgenticLoader";
import { cn } from "@/lib/utils";

const STATUS_LINES = [
  "Thinking...",
  "Preparing workspace...",
  "Almost ready...",
] as const;

type PageLoaderProps = {
  className?: string;
  label?: string;
  /** Compact mode for nested admin content areas */
  compact?: boolean;
  /** Fixed full-screen centered overlay */
  overlay?: boolean;
};

export function PageLoader({
  className,
  label = "Loading",
  compact = false,
  overlay = false,
}: PageLoaderProps) {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_LINES.length);
    }, 1600);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!overlay) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [overlay]);

  return (
    <div
      className={cn(
        "agentic-page-loader",
        overlay
          ? "agentic-page-loader--overlay"
          : compact
            ? "agentic-page-loader--compact"
            : "agentic-page-loader--full",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <div className="agentic-page-loader__glow" aria-hidden="true" />
      <div className="agentic-page-loader__card">
        <div className="agentic-page-loader__mark" aria-hidden="true">
          PE
        </div>
        <AgenticLoader size="lg" label={label} />
        <p
          className="agentic-page-loader__status"
          key={STATUS_LINES[statusIndex]}
        >
          {STATUS_LINES[statusIndex]}
        </p>
        <div className="agentic-page-loader__bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
