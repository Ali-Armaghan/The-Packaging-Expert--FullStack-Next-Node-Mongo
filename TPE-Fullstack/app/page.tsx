import { HomeBelowFold } from "@/components/home/HomeBelowFold";
import { Hero } from "@/components/sections/Hero";
import { getCachedHomeSection } from "@/lib/home/cache";

/** Hybrid home: hero SSR from tagged cache; below-fold via section APIs. */
export const revalidate = 86400;

export default async function HomePage() {
  const hero = await getCachedHomeSection("hero");

  return (
    <div className="route-enter">
      <Hero content={hero} />
      <HomeBelowFold />
    </div>
  );
}
