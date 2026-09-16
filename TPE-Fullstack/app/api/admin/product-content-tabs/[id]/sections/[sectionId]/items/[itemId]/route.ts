import { z } from "zod";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { requirePermission } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import {
  ContentTabError,
  deleteContentItem,
  updateContentItem,
} from "@/lib/productContentTab/mutations";

const updateItemSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  slug: z.string().trim().max(180).optional(),
  image: z.string().trim().max(1000).optional(),
  body: z.string().trim().max(50000).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

type RouteContext = {
  params: Promise<{ id: string; sectionId: string; itemId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("products");
    if (error || !session) return error!;

    const { id, sectionId, itemId } = await context.params;
    const payload = updateItemSchema.parse(await request.json());
    await connectToDatabase();
    const tab = await updateContentItem(id, sectionId, itemId, payload);
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

    const { id, sectionId, itemId } = await context.params;
    await connectToDatabase();
    const tab = await deleteContentItem(id, sectionId, itemId);
    return apiSuccess(tab);
  } catch (error) {
    if (error instanceof ContentTabError) {
      return apiError(error.message, error.status);
    }
    return apiFromUnknownError(error);
  }
}
