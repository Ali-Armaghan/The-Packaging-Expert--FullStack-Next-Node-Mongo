import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { requirePermission } from "@/lib/auth/session";
import {
  getAdminHomePage,
  replaceHomePage,
  updateHomeSection,
} from "@/lib/home/queries";
import {
  homePageBodySchema,
  homeSectionPatchSchema,
  sectionSchemaMap,
} from "@/lib/validations/homePage";

export async function GET() {
  try {
    const { error, session } = await requirePermission("home");
    if (error || !session) return error!;

    const data = await getAdminHomePage();
    return apiSuccess(data);
  } catch (error) {
    return apiFromUnknownError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const { error, session } = await requirePermission("home");
    if (error || !session) return error!;

    const body = await request.json();
    const payload = homePageBodySchema.parse(body);
    const data = await replaceHomePage(payload);
    return apiSuccess(data);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const { error, session } = await requirePermission("home");
    if (error || !session) return error!;

    const body = await request.json();
    const { section, data: rawData } = homeSectionPatchSchema.parse(body);
    const schema = sectionSchemaMap[section];
    const data = schema.parse(rawData);
    const updated = await updateHomeSection(section, data);
    return apiSuccess(updated);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}
