import type { MenuLinkSlugMap } from "@/types/menuLinks";

/** Pure helper — safe for client components (no Mongo imports). */
export function resolveMenuItemHref(
  links: MenuLinkSlugMap,
  itemId: string,
  fallbackHref: string,
) {
  const slug = links[itemId]?.trim();
  if (!slug) return fallbackHref;
  return `/${slug}`;
}
