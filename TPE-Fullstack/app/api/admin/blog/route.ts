import { connectToDatabase } from "@/lib/db/mongoose";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { requirePermission } from "@/lib/auth/session";
import { serializeBlogPost, getCategoryLabel } from "@/lib/blog/serialize";
import { slugify } from "@/lib/slug";
import { createBlogPostSchema } from "@/lib/validations/blogPost";
import { BlogPost } from "@/models/BlogPost";

function parsePublishedAt(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function buildPayload(
  payload: ReturnType<typeof createBlogPostSchema.parse>,
  slug: string,
) {
  const status = payload.status ?? "draft";
  const publishedAt =
    status === "published"
      ? parsePublishedAt(payload.publishedAt) ?? new Date()
      : parsePublishedAt(payload.publishedAt);

  return {
    title: payload.title,
    slug,
    excerpt: payload.excerpt ?? "",
    content: payload.content ?? "",
    featuredImage: {
      url: payload.featuredImage?.url ?? "",
      alt: payload.featuredImage?.alt ?? "",
    },
    category: payload.category,
    categoryLabel: getCategoryLabel(
      payload.category,
      payload.categoryLabel,
    ),
    tags: payload.tags ?? [],
    authorName: payload.authorName ?? "",
    status,
    featured: payload.featured ?? false,
    featuredSidebar: payload.featuredSidebar ?? false,
    publishedAt,
    sortOrder: payload.sortOrder ?? 0,
    seoTitle: payload.seoTitle ?? "",
    seoDescription: payload.seoDescription ?? "",
    seoKeywords: payload.seoKeywords ?? [],
    canonicalUrl: payload.canonicalUrl ?? "",
    ogImage: payload.ogImage ?? "",
    ogTitle: payload.ogTitle ?? "",
    ogDescription: payload.ogDescription ?? "",
    robotsIndex: payload.robotsIndex ?? true,
    robotsFollow: payload.robotsFollow ?? true,
    focusKeyword: payload.focusKeyword ?? "",
  };
}

export async function GET(request: Request) {
  try {
    const { error, session } = await requirePermission("blog");
    if (error || !session) return error!;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit") || 10)),
    );
    const q = (searchParams.get("q") || "").trim();
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    await connectToDatabase();

    const filter: Record<string, unknown> = {};
    if (status === "draft" || status === "published") {
      filter.status = status;
    }
    if (category) {
      filter.category = category;
    }
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { excerpt: { $regex: q, $options: "i" } },
        { slug: { $regex: q, $options: "i" } },
        { authorName: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const [total, docs] = await Promise.all([
      BlogPost.countDocuments(filter),
      BlogPost.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return apiSuccess({
      items: docs.map(serializeBlogPost),
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    return apiFromUnknownError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { error, session } = await requirePermission("blog");
    if (error || !session) return error!;

    const body = await request.json();
    const payload = createBlogPostSchema.parse(body);
    const slug = slugify(payload.slug || payload.title);

    if (!slug) {
      return apiError("A valid title or slug is required", 400);
    }

    await connectToDatabase();

    const existing = await BlogPost.findOne({ slug });
    if (existing) {
      return apiError("A post with this slug already exists", 409);
    }

    const post = await BlogPost.create(buildPayload(payload, slug));
    return apiSuccess(serializeBlogPost(post.toObject()), 201);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}
