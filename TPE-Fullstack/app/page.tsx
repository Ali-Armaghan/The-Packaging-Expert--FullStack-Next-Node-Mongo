import { HomeBelowFold } from "@/components/home/HomeBelowFold";
import { Hero } from "@/components/sections/Hero";
import { getCachedHomeSection } from "@/lib/home/cache";

/** Hybrid home: hero SSR from tagged cache; below-fold via section APIs. */
export const revalidate = 3600;

export default async function HomePage() {
  const hero = await getCachedHomeSection("hero");

  return (
    <>
      <Hero content={hero} />
      <HomeBelowFold />
    </>
  );
}
