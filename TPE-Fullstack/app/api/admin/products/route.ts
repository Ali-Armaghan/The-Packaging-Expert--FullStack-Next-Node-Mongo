import { connectToDatabase } from "@/lib/db/mongoose";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { requirePermission } from "@/lib/auth/session";
import { serializeProduct } from "@/lib/product/serialize";
import { slugify } from "@/lib/slug";
import { createProductSchema } from "@/lib/validations/product";
import { Product } from "@/models/Product";

export async function GET() {
  try {
    const { error, session } = await requirePermission("products");
    if (error || !session) return error!;

    await connectToDatabase();
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

    const product = await Product.create({
      name: payload.name,
      slug,
      description: payload.description,
      price: payload.price,
      image: payload.image,
      images: payload.image ? [payload.image] : [],
      groupByIds: payload.groupByIds,
      isActive: payload.isActive,
      sortOrder: payload.sortOrder,
    });

    return apiSuccess(serializeProduct(product.toObject()), 201);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}
