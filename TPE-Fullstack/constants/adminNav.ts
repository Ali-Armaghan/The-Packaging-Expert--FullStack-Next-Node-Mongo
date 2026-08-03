export type AdminNavIcon =
  | "dashboard"
  | "products"
  | "categories"
  | "industries"
  | "blog"
  | "menu"
  | "tags"
  | "authors"
  | "media"
  | "pages"
  | "landing"
  | "testimonials"
  | "content"
  | "quotes"
  | "leads"
  | "performance"
  | "logs"
  | "settings"
  | "users"
  | "roles"
  | "catalog"
  | "style"
  | "analytics"
  | "admin";

export type AdminNavItem = {
  id: string;
  label: string;
  icon: AdminNavIcon;
  /** Leaf routes only — parents use nested `items` */
  href?: string;
  items?: AdminNavItem[];
};

export type AdminNavSection = {
  id: string;
  title?: string;
  items: AdminNavItem[];
};

/** Flatten to permission-bearing leaf items (those with href). */
export function flattenAdminNavItems(items: AdminNavItem[]): AdminNavItem[] {
  return items.flatMap((item) =>
    item.items?.length ? flattenAdminNavItems(item.items) : item.href ? [item] : [],
  );
}

export function getAllAdminNavLeaves(): AdminNavItem[] {
  return adminNavSections.flatMap((section) =>
    flattenAdminNavItems(section.items),
  );
}

export const adminNavSections: AdminNavSection[] = [
  {
    id: "platform",
    title: "Platform",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/admin",
        icon: "dashboard",
      },
      {
        id: "catalog",
        label: "Catalog",
        icon: "catalog",
        items: [
          {
            id: "industries",
            label: "Industries",
            href: "/admin/industries",
            icon: "industries",
          },
          {
            id: "categories",
            label: "Categories",
            href: "/admin/categories",
            icon: "categories",
          },
          {
            id: "style",
            label: "Style",
            href: "/admin/styles",
            icon: "style",
          },
          {
            id: "products",
            label: "Products",
            href: "/admin/products",
            icon: "products",
          },
        ],
      },
      {
        id: "blog-group",
        label: "Blog",
        icon: "blog",
        items: [
          { id: "blog", label: "Posts", href: "/admin/blog", icon: "blog" },
          {
            id: "blog-menu",
            label: "Blog Menu",
            href: "/admin/blog/menu",
            icon: "menu",
          },
          { id: "tags", label: "Tags", href: "/admin/tags", icon: "tags" },
          {
            id: "authors",
            label: "Authors",
            href: "/admin/authors",
            icon: "authors",
          },
          { id: "media", label: "Media", href: "/admin/media", icon: "media" },
        ],
      },
      {
        id: "site-content",
        label: "Site Content",
        icon: "content",
        items: [
          { id: "pages", label: "Pages", href: "/admin/pages", icon: "pages" },
          {
            id: "landing",
            label: "Landing Pages",
            href: "/admin/landing-pages",
            icon: "landing",
          },
          {
            id: "testimonials",
            label: "Testimonials",
            href: "/admin/testimonials",
            icon: "testimonials",
          },
          {
            id: "content",
            label: "Site Content",
            href: "/admin/site-content",
            icon: "content",
          },
        ],
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: "analytics",
        items: [
          {
            id: "quotes",
            label: "Quotes",
            href: "/admin/quotes",
            icon: "quotes",
          },
          {
            id: "leads",
            label: "Contact Leads",
            href: "/admin/leads",
            icon: "leads",
          },
          {
            id: "performance",
            label: "Performance",
            href: "/admin/performance",
            icon: "performance",
          },
          { id: "logs", label: "Logs", href: "/admin/logs", icon: "logs" },
        ],
      },
      {
        id: "admin",
        label: "Administration",
        icon: "admin",
        items: [
          {
            id: "settings",
            label: "Settings",
            href: "/admin/settings",
            icon: "settings",
          },
          { id: "users", label: "Users", href: "/admin/users", icon: "users" },
          { id: "roles", label: "Roles", href: "/admin/roles", icon: "roles" },
        ],
      },
    ],
  },
];

export function getAdminNavSectionLabel(sectionId: string, title?: string) {
  if (title) return title;
  if (sectionId === "platform") return "Platform";
  return sectionId;
}
