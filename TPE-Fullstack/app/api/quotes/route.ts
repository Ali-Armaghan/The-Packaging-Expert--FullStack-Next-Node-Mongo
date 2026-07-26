import { connectToDatabase } from "@/lib/db/mongoose";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { quoteRequestSchema } from "@/lib/validations/quote";
import { QuoteRequest } from "@/models/QuoteRequest";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = quoteRequestSchema.parse(body);

    await connectToDatabase();

    const hasDimensions =
      payload.length !== undefined ||
      payload.width !== undefined ||
      payload.height !== undefined;

    const doc = await QuoteRequest.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      company: payload.company,
      productType: payload.productType,
      industry: payload.industry,
      quantity: payload.quantity,
      dimensions: hasDimensions
        ? {
            length: payload.length,
            width: payload.width,
            height: payload.height,
            unit: payload.unit ?? "in",
          }
        : undefined,
      notes: payload.notes,
      status: "new",
    });

    return apiSuccess(
      {
        id: String(doc._id),
        message: "Quote request received",
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
