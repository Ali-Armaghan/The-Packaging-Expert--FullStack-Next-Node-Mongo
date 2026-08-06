import { connectToDatabase } from "@/lib/db/mongoose";
import { MenuGroupLink } from "@/models/MenuGroupLink";
import { GroupBy } from "@/models/GroupBy";
import type { MenuLinkKey, MenuLinkSlugMap } from "@/types/menuLinks";

export { resolveMenuItemHref } from "@/lib/menuLinks/resolve";

function mapToObject(
  links: Map<string, string> | Record<string, string> | null | undefined,
): MenuLinkSlugMap {
  if (!links) return {};
  if (links instanceof Map) {
    return Object.fromEntries(
      Array.from(links.entries()).map(([key, value]) => [
        key,
        String(value ?? "").trim().toLowerCase(),
      ]),
    );
  }
  const out: MenuLinkSlugMap = {};
  for (const [key, value] of Object.entries(links)) {
    out[key] = String(value ?? "").trim().toLowerCase();
  }
  return out;
}

export async function getMenuGroupLinks(
  menuKey: MenuLinkKey,
): Promise<MenuLinkSlugMap> {
  await connectToDatabase();
  const doc = await MenuGroupLink.findOne({ menuKey }).lean();
  return mapToObject(
    doc?.links as Map<string, string> | Record<string, string> | undefined,
  );
}

export async function getAllMenuGroupLinks(): Promise<
  Record<MenuLinkKey, MenuLinkSlugMap>
> {
  await connectToDatabase();
  const docs = await MenuGroupLink.find({}).lean();
  const result: Record<MenuLinkKey, MenuLinkSlugMap> = {
    industries: {},
    styles: {},
    products: {},
  };
  for (const doc of docs) {
    const key = doc.menuKey as MenuLinkKey;
    if (key in result) {
      result[key] = mapToObject(
        doc.links as Map<string, string> | Record<string, string> | undefined,
      );
    }
  }
  return result;
}

export async function saveMenuGroupLinks(
  menuKey: MenuLinkKey,
  links: MenuLinkSlugMap,
) {
  await connectToDatabase();

  const cleaned: MenuLinkSlugMap = {};
  const slugs = Object.values(links)
    .map((slug) => slug.trim().toLowerCase())
    .filter(Boolean);

  const validSlugSet = new Set<string>();
  if (slugs.length) {
    const groups = await GroupBy.find({
      slug: { $in: slugs },
      isActive: true,
    })
      .select({ slug: 1 })
      .lean();
    for (const group of groups) {
      validSlugSet.add(group.slug);
    }
  }

  for (const [itemId, slug] of Object.entries(links)) {
    const normalized = slug.trim().toLowerCase();
    if (!normalized) continue;
    if (!validSlugSet.has(normalized)) continue;
    cleaned[itemId] = normalized;
  }

  await MenuGroupLink.findOneAndUpdate(
    { menuKey },
    { $set: { links: cleaned } },
    { upsert: true, new: true },
  );

  return cleaned;
}
