import type { ReactNode } from "react";
import { ConditionalFooter } from "@/components/layout/Footer";
import { ConditionalHeader } from "@/components/layout/Header";
import { getCachedAllMenuGroupLinks } from "@/lib/menuLinks/cache";
import type { PublicMenuLinks } from "@/lib/menuLinks/apply";

export async function SiteChrome({ children }: { children: ReactNode }) {
  let menuLinks: PublicMenuLinks = {
    industries: {},
    styles: {},
    products: {},
  };

  try {
    menuLinks = await getCachedAllMenuGroupLinks();
  } catch {
    // Keep defaults if DB is unavailable during build/runtime.
  }

  return (
    <>
      <ConditionalHeader menuLinks={menuLinks} />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      <ConditionalFooter />
    </>
  );
}
