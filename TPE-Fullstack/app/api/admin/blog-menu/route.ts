import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db/mongoose";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { requirePermission } from "@/lib/auth/session";
import { revalidateBlogNav } from "@/lib/blog/revalidate";
import {
  ensureBlogHeaderNavSeeded,
  getAdminNavMenuItems,
} from "@/lib/nav/queries";
import { serializeNavMenuItem } from "@/lib/nav/serialize";
import {
  createNavMenuItemSchema,
  reorderNavMenuSchema,
} from "@/lib/validations/navMenu";
import { NavMenuItem } from "@/models/NavMenuItem";

export async function GET() {
  try {
    const { error, session } = await requirePermission("blog-menu");
    if (error || !session) return error!;

    const items = await getAdminNavMenuItems("blog-header");
    return apiSuccess(items);
  } catch (error) {
    return apiFromUnknownError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { error, session } = await requirePermission("blog-menu");
    if (error || !session) return error!;

    const body = await request.json();
    const payload = createNavMenuItemSchema.parse(body);

    await connectToDatabase();
    await ensureBlogHeaderNavSeeded();

    const maxSort = await NavMenuItem.findOne({ location: payload.location })
      .sort({ sortOrder: -1 })
      .select("sortOrder")
      .lean();

    const sortOrder =
      payload.sortOrder ?? ((maxSort?.sortOrder ?? -1) as number) + 1;

    const item = await NavMenuItem.create({
      location: payload.location,
      label: payload.label,
      href: payload.href,
      sortOrder,
      isActive: payload.isActive ?? true,
      children: (payload.children ?? []).map((child, index) => ({
        label: child.label,
        href: child.href,
        sortOrder: child.sortOrder ?? index,
        isActive: child.isActive ?? true,
      })),
    });

    revalidateBlogNav();
    return apiSuccess(serializeNavMenuItem(item.toObject()), 201);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}

/** Reorder top-level menu items */
export async function PATCH(request: Request) {
  try {
    const { error, session } = await requirePermission("blog-menu");
    if (error || !session) return error!;

    const body = await request.json();
    const payload = reorderNavMenuSchema.parse(body);

    await connectToDatabase();

    const invalidId = payload.orderedIds.find(
      (id) => !Types.ObjectId.isValid(id),
    );
    if (invalidId) {
      return apiError("Invalid menu item id", 400);
    }

    await Promise.all(
      payload.orderedIds.map((id, index) =>
        NavMenuItem.findByIdAndUpdate(id, { $set: { sortOrder: index } }),
      ),
    );

    const items = await getAdminNavMenuItems("blog-header");
    revalidateBlogNav();
    return apiSuccess(items);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}
