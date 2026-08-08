import { Suspense, type ReactNode, ViewTransition } from "react";
import { ConditionalFooter } from "@/components/layout/Footer";
import { ConditionalHeader } from "@/components/layout/Header";
import { getCachedAllMenuGroupLinks } from "@/lib/menuLinks/cache";
import type { PublicMenuLinks } from "@/lib/menuLinks/apply";

async function SiteHeader() {
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

  return <ConditionalHeader menuLinks={menuLinks} />;
}

/** Sync chrome so route shells (e.g. blog header) can stream immediately. */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <SiteHeader />
      </Suspense>
      <main className="flex min-h-0 flex-1 flex-col">
        <ViewTransition
          enter="page-fade"
          exit="page-fade"
          default="none"
        >
          {children}
        </ViewTransition>
      </main>
      <ConditionalFooter />
    </>
  );
}
