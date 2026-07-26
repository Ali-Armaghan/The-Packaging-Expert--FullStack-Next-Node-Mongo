import {
  adminNavSections,
  type AdminNavItem,
  type AdminNavSection,
} from "@/constants/adminNav";

export type AccessProfile = {
  role?: string | null;
  permissions?: string[] | null;
};

export function getAllPermissionIds(): string[] {
  return adminNavSections.flatMap((section) =>
    section.items.map((item) => item.id),
  );
}

export function isSuperAdmin(role?: string | null) {
  return role === "superadmin";
}

export function hasPermission(
  access: AccessProfile,
  permissionId: string,
) {
  if (isSuperAdmin(access.role)) return true;
  return (access.permissions ?? []).includes(permissionId);
}

export function hasAnyPermission(
  access: AccessProfile,
  permissionIds: string[],
) {
  if (isSuperAdmin(access.role)) return true;
  return permissionIds.some((id) => (access.permissions ?? []).includes(id));
}

export function filterNavByPermissions(
  access: AccessProfile,
): AdminNavSection[] {
  if (isSuperAdmin(access.role)) {
    return adminNavSections;
  }

  const allowed = new Set(access.permissions ?? []);

  return adminNavSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => allowed.has(item.id)),
    }))
    .filter((section) => section.items.length > 0);
}

export function getPermissionIdForPath(pathname: string): string | null {
  if (pathname === "/admin" || pathname === "/admin/") {
    return "dashboard";
  }

  const allItems: AdminNavItem[] = adminNavSections.flatMap((s) => s.items);

  const exact = allItems.find((item) => item.href === pathname);
  if (exact) return exact.id;

  const prefix = allItems
    .filter((item) => item.href !== "/admin" && pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];

  return prefix?.id ?? null;
}

export function canAccessPath(access: AccessProfile, pathname: string) {
  if (pathname.startsWith("/admin/login")) return true;
  if (isSuperAdmin(access.role)) return true;

  const permissionId = getPermissionIdForPath(pathname);
  if (!permissionId) {
    // Unknown admin sub-route: allow only if user has at least one permission
    return (access.permissions ?? []).length > 0;
  }

  return hasPermission(access, permissionId);
}

export function getDefaultLandingPath(access: AccessProfile) {
  if (isSuperAdmin(access.role) || hasPermission(access, "dashboard")) {
    return "/admin";
  }

  const first = filterNavByPermissions(access)[0]?.items[0];
  return first?.href ?? "/admin/login";
}
