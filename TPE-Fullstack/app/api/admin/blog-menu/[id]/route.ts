import { connectToDatabase } from "@/lib/db/mongoose";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { requirePermission } from "@/lib/auth/session";
import { serializeNavMenuItem } from "@/lib/nav/serialize";
import { updateNavMenuItemSchema } from "@/lib/validations/navMenu";
import { NavMenuItem } from "@/models/NavMenuItem";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("blog-menu");
    if (error || !session) return error!;

    const { id } = await context.params;
    await connectToDatabase();

    const doc = await NavMenuItem.findById(id).lean();
    if (!doc) return apiError("Menu item not found", 404);

    return apiSuccess(serializeNavMenuItem(doc));
  } catch (error) {
    return apiFromUnknownError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("blog-menu");
    if (error || !session) return error!;

    const { id } = await context.params;
    const body = await request.json();
    const payload = updateNavMenuItemSchema.parse(body);

    await connectToDatabase();

    const existing = await NavMenuItem.findById(id);
    if (!existing) return apiError("Menu item not found", 404);

    if (payload.label !== undefined) existing.label = payload.label;
    if (payload.href !== undefined) existing.href = payload.href;
    if (payload.location !== undefined) existing.location = payload.location;
    if (payload.sortOrder !== undefined) existing.sortOrder = payload.sortOrder;
    if (payload.isActive !== undefined) existing.isActive = payload.isActive;
    if (payload.children !== undefined) {
      existing.set(
        "children",
        payload.children.map((child, index) => ({
          label: child.label,
          href: child.href,
          sortOrder: child.sortOrder ?? index,
          isActive: child.isActive ?? true,
        })),
      );
    }

    await existing.save();
    return apiSuccess(serializeNavMenuItem(existing.toObject()));
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("blog-menu");
    if (error || !session) return error!;

    const { id } = await context.params;
    await connectToDatabase();

    const deleted = await NavMenuItem.findByIdAndDelete(id);
    if (!deleted) return apiError("Menu item not found", 404);

    return apiSuccess({ id });
  } catch (error) {
    return apiFromUnknownError(error);
  }
}
