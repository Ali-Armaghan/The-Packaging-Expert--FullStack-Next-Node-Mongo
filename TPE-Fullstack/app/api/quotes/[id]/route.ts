import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/mongoose";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { applyQuotePayload } from "@/lib/quotes/persist";
import { quoteUpdateSchema } from "@/lib/validations/quote";
import { QuoteRequest } from "@/models/QuoteRequest";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!mongoose.isValidObjectId(id)) {
      return apiError("Quote not found", 404);
    }

    const body = await request.json();
    const payload = quoteUpdateSchema.parse(body);

    await connectToDatabase();
    const doc = await QuoteRequest.findById(id);
    if (!doc) return apiError("Quote not found", 404);

    if (doc.status !== "draft") {
      return apiError("This quote has already been submitted", 409);
    }

    applyQuotePayload(doc, payload);

    if (payload.complete) {
      if (!doc.productType) {
        return apiError("Product name is required to submit a quote", 400);
      }
      doc.status = "new";
    }

    await doc.save();

    return apiSuccess({
      id: String(doc._id),
      status: doc.status,
      step: doc.currentStep,
      message: payload.complete
        ? "Quote request received"
        : "Quote draft saved",
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}
