import { z } from "zod";
import { GROUP_BY_SECTIONS } from "@/models/GroupBy";
import { isReservedGroupSlug } from "@/lib/groupBy/reservedSlugs";

const ctaSchema = z.object({
  label: z.string().trim().max(120),
  href: z.string().trim().max(500),
});

export const groupByMetaSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .max(140)
    .optional()
    .default("")
    .refine((value) => !value || !isReservedGroupSlug(value), {
      message: "This slug is reserved by the site",
    }),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

export const createGroupBySchema = groupByMetaSchema.extend({
  /** Full elite page content (optional — defaults used when omitted). */
  content: z.record(z.string(), z.unknown()).optional(),
});
export const updateGroupByMetaSchema = groupByMetaSchema.partial().extend({
  name: z.string().trim().min(2).max(120).optional(),
});

export const groupBySectionKeySchema = z.enum(GROUP_BY_SECTIONS);

/** Section payloads — flexible object matching elite shapes. */
export const groupBySectionBodySchema = z.record(z.string(), z.unknown());

export const heroSectionSchema = z.object({
  eyebrow: z.string().trim().max(120),
  brand: z.string().trim().max(200),
  headline: z.string().trim().max(300),
  description: z.string().trim().max(1000),
  image: z.string().trim().max(1000),
  primaryCta: ctaSchema,
  secondaryCta: ctaSchema,
});

export const catalogMetaSectionSchema = z.object({
  eyebrow: z.string().trim().max(120),
  title: z.string().trim().max(300),
  description: z.string().trim().max(1000),
  viewAllHref: z.string().trim().max(500),
  viewAllLabel: z.string().trim().max(120),
  tabs: z.array(z.string().trim().max(80)).max(20),
});
