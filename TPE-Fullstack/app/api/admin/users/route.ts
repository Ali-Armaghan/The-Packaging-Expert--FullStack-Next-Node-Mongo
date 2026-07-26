import { connectToDatabase } from "@/lib/db/mongoose";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { isSuperAdmin } from "@/lib/auth/permissions";
import { hashPassword } from "@/lib/auth/password";
import { requirePermission } from "@/lib/auth/session";
import { createAdminUserSchema } from "@/lib/validations/adminUser";
import { AdminUser } from "@/models/AdminUser";

export async function GET() {
  try {
    const { error, session } = await requirePermission("users");
    if (error || !session) return error!;

    await connectToDatabase();

    const users = await AdminUser.find({})
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .lean();

    return apiSuccess(
      users.map((user) => ({
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions ?? [],
        isActive: user.isActive,
        createdAt: user.createdAt,
      })),
    );
  } catch (error) {
    return apiFromUnknownError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { error, session } = await requirePermission("users");
    if (error || !session) return error!;

    const body = await request.json();
    const payload = createAdminUserSchema.parse(body);

    const actorIsSuper = isSuperAdmin(session.user.role);

    if (payload.role === "superadmin" && !actorIsSuper) {
      return apiError("Only superadmin can create superadmin users", 403);
    }

    if (!actorIsSuper) {
      const actorPerms = new Set(session.user.permissions ?? []);
      const invalid = payload.permissions.filter((id) => !actorPerms.has(id));
      if (invalid.length > 0) {
        return apiError("Cannot grant permissions you do not have", 403, {
          invalid,
        });
      }
    }

    if (payload.role !== "superadmin" && payload.permissions.length === 0) {
      return apiError("Select at least one sidebar permission", 400);
    }

    await connectToDatabase();

    const existing = await AdminUser.findOne({
      email: payload.email.toLowerCase(),
    });
    if (existing) {
      return apiError("A user with this email already exists", 409);
    }

    const passwordHash = await hashPassword(payload.password);

    const user = await AdminUser.create({
      name: payload.name,
      email: payload.email.toLowerCase(),
      passwordHash,
      role: payload.role,
      permissions:
        payload.role === "superadmin"
          ? []
          : payload.permissions,
      isActive: payload.isActive ?? true,
    });

    return apiSuccess(
      {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions ?? [],
        isActive: user.isActive,
      },
      201,
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}
