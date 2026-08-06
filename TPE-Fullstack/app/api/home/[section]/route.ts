import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { getCachedHomeSection } from "@/lib/home/cache";
import { HOME_SECTIONS, type HomeSectionKey } from "@/types/homePage";

type RouteContext = {
  params: Promise<{ section: string }>;
};

function isHomeSection(value: string): value is HomeSectionKey {
  return (HOME_SECTIONS as readonly string[]).includes(value);
}

/** Public partial home section — used for progressive below-the-fold loading. */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { section } = await context.params;

    if (!isHomeSection(section)) {
      return apiError(
        `Invalid section. Expected one of: ${HOME_SECTIONS.join(", ")}`,
        400,
      );
    }

    const data = await getCachedHomeSection(section);
    return apiSuccess({ section, data });
  } catch (error) {
    return apiFromUnknownError(error);
  }
}
