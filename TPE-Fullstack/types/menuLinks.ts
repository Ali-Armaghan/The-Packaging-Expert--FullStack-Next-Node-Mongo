export const MENU_LINK_KEYS = ["industries", "styles", "products"] as const;
export type MenuLinkKey = (typeof MENU_LINK_KEYS)[number];

/** itemId → GroupBy slug (empty string = no link / use default href) */
export type MenuLinkSlugMap = Record<string, string>;

export type MenuGroupLinksContent = {
  industries: MenuLinkSlugMap;
  styles: MenuLinkSlugMap;
  products: MenuLinkSlugMap;
};

export type MenuCatalogItem = {
  id: string;
  title: string;
  href: string;
  description?: string;
};

export function isMenuLinkKey(value: string): value is MenuLinkKey {
  return (MENU_LINK_KEYS as readonly string[]).includes(value);
}
