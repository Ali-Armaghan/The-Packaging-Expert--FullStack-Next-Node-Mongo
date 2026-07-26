"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  const hideFooter =
    pathname.startsWith("/blog") || pathname.startsWith("/admin");

  if (hideFooter) {
    return null;
  }

  return <Footer />;
}
