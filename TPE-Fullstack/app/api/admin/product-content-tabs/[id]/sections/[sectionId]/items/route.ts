import { z } from "zod";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { requirePermission } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import {
  addContentItem,
  ContentTabError,
} from "@/lib/productContentTab/mutations";

const createItemSchema = z.object({
  title: z.string().trim().min(1).max(160),
  slug: z.string().trim().max(180).optional().default(""),
  image: z.string().trim().max(1000).optional().default(""),
  body: z.string().trim().max(50000).optional().default(""),
  isActive: z.boolean().optional().default(true),
});

type RouteContext = {
  params: Promise<{ id: string; sectionId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("products");
    if (error || !session) return error!;

    const { id, sectionId } = await context.params;
    const payload = createItemSchema.parse(await request.json());
    await connectToDatabase();
    const result = await addContentItem(id, sectionId, payload);
    return apiSuccess(result, 201);
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
