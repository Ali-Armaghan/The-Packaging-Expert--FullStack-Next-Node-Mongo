import type { BlogHeaderNavItem } from "@/constants/blogHeader";
import { blogHeaderNavItems } from "@/constants/blogHeader";
import type { NavMenuLocation } from "@/models/NavMenuItem";

export type SerializedNavChild = {
  id: string;
  label: string;
  href: string;
  sortOrder: number;
  isActive: boolean;
};

export type SerializedNavMenuItem = {
  id: string;
  location: NavMenuLocation;
  label: string;
  href: string;
  children: SerializedNavChild[];
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type LeanChild = {
  _id?: { toString(): string };
  label?: string | null;
  href?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
};

type LeanNavDoc = {
  _id: { toString(): string };
  location?: string | null;
  label?: string | null;
  href?: string | null;
  children?: LeanChild[] | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export function serializeNavMenuItem(doc: LeanNavDoc): SerializedNavMenuItem {
  const children = (doc.children ?? [])
    .map((child, index) => ({
      id: child._id ? String(child._id) : `child-${index}`,
      label: child.label ?? "",
      href: child.href ?? "",
      sortOrder: child.sortOrder ?? index,
      isActive: child.isActive ?? true,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    id: String(doc._id),
    location: (doc.location as NavMenuLocation) || "blog-header",
    label: doc.label ?? "",
    href: doc.href ?? "",
    children,
    sortOrder: doc.sortOrder ?? 0,
    isActive: doc.isActive ?? true,
    createdAt: doc.createdAt?.toISOString?.() ?? undefined,
    updatedAt: doc.updatedAt?.toISOString?.() ?? undefined,
  };
}

export function toBlogHeaderNavItem(
  item: SerializedNavMenuItem,
): BlogHeaderNavItem {
  const children = item.children
    .filter((child) => child.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((child) => ({ label: child.label, href: child.href }));

  return {
    label: item.label,
    href: item.href,
    ...(children.length ? { children } : {}),
  };
}

export function getDefaultBlogHeaderSeed() {
  return blogHeaderNavItems.map((item, index) => ({
    location: "blog-header" as const,
    label: item.label,
    href: item.href,
    sortOrder: index,
    isActive: true,
    children: (item.children ?? []).map((child, childIndex) => ({
      label: child.label,
      href: child.href,
      sortOrder: childIndex,
      isActive: true,
    })),
  }));
}
