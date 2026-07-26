import { connectToDatabase } from "@/lib/db/mongoose";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { isSuperAdmin } from "@/lib/auth/permissions";
import { hashPassword } from "@/lib/auth/password";
import { requirePermission } from "@/lib/auth/session";
import { updateAdminUserSchema } from "@/lib/validations/adminUser";
import { AdminUser } from "@/models/AdminUser";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("users");
    if (error || !session) return error!;

    const { id } = await context.params;
    const body = await request.json();
    const payload = updateAdminUserSchema.parse(body);
    const actorIsSuper = isSuperAdmin(session.user.role);

    await connectToDatabase();

    const user = await AdminUser.findById(id);
    if (!user) return apiError("User not found", 404);

    if (user.role === "superadmin" && !actorIsSuper) {
      return apiError("Cannot modify a superadmin", 403);
    }

    if (payload.role === "superadmin" && !actorIsSuper) {
      return apiError("Only superadmin can assign superadmin role", 403);
    }

    if (payload.permissions && !actorIsSuper) {
      const actorPerms = new Set(session.user.permissions ?? []);
      const invalid = payload.permissions.filter((pid) => !actorPerms.has(pid));
      if (invalid.length > 0) {
        return apiError("Cannot grant permissions you do not have", 403, {
          invalid,
        });
      }
    }

    if (payload.name !== undefined) user.name = payload.name;
    if (payload.email !== undefined) user.email = payload.email.toLowerCase();
    if (payload.role !== undefined) user.role = payload.role;
    if (payload.isActive !== undefined) user.isActive = payload.isActive;
    if (payload.permissions !== undefined) {
      user.permissions =
        (payload.role ?? user.role) === "superadmin"
          ? []
          : payload.permissions;
    }
    if (payload.password) {
      user.passwordHash = await hashPassword(payload.password);
    }

    if (user.role !== "superadmin" && (user.permissions ?? []).length === 0) {
      return apiError("Select at least one sidebar permission", 400);
    }

    await user.save();

    return apiSuccess({
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions ?? [],
      isActive: user.isActive,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { error, session } = await requirePermission("users");
    if (error || !session) return error!;

    const { id } = await context.params;
    const actorIsSuper = isSuperAdmin(session.user.role);

    await connectToDatabase();

    const user = await AdminUser.findById(id);
    if (!user) return apiError("User not found", 404);

    if (user.role === "superadmin" && !actorIsSuper) {
      return apiError("Cannot delete a superadmin", 403);
    }

    if (String(user._id) === session.user.id) {
      return apiError("You cannot delete your own account", 400);
    }

    await AdminUser.deleteOne({ _id: user._id });

    return apiSuccess({ id, deleted: true });
  } catch (error) {
    return apiFromUnknownError(error);
  }
}
