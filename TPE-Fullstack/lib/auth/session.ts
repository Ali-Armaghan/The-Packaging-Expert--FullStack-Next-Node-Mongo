import { auth } from "@/auth";
import {
  getAllPermissionIds,
  hasAnyPermission,
  hasPermission,
} from "@/lib/auth/permissions";
import { apiError } from "@/lib/api/response";

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: apiError("Unauthorized", 401), session: null };
  }
  return { error: null, session };
}

export async function requirePermission(permissionId: string) {
  const { error, session } = await requireSession();
  if (error || !session) {
    return { error: error ?? apiError("Unauthorized", 401), session: null };
  }

  if (
    !hasPermission(
      { role: session.user.role, permissions: session.user.permissions },
      permissionId,
    )
  ) {
    return { error: apiError("Forbidden", 403), session: null };
  }

  return { error: null, session };
}

/** Any logged-in admin with at least one sidebar permission (or superadmin). */
export async function requireAnyAdminPermission() {
  const { error, session } = await requireSession();
  if (error || !session) {
    return { error: error ?? apiError("Unauthorized", 401), session: null };
  }

  const access = {
    role: session.user.role,
    permissions: session.user.permissions,
  };

  if (
    !hasPermission(access, "blog") &&
    !hasPermission(access, "industries") &&
    !hasAnyPermission(access, getAllPermissionIds())
  ) {
    return { error: apiError("Forbidden", 403), session: null };
  }

  return { error: null, session };
}
