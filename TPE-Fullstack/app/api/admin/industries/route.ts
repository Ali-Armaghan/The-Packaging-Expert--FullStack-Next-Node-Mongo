import { connectToDatabase } from "@/lib/db/mongoose";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { requirePermission } from "@/lib/auth/session";
import { slugify } from "@/lib/slug";
import { createIndustrySchema } from "@/lib/validations/industry";
import { Industry } from "@/models/Industry";

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

export async function GET() {
  try {
    const { error, session } = await requirePermission("industries");
    if (error || !session) return error!;

    await connectToDatabase();

    const industries = await Industry.find({})
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    return apiSuccess(industries.map(serializeIndustry));
  } catch (error) {
    return apiFromUnknownError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { error, session } = await requirePermission("industries");
    if (error || !session) return error!;

    const body = await request.json();
    const payload = createIndustrySchema.parse(body);
    const slug = slugify(payload.slug || payload.name);

    if (!slug) {
      return apiError("A valid name or slug is required", 400);
    }

    await connectToDatabase();

    const existing = await Industry.findOne({ slug });
    if (existing) {
      return apiError("An industry with this slug already exists", 409);
    }

    const industry = await Industry.create({
      ...payload,
      slug,
    });

    return apiSuccess(serializeIndustry(industry.toObject()), 201);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}
