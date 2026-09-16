"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { enterJourneyPage, pauseJourneyPage } from "@/lib/quotes/journey";

export function QuoteJourneyTracker() {
  const pathname = usePathname();

  useEffect(() => {
    enterJourneyPage(pathname);

    const onVisibility = () => {
      if (document.visibilityState === "hidden") pauseJourneyPage();
      else enterJourneyPage(pathname);
    };

    window.addEventListener("pagehide", pauseJourneyPage);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      pauseJourneyPage();
      window.removeEventListener("pagehide", pauseJourneyPage);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pathname]);

  return null;
}
