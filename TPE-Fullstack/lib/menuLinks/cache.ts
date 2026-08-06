import { unstable_cache } from "next/cache";
import { ISR_REVALIDATE_SECONDS } from "@/lib/cache/revalidate";
import {
  getAllMenuGroupLinks,
  getMenuGroupLinks,
} from "@/lib/menuLinks/queries";
import type { MenuLinkKey } from "@/types/menuLinks";

export function menuLinksTag(menuKey?: MenuLinkKey) {
  return menuKey ? `menu-links-${menuKey}` : "menu-links-all";
}

export function getCachedMenuGroupLinks(menuKey: MenuLinkKey) {
  return unstable_cache(
    async () => getMenuGroupLinks(menuKey),
    ["menu-group-links", menuKey],
    {
      tags: [menuLinksTag(menuKey), menuLinksTag()],
      revalidate: ISR_REVALIDATE_SECONDS,
    },
  )();
}

export function getCachedAllMenuGroupLinks() {
  return unstable_cache(
    async () => getAllMenuGroupLinks(),
    ["menu-group-links-all"],
    {
      tags: [menuLinksTag()],
      revalidate: ISR_REVALIDATE_SECONDS,
    },
  )();
}
