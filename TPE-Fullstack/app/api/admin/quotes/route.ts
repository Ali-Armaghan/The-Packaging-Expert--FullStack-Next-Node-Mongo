import { connectToDatabase } from "@/lib/db/mongoose";
import { apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { requirePermission } from "@/lib/auth/session";
import { serializeQuote } from "@/lib/quotes/serialize";
import { QuoteRequest } from "@/models/QuoteRequest";

export async function GET() {
  try {
    const { error, session } = await requirePermission("quotes");
    if (error || !session) return error!;

    await connectToDatabase();

    const quotes = await QuoteRequest.find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return apiSuccess(quotes.map((quote) => serializeQuote(quote)));
  } catch (error) {
    return apiFromUnknownError(error);
  }
}
