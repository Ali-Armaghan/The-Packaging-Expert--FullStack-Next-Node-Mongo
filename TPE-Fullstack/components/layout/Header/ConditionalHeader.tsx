"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "./Header";

export function ConditionalHeader() {
  const pathname = usePathname();
  const isBlogRoute = pathname.startsWith("/blog");

  if (isBlogRoute) {
    return null;
  }

  return <Header />;
}
