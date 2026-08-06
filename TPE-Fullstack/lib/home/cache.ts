import { unstable_cache } from "next/cache";
import { ISR_REVALIDATE_SECONDS } from "@/lib/cache/revalidate";
import { HOME_PAGE_TAG, homeSectionTag } from "@/lib/cache/tags";
import { getHomePageContent, getHomeSection } from "@/lib/home/queries";
import type { HomePageContent, HomeSectionKey } from "@/types/homePage";

export function getCachedHomeSection<K extends HomeSectionKey>(
  section: K,
): Promise<HomePageContent[K]> {
  return unstable_cache(
    async () => getHomeSection(section),
    ["home-section", section],
    {
      tags: [homeSectionTag(section), HOME_PAGE_TAG],
      revalidate: ISR_REVALIDATE_SECONDS,
    },
  )();
}

export function getCachedHomePageContent() {
  return unstable_cache(
    async () => getHomePageContent(),
    ["home-page-full"],
    {
      tags: [HOME_PAGE_TAG],
      revalidate: ISR_REVALIDATE_SECONDS,
    },
  )();
}
