import { slugify } from "@/lib/slug";
import mongoose from "mongoose";

export type SerializedContentItem = {
  id: string;
  title: string;
  slug: string;
  image: string;
  body: string;
  sortOrder: number;
  isActive: boolean;
};

export type SerializedContentSection = {
  id: string;
  title: string;
  sortOrder: number;
  isActive: boolean;
  items: SerializedContentItem[];
};

export type SerializedContentTab = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  sections: SerializedContentSection[];
};

type ItemLean = {
  _id?: { toString(): string };
  title?: string | null;
  slug?: string | null;
  image?: string | null;
  body?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
};

type SectionLean = {
  _id?: { toString(): string };
  title?: string | null;
  body?: string | null;
  image?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  items?: ItemLean[] | null;
};

type TabLean = {
  _id: { toString(): string };
  name: string;
  slug: string;
  sortOrder?: number | null;
  isActive?: boolean | null;
  sections?: SectionLean[] | null;
};

function subId(value: { toString(): string } | undefined, fallback: string) {
  return value ? String(value) : fallback;
}

export function serializeContentItem(
  item: ItemLean,
  index = 0,
): SerializedContentItem {
  return {
    id: subId(item._id, `item-${index}`),
    title: item.title ?? "",
    slug: item.slug ?? "",
    image: item.image ?? "",
    body: item.body ?? "",
    sortOrder: item.sortOrder ?? index,
    isActive: item.isActive ?? true,
  };
}

export function serializeContentSection(
  section: SectionLean,
  index = 0,
): SerializedContentSection {
  const nestedItems = [...(section.items ?? [])]
    .map((item, itemIndex) => serializeContentItem(item, itemIndex))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (nestedItems.length === 0 && (section.body || section.image)) {
    nestedItems.push({
      id: subId(section._id, `legacy-${index}`),
      title: section.title ?? "Overview",
      slug: "",
      image: section.image ?? "",
      body: section.body ?? "",
      sortOrder: 0,
      isActive: true,
    });
  }

  return {
    id: subId(section._id, `section-${index}`),
    title: section.title ?? "",
    sortOrder: section.sortOrder ?? index,
    isActive: section.isActive ?? true,
    items: nestedItems,
  };
}

export function serializeContentTab(doc: TabLean): SerializedContentTab {
  const sections = [...(doc.sections ?? [])]
    .map((section, index) => serializeContentSection(section, index))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    sortOrder: doc.sortOrder ?? 0,
    isActive: doc.isActive ?? true,
    sections,
  };
}

function toObjectId(id?: string) {
  const trimmed = id?.trim();
  if (!trimmed || !mongoose.Types.ObjectId.isValid(trimmed)) return undefined;
  return new mongoose.Types.ObjectId(trimmed);
}

export function toItemSubdocs(
  items: Array<{
    id?: string;
    title: string;
    slug?: string;
    image?: string;
    body?: string;
    sortOrder?: number;
    isActive?: boolean;
  }>,
) {
  return items.map((item, index) => {
    const _id = toObjectId(item.id);
    return {
      ...(_id ? { _id } : {}),
      title: item.title,
      slug: item.slug ?? "",
      image: item.image ?? "",
      body: item.body ?? "",
      sortOrder: item.sortOrder ?? index,
      isActive: item.isActive ?? true,
    };
  });
}

export function toSectionSubdocs(
  sections: Array<{
    id?: string;
    title: string;
    sortOrder?: number;
    isActive?: boolean;
    items?: Array<{
      id?: string;
      title: string;
      slug?: string;
      image?: string;
      body?: string;
      sortOrder?: number;
      isActive?: boolean;
    }>;
  }>,
) {
  return sections.map((section, index) => {
    const _id = toObjectId(section.id);
    return {
      ...(_id ? { _id } : {}),
      title: section.title,
      sortOrder: section.sortOrder ?? index,
      isActive: section.isActive ?? true,
      items: toItemSubdocs(section.items ?? []),
    };
  });
}

export function withItemSlugs<
  T extends {
    items?: Array<{ title: string; slug?: string }>;
  },
>(sections: T[]) {
  return sections.map((section) => ({
    ...section,
    items: (section.items ?? []).map((item) => ({
      ...item,
      slug: slugify(item.slug || item.title),
    })),
  }));
}

export function collectItemSlugs(
  sections: Array<{ items?: Array<{ title: string; slug?: string }> }>,
) {
  const slugs: string[] = [];
  for (const section of sections) {
    for (const item of section.items ?? []) {
      const slug = slugify(item.slug || item.title);
      if (!slug) continue;
      if (slugs.includes(slug)) {
        throw new Error(`Duplicate item slug: ${slug}`);
      }
      slugs.push(slug);
    }
  }
  return slugs;
}
