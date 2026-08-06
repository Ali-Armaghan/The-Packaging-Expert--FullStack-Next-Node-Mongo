"use client";

import { usePathname } from "next/navigation";
import type { PublicMenuLinks } from "@/lib/menuLinks/apply";
import { Header } from "./Header";

type ConditionalHeaderProps = {
  menuLinks: PublicMenuLinks;
};

export function ConditionalHeader({ menuLinks }: ConditionalHeaderProps) {
  const pathname = usePathname();
  const hideHeader =
    pathname.startsWith("/blog") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up");
  if (hideHeader) {
    return null;
  }

  return <Header menuLinks={menuLinks} />;
}
