import { z } from "zod";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { requirePermission } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import {
  addContentSection,
  ContentTabError,
} from "@/lib/productContentTab/mutations";

const createSectionSchema = z.object({
  title: z.string().trim().min(1).max(160),
  isActive: z.boolean().optional().default(true),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("products");
    if (error || !session) return error!;

    const { id } = await context.params;
    const payload = createSectionSchema.parse(await request.json());
    await connectToDatabase();
    const result = await addContentSection(id, payload);
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
