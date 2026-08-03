import { z } from "zod";
import { BLOG_CATEGORIES } from "@/models/BlogPost";

const featuredImageSchema = z.object({
  url: z.string().trim().optional().default(""),
  alt: z.string().trim().max(300).optional().default(""),
});

export const blogPostBodySchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z.string().trim().max(220).optional().default(""),
  excerpt: z.string().trim().max(500).optional().default(""),
  content: z.string().optional().default(""),
  featuredImage: featuredImageSchema.optional().default({ url: "", alt: "" }),
  category: z.enum(BLOG_CATEGORIES),
  categoryLabel: z.string().trim().max(80).optional().default(""),
  tags: z.array(z.string().trim().min(1).max(60)).optional().default([]),
  authorName: z.string().trim().max(120).optional().default(""),
  status: z.enum(["draft", "published"]).optional().default("draft"),
  featured: z.boolean().optional().default(false),
  featuredSidebar: z.boolean().optional().default(false),
  publishedAt: z.union([z.string(), z.null()]).optional().nullable(),
  sortOrder: z.number().int().optional().default(0),

  seoTitle: z.string().trim().max(70).optional().default(""),
  seoDescription: z.string().trim().max(180).optional().default(""),
  seoKeywords: z.array(z.string().trim().min(1).max(60)).optional().default([]),
  canonicalUrl: z.string().trim().max(500).optional().default(""),
  ogImage: z.string().trim().optional().default(""),
  ogTitle: z.string().trim().max(100).optional().default(""),
  ogDescription: z.string().trim().max(200).optional().default(""),
  robotsIndex: z.boolean().optional().default(true),
  robotsFollow: z.boolean().optional().default(true),
  focusKeyword: z.string().trim().max(100).optional().default(""),
});

export const createBlogPostSchema = blogPostBodySchema;
export const updateBlogPostSchema = blogPostBodySchema.partial().extend({
  title: z.string().trim().min(2).max(200).optional(),
  category: z.enum(BLOG_CATEGORIES).optional(),
});

export type BlogPostInput = z.infer<typeof blogPostBodySchema>;
