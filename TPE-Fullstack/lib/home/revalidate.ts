import { revalidatePath, revalidateTag } from "next/cache";
import { HOME_PAGE_TAG, homeSectionTag } from "@/lib/cache/tags";
import { HOME_SECTIONS, type HomeSectionKey } from "@/types/homePage";

const IMMEDIATE = { expire: 0 } as const;

export function revalidateHomeSection(section: HomeSectionKey) {
  revalidateTag(homeSectionTag(section), IMMEDIATE);
  // Hero is SSR'd into `/` — path revalidate keeps the first paint fresh.
  if (section === "hero") {
    revalidatePath("/");
  }
}

export function revalidateAllHomeSections() {
  for (const section of HOME_SECTIONS) {
    revalidateTag(homeSectionTag(section), IMMEDIATE);
  }
  revalidateTag(HOME_PAGE_TAG, IMMEDIATE);
  revalidatePath("/");
}
