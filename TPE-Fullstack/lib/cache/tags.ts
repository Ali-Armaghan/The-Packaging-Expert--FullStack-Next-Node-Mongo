/** Cache tags for on-demand ISR revalidation. */

export function groupByTag(slug: string) {
  return `groupby-${slug.trim().toLowerCase()}`;
}

export function homeSectionTag(section: string) {
  return `home-${section}`;
}

export const HOME_PAGE_TAG = "home-page";
