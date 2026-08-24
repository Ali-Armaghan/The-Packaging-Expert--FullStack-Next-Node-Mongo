"use client";

import { usePathname } from "next/navigation";
import { Home2Header } from "@/components/home2/nav";
import { isHome2Route } from "@/lib/home2/routes";
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

  if (hideHeader) return null;

  if (isHome2Route(pathname)) {
    return <Home2Header menuLinks={menuLinks} />;
  }

  return <Header menuLinks={menuLinks} />;
}
