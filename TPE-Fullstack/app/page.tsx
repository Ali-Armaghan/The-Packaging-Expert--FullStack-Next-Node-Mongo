import { HomeBelowFold } from "@/components/home/HomeBelowFold";
import { Hero } from "@/components/sections/Hero";
import { ISR_REVALIDATE_SECONDS } from "@/lib/cache/revalidate";
import { getCachedHomeSection } from "@/lib/home/cache";

/** Hybrid home: hero SSR from tagged cache; below-fold via section APIs. */
export const revalidate = ISR_REVALIDATE_SECONDS;

export default async function HomePage() {
  const hero = await getCachedHomeSection("hero");

  return (
    <>
      <Hero content={hero} />
      <HomeBelowFold />
    </>
  );
}
