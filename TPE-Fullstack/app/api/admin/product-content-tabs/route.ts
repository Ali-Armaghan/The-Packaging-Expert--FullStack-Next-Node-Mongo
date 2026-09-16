import { connectToDatabase } from "@/lib/db/mongoose";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { requirePermission } from "@/lib/auth/session";
import { DEFAULT_PRODUCT_CONTENT_TABS } from "@/lib/productContentTab/defaults";
import { revalidateProductContentTabs } from "@/lib/productContentTab/revalidate";
import {
  collectItemSlugs,
  serializeContentTab,
  toSectionSubdocs,
  withItemSlugs,
} from "@/lib/productContentTab/serialize";
import { assertUniqueItemSlugs } from "@/lib/productContentTab/unique";
import { slugify } from "@/lib/slug";
import { createProductContentTabSchema } from "@/lib/validations/productContentTab";
import { ProductContentTab } from "@/models/ProductContentTab";

async function ensureDefaultTabs() {
  const count = await ProductContentTab.countDocuments();
  if (count === 0) {
    await ProductContentTab.insertMany(
      DEFAULT_PRODUCT_CONTENT_TABS.map((tab) => ({
        name: tab.name,
        slug: tab.slug,
        sortOrder: tab.sortOrder,
        isActive: true,
        sections: tab.sections.map((section) => ({
          title: section.title,
          sortOrder: section.sortOrder,
          isActive: true,
          items: section.items,
        })),
      })),
    );
    return;
  }

  const materials = DEFAULT_PRODUCT_CONTENT_TABS[0];
  const existing = await ProductContentTab.findOne({ slug: materials.slug });
  if (existing) return;
  await ProductContentTab.create({
    name: materials.name,
    slug: materials.slug,
    sortOrder: materials.sortOrder,
    isActive: true,
    sections: materials.sections.map((section) => ({
      title: section.title,
      sortOrder: section.sortOrder,
      isActive: true,
      items: section.items,
    })),
  });
}

export async function GET() {
  try {
    const { error, session } = await requirePermission("products");
    if (error || !session) return error!;

    await connectToDatabase();
    await ensureDefaultTabs();

    const tabs = await ProductContentTab.find({})
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    return apiSuccess(tabs.map(serializeContentTab));
  } catch (error) {
    return apiFromUnknownError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { error, session } = await requirePermission("products");
    if (error || !session) return error!;

    const body = await request.json();
    const payload = createProductContentTabSchema.parse(body);
    const slug = slugify(payload.slug || payload.name);
    if (!slug) return apiError("A valid name or slug is required", 400);

    await connectToDatabase();
    const existing = await ProductContentTab.findOne({ slug });
    if (existing) {
      return apiError("A tab with this slug already exists", 409);
    }

    const sections = withItemSlugs(payload.sections ?? []);
    try {
      await assertUniqueItemSlugs(collectItemSlugs(sections));
    } catch (slugError) {
      return apiError(
        slugError instanceof Error ? slugError.message : "Invalid item slug",
        409,
      );
    }

    const tab = await ProductContentTab.create({
      name: payload.name,
      slug,
      sortOrder: payload.sortOrder ?? 0,
      isActive: payload.isActive ?? true,
      sections: toSectionSubdocs(sections),
    });

    revalidateProductContentTabs();
    return apiSuccess(serializeContentTab(tab.toObject()), 201);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}
