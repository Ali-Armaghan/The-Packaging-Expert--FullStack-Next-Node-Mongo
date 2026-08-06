import type {
  EliteBelowFoldKey,
  ElitePageContent,
  EliteSectionKey,
} from "@/types/elitePage";

export type GroupBySectionKey = EliteSectionKey;
export type GroupByBelowFoldKey = EliteBelowFoldKey;

/** Catalog tab stored on GroupBy — product cards resolved from Product IDs. */
export type GroupByCatalogTab = {
  id: string;
  label: string;
  productIds: string[];
};

/** Catalog meta stored on GroupBy — no embedded product cards. */
export type GroupByCatalogMeta = {
  eyebrow: string;
  title: string;
  description: string;
  viewAllHref: string;
  viewAllLabel: string;
  tabs: GroupByCatalogTab[];
};

export type GroupByContent = Omit<ElitePageContent, "catalog"> & {
  catalog: GroupByCatalogMeta;
};

export type SerializedGroupBy = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  content: GroupByContent;
  createdAt?: string;
  updatedAt?: string;
};

export type SerializedGroupByListItem = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  updatedAt?: string;
};
