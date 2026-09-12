import { connectToDatabase } from "@/lib/db/mongoose";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { applyQuotePayload } from "@/lib/quotes/persist";
import { quoteRequestSchema } from "@/lib/validations/quote";
import { QuoteRequest } from "@/models/QuoteRequest";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = quoteRequestSchema.parse(body);

    await connectToDatabase();

    const doc = new QuoteRequest({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      status: payload.complete ? "new" : "draft",
      currentStep: payload.step ?? 1,
    });

    applyQuotePayload(doc, payload);

    if (payload.complete && !doc.productType) {
      return apiError("Product name is required to submit a quote", 400);
    }

    if (payload.complete) {
      doc.status = "new";
    }

    await doc.save();

    return apiSuccess(
      {
        id: String(doc._id),
        status: doc.status,
        step: doc.currentStep,
        message: payload.complete
          ? "Quote request received"
          : "Quote draft saved",
      },
      201,
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}
