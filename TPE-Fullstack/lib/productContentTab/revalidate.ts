import { revalidateTag } from "next/cache";
import { PRODUCT_INDEX_TAG, PRODUCT_INFO_TABS_TAG } from "@/lib/cache/tags";

const IMMEDIATE = { expire: 0 } as const;

export function revalidateProductContentTabs() {
  revalidateTag(PRODUCT_INFO_TABS_TAG, IMMEDIATE);
  revalidateTag(PRODUCT_INDEX_TAG, IMMEDIATE);
}
