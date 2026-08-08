import { revalidatePath, revalidateTag } from "next/cache";
import {
  BLOG_INDEX_TAG,
  BLOG_NAV_TAG,
  blogPostTag,
} from "@/lib/cache/tags";

const IMMEDIATE = { expire: 0 } as const;

export function revalidateBlogIndex() {
  revalidateTag(BLOG_INDEX_TAG, IMMEDIATE);
  revalidatePath("/blog");
}

export function revalidateBlogPostSlug(
  ...slugs: Array<string | null | undefined>
) {
  const unique = new Set(
    slugs.map((s) => (s ?? "").trim().toLowerCase()).filter(Boolean),
  );
  for (const slug of unique) {
    revalidateTag(blogPostTag(slug), IMMEDIATE);
    revalidatePath(`/blog/${slug}`);
  }
}

/** After create/update/delete of a public-facing post. */
export function revalidateBlogContent(options: {
  slugs?: Array<string | null | undefined>;
  index?: boolean;
}) {
  if (options.index !== false) {
    revalidateBlogIndex();
  }
  if (options.slugs?.length) {
    revalidateBlogPostSlug(...options.slugs);
  }
}

export function revalidateBlogNav() {
  revalidateTag(BLOG_NAV_TAG, IMMEDIATE);
  revalidatePath("/blog");
  revalidatePath("/blog", "layout");
}
