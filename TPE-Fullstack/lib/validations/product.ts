import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().max(180).optional().default(""),
  description: z.string().trim().max(5000).optional().default(""),
  price: z.string().trim().max(40).optional().default(""),
  image: z.string().trim().max(1000).optional().default(""),
  groupByIds: z.array(z.string().trim().min(1)).optional().default([]),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

export const updateProductSchema = createProductSchema.partial().extend({
  name: z.string().trim().min(2).max(160).optional(),
});
