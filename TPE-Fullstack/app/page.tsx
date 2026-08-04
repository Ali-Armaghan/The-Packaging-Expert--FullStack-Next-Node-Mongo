import { HomeBelowFold } from "@/components/home/HomeBelowFold";
import { Hero } from "@/components/sections/Hero";
import { getHomeSection } from "@/lib/home/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Banner first — only hero blocks the initial paint.
  const hero = await getHomeSection("hero");

  return (
    <>
      <Hero content={hero} />
      <HomeBelowFold />
    </>
  );
}
