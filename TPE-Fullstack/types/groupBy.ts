import type {
  EliteBelowFoldKey,
  ElitePageContent,
  EliteSectionKey,
} from "@/types/elitePage";

export type GroupBySectionKey = EliteSectionKey;
export type GroupByBelowFoldKey = EliteBelowFoldKey;

/** Catalog meta stored on GroupBy — products come from Product collection. */
export type GroupByCatalogMeta = Omit<ElitePageContent["catalog"], "products">;

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
