import { catalogCategories } from "@/constants/catalog";
import { industriesMegaMenuColumns } from "@/constants/industriesMegaMenu";
import { productsMegaMenuGroups } from "@/constants/productsMegaMenu";

export type SearchResultItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  type: "Product" | "Industry" | "Catalog";
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function searchSiteContent(query: string): SearchResultItem[] {
  const q = normalize(query);
  if (!q) return [];

  const results: SearchResultItem[] = [];

  for (const group of productsMegaMenuGroups) {
    for (const item of group.items) {
      const haystack = normalize(`${item.title} ${item.description} ${group.title}`);
      if (haystack.includes(q)) {
        results.push({
          id: `product-${item.id}`,
          title: item.title,
          description: item.description,
          href: item.href,
          type: "Product",
        });
      }
    }
  }

  for (const item of catalogCategories) {
    const haystack = normalize(`${item.title} ${item.description}`);
    if (haystack.includes(q)) {
      const alreadyAdded = results.some(
        (r) => normalize(r.title) === normalize(item.title),
      );
      if (!alreadyAdded) {
        results.push({
          id: `catalog-${item.id}`,
          title: item.title,
          description: item.description,
          href: item.href,
          type: "Catalog",
        });
      }
    }
  }

  for (const column of industriesMegaMenuColumns) {
    for (const item of column) {
      if (item.id === "all") continue;
      const haystack = normalize(item.label);
      if (haystack.includes(q)) {
        results.push({
          id: `industry-${item.id}`,
          title: item.label,
          description: `${item.label} packaging solutions`,
          href: item.href,
          type: "Industry",
        });
      }
    }
  }

  return results.slice(0, 8);
}
