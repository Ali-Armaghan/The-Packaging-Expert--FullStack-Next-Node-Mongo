import { categoryByStyleGroup } from "@/constants/categoryByStyleMenu";
import { industriesMegaMenuColumns } from "@/constants/industriesMegaMenu";
import { productsMegaMenuGroups } from "@/constants/productsMegaMenu";
import type { MenuCatalogItem, MenuLinkKey } from "@/types/menuLinks";

/** Static menu rows shown in admin + used as defaults on the public site. */
export function getMenuCatalog(menuKey: MenuLinkKey): MenuCatalogItem[] {
  if (menuKey === "industries") {
    return industriesMegaMenuColumns
      .flat()
      .filter((item) => item.id !== "all")
      .map((item) => ({
        id: item.id,
        title: item.label,
        href: item.href,
      }));
  }

  if (menuKey === "styles") {
    return categoryByStyleGroup.items.map((item) => ({
      id: item.id,
      title: item.title,
      href: item.href,
      description: item.description,
    }));
  }

  return productsMegaMenuGroups.flatMap((group) =>
    group.items.map((item) => ({
      id: item.id,
      title: item.title,
      href: item.href,
      description: item.description,
    })),
  );
}

export const MENU_LINK_LABELS: Record<MenuLinkKey, string> = {
  industries: "Industries",
  styles: "Styles",
  products: "Category",
};
