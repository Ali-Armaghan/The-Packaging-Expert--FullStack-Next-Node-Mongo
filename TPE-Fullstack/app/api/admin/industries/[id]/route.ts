import { connectToDatabase } from "@/lib/db/mongoose";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { requirePermission } from "@/lib/auth/session";
import { slugify } from "@/lib/slug";
import { updateIndustrySchema } from "@/lib/validations/industry";
import { Industry } from "@/models/Industry";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function serializeIndustry(doc: {
  _id: { toString(): string };
  name: string;
  slug: string;
  icon?: string | null;
  pageTitle?: string | null;
  shortDescription?: string | null;
  types?: string[] | null;
  faqs?: { question: string; answer: string }[] | null;
  blogImageDetails?: {
    title: string;
    description?: string | null;
    image: string;
  }[] | null;
  attachedImages?: string[] | null;
  isActive?: boolean | null;
  sortOrder?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    icon: doc.icon ?? "",
    pageTitle: doc.pageTitle ?? "",
    shortDescription: doc.shortDescription ?? "",
    types: doc.types ?? [],
    faqs: doc.faqs ?? [],
    blogImageDetails: (doc.blogImageDetails ?? []).map((item) => ({
      title: item.title,
      description: item.description ?? "",
      image: item.image,
    })),
    attachedImages: doc.attachedImages ?? [],
    isActive: doc.isActive ?? true,
    sortOrder: doc.sortOrder ?? 0,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("industries");
    if (error || !session) return error!;

    const { id } = await context.params;
    await connectToDatabase();

    const industry = await Industry.findById(id).lean();
    if (!industry) return apiError("Industry not found", 404);

    return apiSuccess(serializeIndustry(industry));
  } catch (error) {
    return apiFromUnknownError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("industries");
    if (error || !session) return error!;

    const { id } = await context.params;
    const body = await request.json();
    const payload = updateIndustrySchema.parse(body);

    await connectToDatabase();

    const industry = await Industry.findById(id);
    if (!industry) return apiError("Industry not found", 404);

    if (payload.name !== undefined) industry.name = payload.name;
    if (payload.icon !== undefined) industry.icon = payload.icon;
    if (payload.pageTitle !== undefined) industry.pageTitle = payload.pageTitle;
    if (payload.shortDescription !== undefined) {
      industry.shortDescription = payload.shortDescription;
    }
    if (payload.types !== undefined) industry.set("types", payload.types);
    if (payload.faqs !== undefined) industry.set("faqs", payload.faqs);
    if (payload.blogImageDetails !== undefined) {
      industry.set("blogImageDetails", payload.blogImageDetails);
    }
    if (payload.attachedImages !== undefined) {
      industry.set("attachedImages", payload.attachedImages);
    }
    if (payload.isActive !== undefined) industry.isActive = payload.isActive;
    if (payload.sortOrder !== undefined) industry.sortOrder = payload.sortOrder;

    if (payload.slug !== undefined || payload.name !== undefined) {
      const nextSlug = slugify(
        payload.slug || payload.name || industry.name,
      );
      if (!nextSlug) {
        return apiError("A valid name or slug is required", 400);
      }
      if (nextSlug !== industry.slug) {
        const existing = await Industry.findOne({
          slug: nextSlug,
          _id: { $ne: industry._id },
        });
        if (existing) {
          return apiError("An industry with this slug already exists", 409);
        }
        industry.slug = nextSlug;
      }
    }

    await industry.save();
    return apiSuccess(serializeIndustry(industry.toObject()));
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("industries");
    if (error || !session) return error!;

    const { id } = await context.params;
    await connectToDatabase();

    const industry = await Industry.findByIdAndDelete(id);
    if (!industry) return apiError("Industry not found", 404);

    return apiSuccess({ id });
  } catch (error) {
    return apiFromUnknownError(error);
  }
}
