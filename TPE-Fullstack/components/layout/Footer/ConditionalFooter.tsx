"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  const isBlogRoute = pathname.startsWith("/blog");

  if (isBlogRoute) {
    return null;
  }

  return <Footer />;
}
