import { Suspense, type ReactNode } from "react";
import { ConditionalFooter } from "@/components/layout/Footer";
import { ConditionalHeader } from "@/components/layout/Header";
import { getCachedAllMenuGroupLinks } from "@/lib/menuLinks/cache";
import type { PublicMenuLinks } from "@/lib/menuLinks/apply";

const EMPTY_MENU_LINKS: PublicMenuLinks = {
  industries: {},
  styles: {},
  products: {},
};

async function SiteHeader() {
  let menuLinks: PublicMenuLinks = EMPTY_MENU_LINKS;

  try {
    menuLinks = await getCachedAllMenuGroupLinks();
  } catch {
    // Keep defaults if DB is unavailable during build/runtime.
  }

  return <ConditionalHeader menuLinks={menuLinks} />;
}

/** Sync chrome — header fallback prevents blank/header pop glitches. */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={<ConditionalHeader menuLinks={EMPTY_MENU_LINKS} />}>
        <SiteHeader />
      </Suspense>
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      <ConditionalFooter />
    </>
  );
}
