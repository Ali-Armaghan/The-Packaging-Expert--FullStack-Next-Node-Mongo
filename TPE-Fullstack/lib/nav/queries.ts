import { connectToDatabase } from "@/lib/db/mongoose";
import {
  getDefaultBlogHeaderSeed,
  serializeNavMenuItem,
  toBlogHeaderNavItem,
  type SerializedNavMenuItem,
} from "@/lib/nav/serialize";
import type { BlogHeaderNavItem } from "@/constants/blogHeader";
import { blogHeaderNavItems } from "@/constants/blogHeader";
import { NavMenuItem, type NavMenuLocation } from "@/models/NavMenuItem";

export async function ensureBlogHeaderNavSeeded() {
  await connectToDatabase();
  const count = await NavMenuItem.countDocuments({ location: "blog-header" });
  if (count > 0) return;

  const seed = getDefaultBlogHeaderSeed();
  await NavMenuItem.insertMany(seed);
}

export async function getAdminNavMenuItems(
  location: NavMenuLocation = "blog-header",
): Promise<SerializedNavMenuItem[]> {
  await connectToDatabase();
  if (location === "blog-header") {
    await ensureBlogHeaderNavSeeded();
  }

  const docs = await NavMenuItem.find({ location })
    .sort({ sortOrder: 1, createdAt: 1 })
    .lean();

  return docs.map(serializeNavMenuItem);
}

export async function getPublicBlogHeaderNav(): Promise<BlogHeaderNavItem[]> {
  try {
    await connectToDatabase();
    await ensureBlogHeaderNavSeeded();

    const docs = await NavMenuItem.find({
      location: "blog-header",
      isActive: true,
    })
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();

    if (!docs.length) return blogHeaderNavItems;

    return docs
      .map(serializeNavMenuItem)
      .map(toBlogHeaderNavItem)
      .filter((item) => item.label && item.href);
  } catch {
    return blogHeaderNavItems;
  }
}
