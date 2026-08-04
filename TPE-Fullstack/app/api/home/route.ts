import { apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { getHomePageContent } from "@/lib/home/queries";

/** Public full home content (prefer /api/home/[section] for progressive load). */
export async function GET() {
  try {
    const data = await getHomePageContent();
    return apiSuccess(data, 200);
  } catch (error) {
    return apiFromUnknownError(error);
  }
}
