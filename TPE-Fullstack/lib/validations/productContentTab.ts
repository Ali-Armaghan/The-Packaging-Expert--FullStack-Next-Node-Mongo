import { z } from "zod";

export const productContentItemSchema = z.object({
  id: z.string().trim().max(40).optional().default(""),
  title: z.string().trim().min(1).max(160),
  slug: z.string().trim().max(180).optional().default(""),
  image: z.string().trim().max(1000).optional().default(""),
  body: z.string().trim().max(50000).optional().default(""),
  sortOrder: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const productContentSectionSchema = z.object({
  id: z.string().trim().max(40).optional().default(""),
  title: z.string().trim().min(1).max(160),
  sortOrder: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
  items: z.array(productContentItemSchema).max(80).optional().default([]),
});

export const productContentTabBodySchema = z.object({
  name: z.string().trim().min(1).max(80),
  slug: z.string().trim().max(80).optional().default(""),
  sortOrder: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
  sections: z.array(productContentSectionSchema).max(40).optional().default([]),
});

export const createProductContentTabSchema = productContentTabBodySchema;
export const updateProductContentTabSchema = productContentTabBodySchema
  .partial()
  .extend({
    name: z.string().trim().min(1).max(80).optional(),
    sections: z.array(productContentSectionSchema).max(40).optional(),
  });

export type ProductContentTabInput = z.infer<typeof productContentTabBodySchema>;
