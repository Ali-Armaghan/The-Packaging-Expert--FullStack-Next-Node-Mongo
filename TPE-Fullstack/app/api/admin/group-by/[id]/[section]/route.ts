import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { requirePermission } from "@/lib/auth/session";
import {
  isGroupBySection,
  updateGroupBySection,
} from "@/lib/groupBy/queries";
import { revalidateGroupBySlug } from "@/lib/groupBy/revalidate";
import {
  catalogMetaSectionSchema,
  heroSectionSchema,
} from "@/lib/validations/groupBy";
import { z } from "zod";

type RouteContext = { params: Promise<{ id: string; section: string }> };

function parseSection(section: string, body: unknown) {
  if (section === "hero") return heroSectionSchema.parse(body);
  if (section === "catalog") return catalogMetaSectionSchema.parse(body);
  // Other elite sections: accept object payloads
  return z.record(z.string(), z.unknown()).parse(body);
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("group-by");
    if (error || !session) return error!;

    const { id, section } = await context.params;
    if (!isGroupBySection(section)) {
      return apiError("Unknown section", 400);
    }

    const body = await request.json();
    const parsed = parseSection(section, body);
    const updated = await updateGroupBySection(id, section, parsed);
    if (!updated) return apiError("Group not found", 404);

    revalidateGroupBySlug(updated.slug);

    return apiSuccess({
      section,
      data: updated.content[section],
      group: updated,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}
