import { HomeBelowFold } from "@/components/home/HomeBelowFold";
import { Hero } from "@/components/sections/Hero";
import { getCachedHomeSection } from "@/lib/home/cache";

/** Legacy home experience — preserved at /home1 */
export const revalidate = 86400;

export default async function Home1Page() {
  const hero = await getCachedHomeSection("hero");
  const heroImage = hero.image || "/images/hero-packaging.png";
  const logoImage = "/images/logo/TPE-PNG-LS.png";

  return (
    <div className="route-enter">
      <link
        rel="preload"
        as="image"
        href={heroImage}
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={logoImage}
        fetchPriority="high"
      />
      <Hero content={hero} />
      <HomeBelowFold />
    </div>
  );
}
