import mongoose, { type Types } from "mongoose";
import { slugify } from "@/lib/slug";
import { ProductContentTab } from "@/models/ProductContentTab";
import {
  serializeContentTab,
  type SerializedContentItem,
  type SerializedContentSection,
  type SerializedContentTab,
} from "./serialize";
import { assertUniqueItemSlugs } from "./unique";
import { revalidateProductContentTabs } from "./revalidate";

type ItemSubdoc = {
  title: string;
  slug: string;
  image: string;
  body: string;
  isActive: boolean;
  sortOrder: number;
};

type SectionSubdoc = {
  title: string;
  isActive: boolean;
  sortOrder: number;
  items: Types.DocumentArray<ItemSubdoc>;
};

export class ContentTabError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export async function getContentTab(id: string): Promise<SerializedContentTab> {
  if (!mongoose.isValidObjectId(id)) {
    throw new ContentTabError("Tab not found", 404);
  }
  const tab = await ProductContentTab.findById(id);
  if (!tab) throw new ContentTabError("Tab not found", 404);
  return serializeContentTab(tab.toObject());
}

async function loadTabDoc(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new ContentTabError("Tab not found", 404);
  }
  const tab = await ProductContentTab.findById(id);
  if (!tab) throw new ContentTabError("Tab not found", 404);
  return tab;
}

function asSections(tab: Awaited<ReturnType<typeof loadTabDoc>>) {
  return tab.sections as unknown as Types.DocumentArray<SectionSubdoc>;
}

function requireSection(
  tab: Awaited<ReturnType<typeof loadTabDoc>>,
  sectionId: string,
) {
  const section = asSections(tab).id(sectionId);
  if (!section) throw new ContentTabError("Section not found", 404);
  return section;
}

function requireItem(
  tab: Awaited<ReturnType<typeof loadTabDoc>>,
  sectionId: string,
  itemId: string,
) {
  const section = requireSection(tab, sectionId);
  const item = section.items.id(itemId);
  if (!item) throw new ContentTabError("Item not found", 404);
  return { section, item };
}

function slugTakenInTab(
  tab: Awaited<ReturnType<typeof loadTabDoc>>,
  slug: string,
  excludeItemId?: string,
) {
  for (const section of asSections(tab)) {
    for (const item of section.items) {
      if (excludeItemId && String(item._id) === excludeItemId) continue;
      if (item.slug === slug) return true;
    }
  }
  return false;
}

async function ensureItemSlugAvailable(
  tab: Awaited<ReturnType<typeof loadTabDoc>>,
  slug: string,
  excludeItemId?: string,
) {
  if (slugTakenInTab(tab, slug, excludeItemId)) {
    throw new ContentTabError("An item with this slug already exists", 409);
  }
  try {
    await assertUniqueItemSlugs([slug], String(tab._id));
  } catch (error) {
    throw new ContentTabError(
      error instanceof Error ? error.message : "Invalid item slug",
      409,
    );
  }
}

export async function addContentSection(
  tabId: string,
  input: { title: string; isActive?: boolean },
): Promise<{ tab: SerializedContentTab; section: SerializedContentSection }> {
  const tab = await loadTabDoc(tabId);
  asSections(tab).push({
    title: input.title.trim(),
    isActive: input.isActive ?? true,
    sortOrder: tab.sections.length,
    items: [],
  });
  await tab.save();
  revalidateProductContentTabs();
  const saved = serializeContentTab(tab.toObject());
  const section = saved.sections[saved.sections.length - 1];
  if (!section) throw new ContentTabError("Section could not be created");
  return { tab: saved, section };
}

export async function updateContentSection(
  tabId: string,
  sectionId: string,
  input: { title?: string; isActive?: boolean; sortOrder?: number },
) {
  const tab = await loadTabDoc(tabId);
  const section = requireSection(tab, sectionId);
  if (input.title !== undefined) section.title = input.title.trim();
  if (input.isActive !== undefined) section.isActive = input.isActive;
  if (input.sortOrder !== undefined) section.sortOrder = input.sortOrder;
  await tab.save();
  revalidateProductContentTabs();
  return serializeContentTab(tab.toObject());
}

export async function deleteContentSection(tabId: string, sectionId: string) {
  const tab = await loadTabDoc(tabId);
  const section = requireSection(tab, sectionId);
  section.deleteOne();
  await tab.save();
  revalidateProductContentTabs();
  return serializeContentTab(tab.toObject());
}

export async function addContentItem(
  tabId: string,
  sectionId: string,
  input: {
    title: string;
    slug?: string;
    image?: string;
    body?: string;
    isActive?: boolean;
  },
): Promise<{ tab: SerializedContentTab; item: SerializedContentItem }> {
  const tab = await loadTabDoc(tabId);
  const section = requireSection(tab, sectionId);
  const slug = slugify(input.slug || input.title);
  if (!slug) throw new ContentTabError("A valid item name or slug is required");
  await ensureItemSlugAvailable(tab, slug);
  section.items.push({
    title: input.title.trim(),
    slug,
    image: input.image ?? "",
    body: input.body ?? "",
    isActive: input.isActive ?? true,
    sortOrder: section.items.length,
  });
  await tab.save();
  revalidateProductContentTabs();
  const saved = serializeContentTab(tab.toObject());
  const savedSection = saved.sections.find((row) => row.id === sectionId);
  const item =
    savedSection?.items.find((row) => row.slug === slug) ??
    savedSection?.items[savedSection.items.length - 1];
  if (!item) throw new ContentTabError("Item could not be created");
  return { tab: saved, item };
}

export async function updateContentItem(
  tabId: string,
  sectionId: string,
  itemId: string,
  input: {
    title?: string;
    slug?: string;
    image?: string;
    body?: string;
    isActive?: boolean;
    sortOrder?: number;
  },
) {
  const tab = await loadTabDoc(tabId);
  const { item } = requireItem(tab, sectionId, itemId);

  if (input.title !== undefined) item.title = input.title.trim();
  if (input.image !== undefined) item.image = input.image;
  if (input.body !== undefined) item.body = input.body;
  if (input.isActive !== undefined) item.isActive = input.isActive;
  if (input.sortOrder !== undefined) item.sortOrder = input.sortOrder;
  if (input.slug !== undefined || input.title !== undefined) {
    const slug = slugify(input.slug || input.title || item.slug || item.title);
    if (!slug) throw new ContentTabError("A valid item name or slug is required");
    if (slug !== item.slug) {
      await ensureItemSlugAvailable(tab, slug, itemId);
    }
    item.slug = slug;
  }

  await tab.save();
  revalidateProductContentTabs();
  return serializeContentTab(tab.toObject());
}

export async function deleteContentItem(
  tabId: string,
  sectionId: string,
  itemId: string,
) {
  const tab = await loadTabDoc(tabId);
  const { item } = requireItem(tab, sectionId, itemId);
  item.deleteOne();
  await tab.save();
  revalidateProductContentTabs();
  return serializeContentTab(tab.toObject());
}
