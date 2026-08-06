import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { requirePermission } from "@/lib/auth/session";
import { getHomeSection, updateHomeSection } from "@/lib/home/queries";
import { revalidateHomeSection } from "@/lib/home/revalidate";
import { sectionSchemaMap } from "@/lib/validations/homePage";
import { HOME_SECTIONS, type HomeSectionKey } from "@/types/homePage";

type RouteContext = {
  params: Promise<{ section: string }>;
};

function isHomeSection(value: string): value is HomeSectionKey {
  return (HOME_SECTIONS as readonly string[]).includes(value);
}

/** Load one home section for admin editing. */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("home");
    if (error || !session) return error!;

    const { section } = await context.params;
    if (!isHomeSection(section)) {
      return apiError(
        `Invalid section. Expected one of: ${HOME_SECTIONS.join(", ")}`,
        400,
      );
    }

    const data = await getHomeSection(section);
    return apiSuccess({ section, data });
  } catch (error) {
    return apiFromUnknownError(error);
  }
}

/** Update only the requested home section. */
export async function PUT(request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("home");
    if (error || !session) return error!;

    const { section } = await context.params;
    if (!isHomeSection(section)) {
      return apiError(
        `Invalid section. Expected one of: ${HOME_SECTIONS.join(", ")}`,
        400,
      );
    }

    const body = await request.json();
    const schema = sectionSchemaMap[section];
    const data = schema.parse(body);
    await updateHomeSection(section, data);
    revalidateHomeSection(section);
    const saved = await getHomeSection(section);
    return apiSuccess({ section, data: saved });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}

/** Alias for PUT — section-only patch. */
export async function PATCH(request: Request, context: RouteContext) {
  return PUT(request, context);
}
