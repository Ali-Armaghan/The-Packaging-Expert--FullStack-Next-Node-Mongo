import { resolveMenuItemHref } from "@/lib/menuLinks/resolve";
import type { MenuHubContent } from "@/types/menuHub";
import type { MenuLinkKey, MenuLinkSlugMap } from "@/types/menuLinks";
import type { IndustryMegaMenuItem } from "@/constants/industriesMegaMenu";
import type { MegaMenuGroup, MegaMenuItem } from "@/constants/productsMegaMenu";

export function applyLinksToHubContent(
  content: MenuHubContent,
  links: MenuLinkSlugMap,
): MenuHubContent {
  return {
    ...content,
    sections: content.sections.map((section) => ({
      ...section,
      items: section.items.map((item) => ({
        ...item,
        href: resolveMenuItemHref(links, item.id, item.href),
      })),
    })),
  };
}

export function applyLinksToIndustryColumns(
  columns: IndustryMegaMenuItem[][],
  links: MenuLinkSlugMap,
): IndustryMegaMenuItem[][] {
  return columns.map((column) =>
    column.map((item) => ({
      ...item,
      href: resolveMenuItemHref(links, item.id, item.href),
    })),
  );
}

export function applyLinksToMegaItems(
  items: MegaMenuItem[],
  links: MenuLinkSlugMap,
): MegaMenuItem[] {
  return items.map((item) => ({
    ...item,
    href: resolveMenuItemHref(links, item.id, item.href),
  }));
}

export function applyLinksToMegaGroups(
  groups: MegaMenuGroup[],
  links: MenuLinkSlugMap,
): MegaMenuGroup[] {
  return groups.map((group) => ({
    ...group,
    items: applyLinksToMegaItems(group.items, links),
  }));
}

export type PublicMenuLinks = Record<MenuLinkKey, MenuLinkSlugMap>;
