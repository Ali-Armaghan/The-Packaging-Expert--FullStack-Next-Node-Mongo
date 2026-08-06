import { z } from "zod";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { requirePermission } from "@/lib/auth/session";
import { getMenuCatalog } from "@/lib/menuLinks/catalog";
import {
  getMenuGroupLinks,
  saveMenuGroupLinks,
} from "@/lib/menuLinks/queries";
import { revalidateMenuLinks } from "@/lib/menuLinks/revalidate";
import { listGroupBys } from "@/lib/groupBy/queries";
import { isMenuLinkKey } from "@/types/menuLinks";

type RouteContext = { params: Promise<{ menuKey: string }> };

async function requireMenuPermission(menuKey: string) {
  if (menuKey === "industries") return requirePermission("industries");
  if (menuKey === "styles") return requirePermission("style");
  if (menuKey === "products") return requirePermission("categories");
  return requirePermission("home");
}

const bodySchema = z.object({
  links: z.record(z.string(), z.string()),
});

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { menuKey } = await context.params;
    if (!isMenuLinkKey(menuKey)) return apiError("Unknown menu", 400);

    const { error, session } = await requireMenuPermission(menuKey);
    if (error || !session) return error!;

    const [links, groups, catalog] = await Promise.all([
      getMenuGroupLinks(menuKey),
      listGroupBys(),
      Promise.resolve(getMenuCatalog(menuKey)),
    ]);

    return apiSuccess({
      menuKey,
      catalog,
      links,
      groups: groups
        .filter((g) => g.isActive)
        .map((g) => ({ id: g.id, name: g.name, slug: g.slug })),
    });
  } catch (error) {
    return apiFromUnknownError(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { menuKey } = await context.params;
    if (!isMenuLinkKey(menuKey)) return apiError("Unknown menu", 400);

    const { error, session } = await requireMenuPermission(menuKey);
    if (error || !session) return error!;

    const body = await request.json();
    const payload = bodySchema.parse(body);
    const links = await saveMenuGroupLinks(menuKey, payload.links);
    revalidateMenuLinks(menuKey);

    return apiSuccess({ menuKey, links });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}
