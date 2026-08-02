import { z } from "zod";

const faqSchema = z.object({
  question: z.string().trim().min(1).max(300),
  answer: z.string().trim().min(1).max(20000),
});

const blogImageDetailSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional().default(""),
  image: z.string().trim().min(1),
});

export const industryBodySchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .max(140)
    .optional()
    .transform((value) => value ?? ""),
  icon: z.string().trim().optional().default(""),
  pageTitle: z.string().trim().max(200).optional().default(""),
  shortDescription: z.string().trim().max(1000).optional().default(""),
  types: z.array(z.string().trim().min(1).max(120)).default([]),
  faqs: z.array(faqSchema).default([]),
  blogImageDetails: z.array(blogImageDetailSchema).default([]),
  attachedImages: z.array(z.string().trim().min(1)).default([]),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

export const createIndustrySchema = industryBodySchema;
export const updateIndustrySchema = industryBodySchema.partial().extend({
  name: z.string().trim().min(2).max(120).optional(),
});

export type IndustryInput = z.infer<typeof industryBodySchema>;
