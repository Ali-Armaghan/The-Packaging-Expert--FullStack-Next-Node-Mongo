import { connectToDatabase } from "@/lib/db/mongoose";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { requirePermission } from "@/lib/auth/session";
import {
  revalidateGroupBysByIds,
  revalidateGroupBysUsingProduct,
} from "@/lib/groupBy/revalidate";
import { revalidateProductSlugs } from "@/lib/product/revalidate";
import {
  normalizeProductDetail,
  resolveProductImages,
  serializeProduct,
} from "@/lib/product/serialize";
import { slugify } from "@/lib/slug";
import { updateProductSchema } from "@/lib/validations/product";
import { Product } from "@/models/Product";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("products");
    if (error || !session) return error!;

    const { id } = await context.params;
    await connectToDatabase();
    const doc = await Product.findById(id).lean();
    if (!doc) return apiError("Product not found", 404);
    return apiSuccess(serializeProduct(doc));
  } catch (error) {
    return apiFromUnknownError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("products");
    if (error || !session) return error!;

    const { id } = await context.params;
    const body = await request.json();
    const payload = updateProductSchema.parse(body);

    await connectToDatabase();
    const doc = await Product.findById(id);
    if (!doc) return apiError("Product not found", 404);

    const previousGroupIds = (doc.groupByIds ?? []).map((value) =>
      String(value),
    );
    const previousSlug = doc.slug;

    if (payload.name !== undefined) doc.name = payload.name;
    if (payload.description !== undefined) doc.description = payload.description;
    if (payload.price !== undefined) doc.price = payload.price;
    if (payload.groupByIds !== undefined) {
      doc.set("groupByIds", payload.groupByIds);
    }
    if (payload.isActive !== undefined) doc.isActive = payload.isActive;
    if (payload.sortOrder !== undefined) doc.sortOrder = payload.sortOrder;

    if (payload.detail !== undefined) {
      const detail = normalizeProductDetail(
        payload.detail,
        payload.name ?? doc.name,
      );
      doc.set("detail", detail);
      doc.markModified("detail");
      const { image, images } = resolveProductImages(
        detail.gallery,
        payload.image !== undefined ? payload.image : doc.image,
      );
      doc.image = image;
      doc.set("images", images);
    } else if (payload.image !== undefined) {
      doc.image = payload.image;
      if (payload.image) doc.set("images", [payload.image]);
    }

    if (payload.slug !== undefined || payload.name !== undefined) {
      const nextSlug = slugify(payload.slug || payload.name || doc.name);
      if (!nextSlug) {
        return apiError("A valid name or slug is required", 400);
      }
      if (nextSlug !== doc.slug) {
        const existing = await Product.findOne({
          slug: nextSlug,
          _id: { $ne: doc._id },
        });
        if (existing) {
          return apiError("A product with this slug already exists", 409);
        }
        doc.slug = nextSlug;
      }
    }

    await doc.save();
    const serialized = serializeProduct(doc.toObject());
    await Promise.all([
      revalidateGroupBysByIds([
        ...previousGroupIds,
        ...(serialized.groupByIds ?? []),
      ]),
      revalidateGroupBysUsingProduct(serialized.id),
    ]);
    revalidateProductSlugs(previousSlug, serialized.slug);
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
    const { error, session } = await requirePermission("products");
    if (error || !session) return error!;

    const { id } = await context.params;
    await connectToDatabase();
    const doc = await Product.findByIdAndDelete(id);
    if (!doc) return apiError("Product not found", 404);
    await Promise.all([
      revalidateGroupBysByIds(
        (doc.groupByIds ?? []).map((value) => String(value)),
      ),
      revalidateGroupBysUsingProduct(id),
    ]);
    revalidateProductSlugs(doc.slug);
    return apiSuccess({ id });
  } catch (error) {
    return apiFromUnknownError(error);
  }
}
