import { connectToDatabase } from "@/lib/db/mongoose";
import { ProductContentTab } from "@/models/ProductContentTab";
import {
  serializeContentTab,
  type SerializedContentItem,
  type SerializedContentTab,
} from "./serialize";

export type ContentItemPage = {
  tab: { id: string; name: string; slug: string };
  section: { id: string; title: string };
  item: SerializedContentItem;
};

export async function findContentItemBySlug(
  slug: string,
): Promise<ContentItemPage | null> {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return null;

  await connectToDatabase();
  const doc = await ProductContentTab.findOne({ isActive: true })
    .where("sections.items.slug")
    .equals(normalized)
    .lean();
  if (!doc) return null;

  const tab = serializeContentTab(doc);
  for (const section of tab.sections) {
    if (!section.isActive) continue;
    const item = section.items.find(
      (entry) => entry.isActive && entry.slug === normalized,
    );
    if (item) {
      return {
        tab: { id: tab.id, name: tab.name, slug: tab.slug },
        section: { id: section.id, title: section.title },
        item,
      };
    }
  }
  return null;
}

export async function listContentItemSlugs(limit = 80): Promise<string[]> {
  await connectToDatabase();
  const tabs = await ProductContentTab.find({ isActive: true })
    .sort({ sortOrder: 1 })
    .lean();
  const slugs: string[] = [];
  for (const doc of tabs) {
    const tab = serializeContentTab(doc);
    for (const section of tab.sections) {
      if (!section.isActive) continue;
      for (const item of section.items) {
        if (item.isActive && item.slug) slugs.push(item.slug);
        if (slugs.length >= limit) return slugs;
      }
    }
  }
  return slugs;
}

export async function listContentTabs(): Promise<SerializedContentTab[]> {
  await connectToDatabase();
  const tabs = await ProductContentTab.find({})
    .sort({ sortOrder: 1, name: 1 })
    .lean();
  return tabs.map(serializeContentTab);
}
