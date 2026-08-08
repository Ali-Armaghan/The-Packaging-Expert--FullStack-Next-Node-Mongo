import { Suspense } from "react";
import { HomeBelowFold } from "@/components/home/HomeBelowFold";
import { Hero } from "@/components/sections/Hero";
import { SitePageSkeleton } from "@/components/ui/SitePageSkeleton";
import { getCachedHomeSection } from "@/lib/home/cache";

/** Hybrid home: hero SSR from tagged cache; below-fold via section APIs. */
export const revalidate = 86400;

async function HomePageContent() {
  const hero = await getCachedHomeSection("hero");

  return (
    <>
      <Hero content={hero} />
      <HomeBelowFold />
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<SitePageSkeleton />}>
      <HomePageContent />
    </Suspense>
  );
}
