import { z } from "zod";
import { BLOG_CATEGORIES } from "@/constants/blog";

const featuredImageSchema = z.object({
  url: z.string().trim().optional().default(""),
  alt: z
    .string()
    .trim()
    .max(300, "Featured image alt must be 300 characters or fewer")
    .optional()
    .default(""),
});

const optionalUrl = z
  .string()
  .trim()
  .max(500, "URL must be 500 characters or fewer")
  .refine(
    (value) =>
      value === "" ||
      /^https?:\/\/.+/i.test(value) ||
      value.startsWith("/"),
    "Enter a valid URL (https://…) or leave blank",
  );

export const blogPostBodySchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be 200 characters or fewer"),
  slug: z
    .string()
    .trim()
    .max(220, "Slug must be 220 characters or fewer")
    .optional()
    .default(""),
  excerpt: z
    .string()
    .trim()
    .max(500, "Excerpt must be 500 characters or fewer")
    .optional()
    .default(""),
  content: z.string().optional().default(""),
  featuredImage: featuredImageSchema.optional().default({ url: "", alt: "" }),
  category: z.enum(BLOG_CATEGORIES, {
    message: "Select a valid category",
  }),
  categoryLabel: z
    .string()
    .trim()
    .max(80, "Category label must be 80 characters or fewer")
    .optional()
    .default(""),
  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Tag cannot be empty")
        .max(60, "Each tag must be 60 characters or fewer"),
    )
    .optional()
    .default([]),
  authorName: z
    .string()
    .trim()
    .max(120, "Author name must be 120 characters or fewer")
    .optional()
    .default(""),
  status: z.enum(["draft", "published"]).optional().default("draft"),
  featured: z.boolean().optional().default(false),
  featuredSidebar: z.boolean().optional().default(false),
  publishedAt: z.union([z.string(), z.null()]).optional().nullable(),
  sortOrder: z.number().int().optional().default(0),

  seoTitle: z
    .string()
    .trim()
    .max(70, "SEO title must be 70 characters or fewer")
    .optional()
    .default(""),
  seoDescription: z
    .string()
    .trim()
    .max(180, "SEO description must be 180 characters or fewer")
    .optional()
    .default(""),
  seoKeywords: z
    .array(
      z
        .string()
        .trim()
        .min(1, "SEO keyword cannot be empty")
        .max(60, "Each SEO keyword must be 60 characters or fewer"),
    )
    .optional()
    .default([]),
  canonicalUrl: optionalUrl.optional().default(""),
  ogImage: z.string().trim().optional().default(""),
  ogTitle: z
    .string()
    .trim()
    .max(100, "OG title must be 100 characters or fewer")
    .optional()
    .default(""),
  ogDescription: z
    .string()
    .trim()
    .max(200, "OG description must be 200 characters or fewer")
    .optional()
    .default(""),
  robotsIndex: z.boolean().optional().default(true),
  robotsFollow: z.boolean().optional().default(true),
  focusKeyword: z
    .string()
    .trim()
    .max(100, "Focus keyword must be 100 characters or fewer")
    .optional()
    .default(""),
});

export const createBlogPostSchema = blogPostBodySchema;
export const updateBlogPostSchema = blogPostBodySchema.partial().extend({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be 200 characters or fewer")
    .optional(),
  category: z
    .enum(BLOG_CATEGORIES, { message: "Select a valid category" })
    .optional(),
});

export type BlogPostInput = z.infer<typeof blogPostBodySchema>;

export const BLOG_FIELD_LABELS: Record<string, string> = {
  title: "Title",
  slug: "Slug",
  excerpt: "Excerpt",
  content: "Content",
  "featuredImage.url": "Featured image",
  "featuredImage.alt": "Featured image alt",
  category: "Category",
  categoryLabel: "Category label",
  tags: "Tags",
  authorName: "Author",
  status: "Status",
  seoTitle: "SEO title",
  seoDescription: "SEO description",
  seoKeywords: "SEO keywords",
  canonicalUrl: "Canonical URL",
  ogImage: "OG image",
  ogTitle: "OG title",
  ogDescription: "OG description",
  focusKeyword: "Focus keyword",
  robotsIndex: "Search indexing",
  robotsFollow: "Follow links",
};

type ZodFlatten = {
  formErrors: string[];
  fieldErrors: Record<string, string[] | undefined>;
};

/** Flatten Zod / API details into a simple field → message map. */
export function blogFieldErrorsFromFlatten(
  details: ZodFlatten | null | undefined,
): Record<string, string> {
  if (!details?.fieldErrors) return {};
  const out: Record<string, string> = {};
  for (const [key, messages] of Object.entries(details.fieldErrors)) {
    const msg = messages?.find(Boolean);
    if (!msg) continue;
    // Normalize array indexes: seoKeywords.0 → seoKeywords
    const normalized = key.replace(/\.\d+$/, "");
    if (!out[normalized]) out[normalized] = msg;
  }
  return out;
}

export function summarizeBlogFieldErrors(
  fieldErrors: Record<string, string>,
): string {
  const entries = Object.entries(fieldErrors);
  if (entries.length === 0) return "Validation failed";
  return entries
    .slice(0, 4)
    .map(([key, msg]) => {
      const label = BLOG_FIELD_LABELS[key] ?? key;
      return `${label}: ${msg}`;
    })
    .join(" · ");
}
