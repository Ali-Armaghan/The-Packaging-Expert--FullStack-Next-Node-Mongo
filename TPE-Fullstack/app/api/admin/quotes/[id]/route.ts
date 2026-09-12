import mongoose from "mongoose";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/mongoose";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { requirePermission } from "@/lib/auth/session";
import { serializeQuote } from "@/lib/quotes/serialize";
import { QuoteRequest } from "@/models/QuoteRequest";

type RouteContext = { params: Promise<{ id: string }> };

const updateSchema = z.object({
  status: z.enum(["draft", "new", "contacted", "quoted", "closed"]),
});

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("quotes");
    if (error || !session) return error!;

    const { id } = await context.params;
    if (!mongoose.isValidObjectId(id)) {
      return apiError("Quote not found", 404);
    }

    const body = await request.json();
    const payload = updateSchema.parse(body);

    await connectToDatabase();
    const doc = await QuoteRequest.findByIdAndUpdate(
      id,
      { status: payload.status },
      { new: true },
    );

    if (!doc) return apiError("Quote not found", 404);
    return apiSuccess(serializeQuote(doc));
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("quotes");
    if (error || !session) return error!;

    const { id } = await context.params;
    if (!mongoose.isValidObjectId(id)) {
      return apiError("Quote not found", 404);
    }

    await connectToDatabase();
    const doc = await QuoteRequest.findByIdAndDelete(id);
    if (!doc) return apiError("Quote not found", 404);
    return apiSuccess({ id });
  } catch (error) {
    return apiFromUnknownError(error);
  }
}
