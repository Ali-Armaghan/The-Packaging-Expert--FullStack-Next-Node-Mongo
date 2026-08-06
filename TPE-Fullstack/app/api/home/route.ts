import { apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { getCachedHomePageContent } from "@/lib/home/cache";

/** Public full home content (prefer /api/home/[section] for progressive load). */
export async function GET() {
  try {
    const data = await getCachedHomePageContent();
    return apiSuccess(data, 200);
  } catch (error) {
    return apiFromUnknownError(error);
  }
}
