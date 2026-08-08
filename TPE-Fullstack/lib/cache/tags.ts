/** Cache tags for on-demand ISR revalidation. */

export function groupByTag(slug: string) {
  return `groupby-${slug.trim().toLowerCase()}`;
}

export function homeSectionTag(section: string) {
  return `home-${section}`;
}

export const HOME_PAGE_TAG = "home-page";

export const BLOG_INDEX_TAG = "blog-index";
export const BLOG_NAV_TAG = "blog-nav";

export function blogPostTag(slug: string) {
  return `blog-post-${slug.trim().toLowerCase()}`;
}

export const PRODUCT_INDEX_TAG = "product-index";

export function productTag(slug: string) {
  return `product-${slug.trim().toLowerCase()}`;
}
