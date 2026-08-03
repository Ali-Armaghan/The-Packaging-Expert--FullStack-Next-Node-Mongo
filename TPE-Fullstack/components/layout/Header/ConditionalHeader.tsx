"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";

export function ConditionalHeader() {
  const pathname = usePathname();
  const hideHeader =
    pathname.startsWith("/blog") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up");

  if (hideHeader) {
    return null;
  }

  return <Header />;
}
