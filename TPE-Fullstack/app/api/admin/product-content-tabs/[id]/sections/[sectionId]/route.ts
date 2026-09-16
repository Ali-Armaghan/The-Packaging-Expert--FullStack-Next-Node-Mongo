import { z } from "zod";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { requirePermission } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import {
  ContentTabError,
  deleteContentSection,
  updateContentSection,
} from "@/lib/productContentTab/mutations";

const updateSectionSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

type RouteContext = {
  params: Promise<{ id: string; sectionId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("products");
    if (error || !session) return error!;

    const { id, sectionId } = await context.params;
    const payload = updateSectionSchema.parse(await request.json());
    await connectToDatabase();
    const tab = await updateContentSection(id, sectionId, payload);
    return apiSuccess(tab);
  } catch (error) {
    if (error instanceof ContentTabError) {
      return apiError(error.message, error.status);
    }
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

    const { id, sectionId } = await context.params;
    await connectToDatabase();
    const tab = await deleteContentSection(id, sectionId);
    return apiSuccess(tab);
  } catch (error) {
    if (error instanceof ContentTabError) {
      return apiError(error.message, error.status);
    }
    return apiFromUnknownError(error);
  }
}
