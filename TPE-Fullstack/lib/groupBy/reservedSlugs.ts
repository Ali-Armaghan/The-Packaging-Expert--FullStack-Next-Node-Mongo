/** Root single-segment paths that must not be used as Group By slugs. */
export const RESERVED_GROUP_SLUGS = new Set([
  "admin",
  "api",
  "auth",
  "blog",
  "catalog",
  "category",
  "contact",
  "elite",
  "favicon.ico",
  "group-by",
  "industries",
  "login",
  "privacy",
  "products",
  "quote",
  "robots.txt",
  "sign-in",
  "sign-up",
  "sitemap.xml",
  "style",
  "terms",
]);

export function isReservedGroupSlug(slug: string) {
  return RESERVED_GROUP_SLUGS.has(slug.trim().toLowerCase());
}
