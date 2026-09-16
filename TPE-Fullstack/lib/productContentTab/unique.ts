import mongoose from "mongoose";
import { ProductContentTab } from "@/models/ProductContentTab";

export async function assertUniqueItemSlugs(
  slugs: string[],
  excludeTabId?: string,
) {
  if (slugs.length === 0) return;
  const query = ProductContentTab.findOne({}).where("sections.items.slug").in(slugs);
  if (excludeTabId && mongoose.Types.ObjectId.isValid(excludeTabId)) {
    query.where("_id").ne(excludeTabId);
  }
  const clash = await query.lean();
  if (clash) {
    throw new Error("An item with this slug already exists in another tab");
  }
}
