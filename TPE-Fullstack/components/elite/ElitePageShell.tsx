"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Applies entrance motion class after first paint. */
export function ElitePageShell({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={cn(
        "elite-page relative overflow-hidden bg-[#fbfaf8] text-foreground",
        ready && "elite-page--ready",
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(ellipse_80%_60%_at_10%_0%,rgba(52,173,120,0.14),transparent_55%),radial-gradient(ellipse_50%_40%_at_90%_10%,rgba(228,213,195,0.55),transparent_50%)]"
        aria-hidden
      />
      {children}
    </div>
  );
}
