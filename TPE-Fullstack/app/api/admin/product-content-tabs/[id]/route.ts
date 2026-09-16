import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/mongoose";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { requirePermission } from "@/lib/auth/session";
import { revalidateProductContentTabs } from "@/lib/productContentTab/revalidate";
import {
  collectItemSlugs,
  serializeContentTab,
  toSectionSubdocs,
  withItemSlugs,
} from "@/lib/productContentTab/serialize";
import { assertUniqueItemSlugs } from "@/lib/productContentTab/unique";
import { slugify } from "@/lib/slug";
import { updateProductContentTabSchema } from "@/lib/validations/productContentTab";
import { ProductContentTab } from "@/models/ProductContentTab";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("products");
    if (error || !session) return error!;

    const { id } = await context.params;
    if (!mongoose.isValidObjectId(id)) return apiError("Tab not found", 404);

    await connectToDatabase();
    const tab = await ProductContentTab.findById(id).lean();
    if (!tab) return apiError("Tab not found", 404);
    return apiSuccess(serializeContentTab(tab));
  } catch (error) {
    return apiFromUnknownError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("products");
    if (error || !session) return error!;

    const { id } = await context.params;
    if (!mongoose.isValidObjectId(id)) return apiError("Tab not found", 404);

    const body = await request.json();
    const payload = updateProductContentTabSchema.parse(body);

    await connectToDatabase();
    const tab = await ProductContentTab.findById(id);
    if (!tab) return apiError("Tab not found", 404);

    if (payload.name !== undefined) tab.name = payload.name;
    if (payload.sortOrder !== undefined) tab.sortOrder = payload.sortOrder;
    if (payload.isActive !== undefined) tab.isActive = payload.isActive;
    if (payload.slug !== undefined || payload.name !== undefined) {
      const slug = slugify(payload.slug || payload.name || tab.name);
      if (!slug) return apiError("A valid name or slug is required", 400);
      const clash = await ProductContentTab.findOne({
        slug,
        _id: { $ne: tab._id },
      });
      if (clash) return apiError("A tab with this slug already exists", 409);
      tab.slug = slug;
    }
    if (payload.sections !== undefined) {
      const sections = withItemSlugs(payload.sections);
      try {
        await assertUniqueItemSlugs(collectItemSlugs(sections), id);
      } catch (slugError) {
        return apiError(
          slugError instanceof Error ? slugError.message : "Invalid item slug",
          409,
        );
      }
      tab.set("sections", toSectionSubdocs(sections));
    }

    await tab.save();
    revalidateProductContentTabs();
    return apiSuccess(serializeContentTab(tab.toObject()));
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("products");
    if (error || !session) return error!;

    const { id } = await context.params;
    if (!mongoose.isValidObjectId(id)) return apiError("Tab not found", 404);

    await connectToDatabase();
    const tab = await ProductContentTab.findByIdAndDelete(id);
    if (!tab) return apiError("Tab not found", 404);

    revalidateProductContentTabs();
    return apiSuccess({ id });
  } catch (error) {
    return apiFromUnknownError(error);
  }
}
