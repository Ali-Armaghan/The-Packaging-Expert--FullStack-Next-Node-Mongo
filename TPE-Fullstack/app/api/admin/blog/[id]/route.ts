import { connectToDatabase } from "@/lib/db/mongoose";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { requirePermission } from "@/lib/auth/session";
import { revalidateBlogContent } from "@/lib/blog/revalidate";
import { serializeBlogPost, getCategoryLabel } from "@/lib/blog/serialize";
import {
  collectBlogMediaUrls,
  deleteAllMedia,
  deleteRemovedMedia,
} from "@/lib/media/cleanup";
import { slugify } from "@/lib/slug";
import { updateBlogPostSchema } from "@/lib/validations/blogPost";
import { BlogPost } from "@/models/BlogPost";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parsePublishedAt(value: string | null | undefined) {
  if (value === null) return null;
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("blog");
    if (error || !session) return error!;

    const { id } = await context.params;
    await connectToDatabase();

    const post = await BlogPost.findById(id).lean();
    if (!post) return apiError("Post not found", 404);

    return apiSuccess(serializeBlogPost(post));
  } catch (error) {
    return apiFromUnknownError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("blog");
    if (error || !session) return error!;

    const { id } = await context.params;
    const body = await request.json();
    const payload = updateBlogPostSchema.parse(body);

    await connectToDatabase();

    const post = await BlogPost.findById(id);
    if (!post) return apiError("Post not found", 404);

    const previousSlug = post.slug;
    const previousStatus = post.status;
    const previousUrls = collectBlogMediaUrls(post.toObject());

    if (payload.title !== undefined) post.title = payload.title;
    if (payload.excerpt !== undefined) post.excerpt = payload.excerpt;
    if (payload.content !== undefined) post.content = payload.content;
    if (payload.featuredImage !== undefined) {
      post.set("featuredImage", {
        url: payload.featuredImage.url ?? "",
        alt: payload.featuredImage.alt ?? "",
      });
    }
    if (payload.category !== undefined) {
      post.category = payload.category;
      post.categoryLabel = getCategoryLabel(
        payload.category,
        payload.categoryLabel ?? post.categoryLabel,
      );
    } else if (payload.categoryLabel !== undefined) {
      post.categoryLabel = payload.categoryLabel;
    }
    if (payload.tags !== undefined) post.set("tags", payload.tags);
    if (payload.authorName !== undefined) post.authorName = payload.authorName;
    if (payload.featured !== undefined) post.featured = payload.featured;
    if (payload.featuredSidebar !== undefined) {
      post.featuredSidebar = payload.featuredSidebar;
    }
    if (payload.sortOrder !== undefined) post.sortOrder = payload.sortOrder;
    if (payload.seoTitle !== undefined) post.seoTitle = payload.seoTitle;
    if (payload.seoDescription !== undefined) {
      post.seoDescription = payload.seoDescription;
    }
    if (payload.seoKeywords !== undefined) {
      post.set("seoKeywords", payload.seoKeywords);
    }
    if (payload.canonicalUrl !== undefined) {
      post.canonicalUrl = payload.canonicalUrl;
    }
    if (payload.ogImage !== undefined) post.ogImage = payload.ogImage;
    if (payload.ogTitle !== undefined) post.ogTitle = payload.ogTitle;
    if (payload.ogDescription !== undefined) {
      post.ogDescription = payload.ogDescription;
    }
    if (payload.twitterTitle !== undefined) {
      post.twitterTitle = payload.twitterTitle;
    }
    if (payload.twitterDescription !== undefined) {
      post.twitterDescription = payload.twitterDescription;
    }
    if (payload.twitterImage !== undefined) {
      post.twitterImage = payload.twitterImage;
    }
    if (payload.twitterCard !== undefined) {
      post.twitterCard = payload.twitterCard;
    }
    if (payload.robotsIndex !== undefined) {
      post.robotsIndex = payload.robotsIndex;
    }
    if (payload.robotsFollow !== undefined) {
      post.robotsFollow = payload.robotsFollow;
    }
    if (payload.robotsNoArchive !== undefined) {
      post.robotsNoArchive = payload.robotsNoArchive;
    }
    if (payload.focusKeyword !== undefined) {
      post.focusKeyword = payload.focusKeyword;
    }
    if (payload.secondaryKeywords !== undefined) {
      post.set("secondaryKeywords", payload.secondaryKeywords);
    }

    if (payload.status !== undefined) {
      post.status = payload.status;
      if (payload.status === "published" && !post.publishedAt) {
        post.publishedAt = new Date();
      }
    }

    if (payload.publishedAt !== undefined) {
      const parsed = parsePublishedAt(payload.publishedAt);
      if (parsed !== undefined) post.publishedAt = parsed;
    }

    if (payload.slug !== undefined || payload.title !== undefined) {
      const nextSlug = slugify(payload.slug || payload.title || post.title);
      if (!nextSlug) {
        return apiError("A valid title or slug is required", 400);
      }
      if (nextSlug !== post.slug) {
        const existing = await BlogPost.findOne({
          slug: nextSlug,
          _id: { $ne: post._id },
        });
        if (existing) {
          return apiError("A post with this slug already exists", 409);
        }
        post.slug = nextSlug;
      }
    }

    await post.save();

    const nextUrls = collectBlogMediaUrls(post.toObject());
    await deleteRemovedMedia(previousUrls, nextUrls);

    const serialized = serializeBlogPost(post.toObject());
    const touchedPublic =
      previousStatus === "published" || serialized.status === "published";
    if (touchedPublic) {
      revalidateBlogContent({
        slugs: [previousSlug, serialized.slug],
        index: true,
      });
    }

    return apiSuccess(serialized);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("blog");
    if (error || !session) return error!;

    const { id } = await context.params;
    await connectToDatabase();

    const post = await BlogPost.findById(id);
    if (!post) return apiError("Post not found", 404);

    const slug = post.slug;
    const wasPublished = post.status === "published";
    const mediaUrls = collectBlogMediaUrls(post.toObject());
    await BlogPost.findByIdAndDelete(id);
    await deleteAllMedia(mediaUrls);

    if (wasPublished) {
      revalidateBlogContent({ slugs: [slug], index: true });
    }

    return apiSuccess({ id });
  } catch (error) {
    return apiFromUnknownError(error);
  }
}
