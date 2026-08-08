import { connectToDatabase } from "@/lib/db/mongoose";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { hasPermission } from "@/lib/auth/permissions";
import {
  requirePermission,
  requireSession,
} from "@/lib/auth/session";
import { revalidateGroupBysByIds } from "@/lib/groupBy/revalidate";
import { getProductDetailDefaults } from "@/lib/product/defaults";
import { revalidateProductSlugs } from "@/lib/product/revalidate";
import {
  normalizeProductDetail,
  resolveProductImages,
  serializeProduct,
  serializeProductLite,
} from "@/lib/product/serialize";
import { slugify } from "@/lib/slug";
import { createProductSchema } from "@/lib/validations/product";
import { Product } from "@/models/Product";

export async function GET(request: Request) {
  try {
    const { error, session } = await requireSession();
    if (error || !session) return error!;

    const access = {
      role: session.user.role,
      permissions: session.user.permissions,
    };
    if (
      !hasPermission(access, "products") &&
      !hasPermission(access, "group-by")
    ) {
      return apiError("Forbidden", 403);
    }

    const lite =
      new URL(request.url).searchParams.get("lite") === "1" ||
      new URL(request.url).searchParams.get("lite") === "true";

    await connectToDatabase();

    if (lite) {
      const products = await Product.find({})
        .select({
          name: 1,
          slug: 1,
          price: 1,
          image: 1,
          images: 1,
          groupByIds: 1,
          isActive: 1,
          sortOrder: 1,
        })
        .sort({ sortOrder: 1, name: 1 })
        .lean();
      return apiSuccess(products.map(serializeProductLite));
    }

    const products = await Product.find({})
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    return apiSuccess(products.map(serializeProduct));
  } catch (error) {
    return apiFromUnknownError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { error, session } = await requirePermission("products");
    if (error || !session) return error!;

    const body = await request.json();
    const payload = createProductSchema.parse(body);
    const slug = slugify(payload.slug || payload.name);

    if (!slug) {
      return apiError("A valid name or slug is required", 400);
    }

    await connectToDatabase();
    const existing = await Product.findOne({ slug });
    if (existing) {
      return apiError("A product with this slug already exists", 409);
    }

    const detail = normalizeProductDetail(
      payload.detail ?? getProductDetailDefaults(payload.name),
      payload.name,
    );
    const { image, images } = resolveProductImages(
      detail.gallery,
      payload.image,
    );

    const product = await Product.create({
      name: payload.name,
      slug,
      description: payload.description,
      price: payload.price,
      image,
      images,
      groupByIds: payload.groupByIds,
      isActive: payload.isActive,
      sortOrder: payload.sortOrder,
      detail,
    });

    await revalidateGroupBysByIds(payload.groupByIds ?? []);
    revalidateProductSlugs(slug);

    return apiSuccess(serializeProduct(product.toObject()), 201);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}
