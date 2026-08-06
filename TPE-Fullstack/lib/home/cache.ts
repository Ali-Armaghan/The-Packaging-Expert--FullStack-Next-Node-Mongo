import { unstable_cache } from "next/cache";
import { HOME_PAGE_TAG, homeSectionTag } from "@/lib/cache/tags";
import { getHomePageContent, getHomeSection } from "@/lib/home/queries";
import type { HomePageContent, HomeSectionKey } from "@/types/homePage";

const REVALIDATE_SECONDS = 3600;

export function getCachedHomeSection<K extends HomeSectionKey>(
  section: K,
): Promise<HomePageContent[K]> {
  return unstable_cache(
    async () => getHomeSection(section),
    ["home-section", section],
    {
      tags: [homeSectionTag(section), HOME_PAGE_TAG],
      revalidate: REVALIDATE_SECONDS,
    },
  )();
}

export function getCachedHomePageContent() {
  return unstable_cache(
    async () => getHomePageContent(),
    ["home-page-full"],
    {
      tags: [HOME_PAGE_TAG],
      revalidate: REVALIDATE_SECONDS,
    },
  )();
}
