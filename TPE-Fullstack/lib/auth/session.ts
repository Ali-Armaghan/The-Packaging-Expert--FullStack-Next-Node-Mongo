import { auth } from "@/auth";
import { hasPermission } from "@/lib/auth/permissions";
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
