import { connectToDatabase } from "@/lib/db/mongoose";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { requirePermission } from "@/lib/auth/session";
import { createGroupByDoc, listGroupBys } from "@/lib/groupBy/queries";
import { isReservedGroupSlug } from "@/lib/groupBy/reservedSlugs";
import { slugify } from "@/lib/slug";
import { createGroupBySchema } from "@/lib/validations/groupBy";
import { GroupBy } from "@/models/GroupBy";

export async function GET() {
  try {
    // Products UI also needs the list for multi-select
    let auth = await requirePermission("group-by");
    if (auth.error || !auth.session) {
      auth = await requirePermission("products");
    }
    if (auth.error || !auth.session) return auth.error!;

    const items = await listGroupBys();
    return apiSuccess(items);
  } catch (error) {
    return apiFromUnknownError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { error, session } = await requirePermission("group-by");
    if (error || !session) return error!;

    const body = await request.json();
    const payload = createGroupBySchema.parse(body);
    const slug = slugify(payload.slug || payload.name);

    if (!slug) {
      return apiError("A valid name or slug is required", 400);
    }
    if (isReservedGroupSlug(slug)) {
      return apiError("This slug is reserved by the site", 400);
    }

    await connectToDatabase();
    const existing = await GroupBy.findOne({ slug });
    if (existing) {
      return apiError("A group with this slug already exists", 409);
    }

    const created = await createGroupByDoc({
      name: payload.name,
      slug,
      isActive: payload.isActive,
      sortOrder: payload.sortOrder,
      content: payload.content as
        | Parameters<typeof createGroupByDoc>[0]["content"]
        | undefined,
    });

    return apiSuccess(created, 201);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}
