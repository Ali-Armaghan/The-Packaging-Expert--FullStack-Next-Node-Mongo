"use client";

import { usePathname } from "next/navigation";
import { Home2Header } from "@/components/home2/nav";
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

  // /home2 gets its own glass studio header — nowhere else.
  if (pathname === "/home2" || pathname.startsWith("/home2/")) {
    return <Home2Header menuLinks={menuLinks} />;
  }

  return <Header menuLinks={menuLinks} />;
}
