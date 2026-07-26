export type AdminNavIcon =
  | "dashboard"
  | "products"
  | "categories"
  | "industries"
  | "blog"
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
  | "roles";

export type AdminNavItem = {
  id: string;
  label: string;
  href: string;
  icon: AdminNavIcon;
};

export type AdminNavSection = {
  id: string;
  title?: string;
  items: AdminNavItem[];
};

export const adminNavSections: AdminNavSection[] = [
  {
    id: "main",
    items: [
      { id: "dashboard", label: "Dashboard", href: "/admin", icon: "dashboard" },
      { id: "products", label: "Products", href: "/admin/products", icon: "products" },
      { id: "categories", label: "Categories", href: "/admin/categories", icon: "categories" },
      { id: "industries", label: "Industries", href: "/admin/industries", icon: "industries" },
      { id: "blog", label: "Blog", href: "/admin/blog", icon: "blog" },
      { id: "tags", label: "Tags", href: "/admin/tags", icon: "tags" },
      { id: "authors", label: "Authors", href: "/admin/authors", icon: "authors" },
      { id: "media", label: "Media", href: "/admin/media", icon: "media" },
    ],
  },
  {
    id: "site-content",
    title: "Site Content",
    items: [
      { id: "pages", label: "Pages", href: "/admin/pages", icon: "pages" },
      { id: "landing", label: "Landing Pages", href: "/admin/landing-pages", icon: "landing" },
      { id: "testimonials", label: "Testimonials", href: "/admin/testimonials", icon: "testimonials" },
      { id: "content", label: "Site Content", href: "/admin/site-content", icon: "content" },
    ],
  },
  {
    id: "analytics",
    title: "Analytics",
    items: [
      { id: "quotes", label: "Quotes", href: "/admin/quotes", icon: "quotes" },
      { id: "leads", label: "Contact Leads", href: "/admin/leads", icon: "leads" },
      { id: "performance", label: "Performance", href: "/admin/performance", icon: "performance" },
      { id: "logs", label: "Logs", href: "/admin/logs", icon: "logs" },
    ],
  },
  {
    id: "admin",
    items: [
      { id: "settings", label: "Settings", href: "/admin/settings", icon: "settings" },
      { id: "users", label: "Users", href: "/admin/users", icon: "users" },
      { id: "roles", label: "Roles", href: "/admin/roles", icon: "roles" },
    ],
  },
];

export function getAdminNavSectionLabel(sectionId: string, title?: string) {
  if (title) return title;
  if (sectionId === "main") return "Main";
  if (sectionId === "admin") return "Admin";
  return sectionId;
}
