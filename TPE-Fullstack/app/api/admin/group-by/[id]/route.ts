import { connectToDatabase } from "@/lib/db/mongoose";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { requirePermission } from "@/lib/auth/session";
import { getGroupByById } from "@/lib/groupBy/queries";
import { isReservedGroupSlug } from "@/lib/groupBy/reservedSlugs";
import { serializeGroupBy } from "@/lib/groupBy/serialize";
import { slugify } from "@/lib/slug";
import { updateGroupByMetaSchema } from "@/lib/validations/groupBy";
import { GroupBy } from "@/models/GroupBy";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("group-by");
    if (error || !session) return error!;

    const { id } = await context.params;
    const group = await getGroupByById(id);
    if (!group) return apiError("Group not found", 404);
    return apiSuccess(group);
  } catch (error) {
    return apiFromUnknownError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("group-by");
    if (error || !session) return error!;

    const { id } = await context.params;
    const body = await request.json();
    const payload = updateGroupByMetaSchema.parse(body);

    await connectToDatabase();
    const doc = await GroupBy.findById(id);
    if (!doc) return apiError("Group not found", 404);

    if (payload.name !== undefined) doc.name = payload.name;
    if (payload.isActive !== undefined) doc.isActive = payload.isActive;
    if (payload.sortOrder !== undefined) doc.sortOrder = payload.sortOrder;

    if (payload.slug !== undefined || payload.name !== undefined) {
      const nextSlug = slugify(payload.slug || payload.name || doc.name);
      if (!nextSlug) {
        return apiError("A valid name or slug is required", 400);
      }
      if (isReservedGroupSlug(nextSlug)) {
        return apiError("This slug is reserved by the site", 400);
      }
      if (nextSlug !== doc.slug) {
        const existing = await GroupBy.findOne({
          slug: nextSlug,
          _id: { $ne: doc._id },
        });
        if (existing) {
          return apiError("A group with this slug already exists", 409);
        }
        doc.slug = nextSlug;
      }
    }

    await doc.save();
    return apiSuccess(serializeGroupBy(doc.toObject()));
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("group-by");
    if (error || !session) return error!;

    const { id } = await context.params;
    await connectToDatabase();
    const doc = await GroupBy.findByIdAndDelete(id);
    if (!doc) return apiError("Group not found", 404);
    return apiSuccess({ id });
  } catch (error) {
    return apiFromUnknownError(error);
  }
}
