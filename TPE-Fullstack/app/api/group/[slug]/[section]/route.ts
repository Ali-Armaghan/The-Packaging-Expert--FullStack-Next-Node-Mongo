import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { getCachedGroupBySection } from "@/lib/groupBy/cache";
import { isGroupBySection } from "@/lib/groupBy/queries";

type RouteContext = { params: Promise<{ slug: string; section: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug, section } = await context.params;
    if (!isGroupBySection(section)) {
      return apiError("Unknown section", 400);
    }

    const data = await getCachedGroupBySection(slug, section);
    if (!data) return apiError("Group not found", 404);

    return apiSuccess({ section, data });
  } catch (error) {
    return apiFromUnknownError(error);
  }
}
