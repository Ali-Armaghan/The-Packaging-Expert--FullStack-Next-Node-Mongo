import {
  adminNavSections,
  flattenAdminNavItems,
  getAllAdminNavLeaves,
  type AdminNavItem,
  type AdminNavSection,
} from "@/constants/adminNav";

export type AccessProfile = {
  role?: string | null;
  permissions?: string[] | null;
};

export function getAllPermissionIds(): string[] {
  return getAllAdminNavLeaves().map((item) => item.id);
}

export function isSuperAdmin(role?: string | null) {
  return role === "superadmin";
}

export function hasPermission(access: AccessProfile, permissionId: string) {
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

function filterNavItems(
  items: AdminNavItem[],
  allowed: Set<string>,
): AdminNavItem[] {
  return items
    .map((item) => {
      if (item.items?.length) {
        const children = filterNavItems(item.items, allowed);
        if (children.length === 0) return null;
        return { ...item, items: children };
      }
      if (!item.href) return null;
      return allowed.has(item.id) ? item : null;
    })
    .filter((item): item is AdminNavItem => item !== null);
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
      items: filterNavItems(section.items, allowed),
    }))
    .filter((section) => section.items.length > 0);
}

export function getPermissionIdForPath(pathname: string): string | null {
  if (pathname === "/admin" || pathname === "/admin/") {
    return "dashboard";
  }

  const allItems = getAllAdminNavLeaves();

  const exact = allItems.find((item) => item.href === pathname);
  if (exact) return exact.id;

  const prefix = allItems
    .filter(
      (item) =>
        item.href &&
        item.href !== "/admin" &&
        pathname.startsWith(`${item.href}/`),
    )
    .sort((a, b) => (b.href?.length ?? 0) - (a.href?.length ?? 0))[0];

  return prefix?.id ?? null;
}

export function canAccessPath(access: AccessProfile, pathname: string) {
  if (pathname.startsWith("/admin/login")) return true;
  if (isSuperAdmin(access.role)) return true;

  const permissionId = getPermissionIdForPath(pathname);
  if (!permissionId) {
    return (access.permissions ?? []).length > 0;
  }

  return hasPermission(access, permissionId);
}

export function getDefaultLandingPath(access: AccessProfile) {
  if (isSuperAdmin(access.role) || hasPermission(access, "dashboard")) {
    return "/admin";
  }

  const first = filterNavByPermissions(access)
    .flatMap((section) => flattenAdminNavItems(section.items))
    .find((item) => item.href);

  return first?.href ?? "/admin/login";
}
