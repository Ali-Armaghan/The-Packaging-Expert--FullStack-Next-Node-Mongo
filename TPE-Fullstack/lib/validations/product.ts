import { z } from "zod";

const optionListSchema = z.array(z.string().trim().max(120)).max(40);

const groupSchema = z.object({
  id: z.string().trim().max(80).optional().default(""),
  label: z.string().trim().min(1).max(120),
  options: optionListSchema.optional().default([]),
});

export const productDetailSchema = z.object({
  breadcrumbLabel: z.string().trim().max(160).optional().default(""),
  summary: z.string().trim().max(2000).optional().default(""),
  gallery: z.array(z.string().trim().max(1000)).max(12).optional().default([]),
  selectors: z.array(groupSchema).max(10).optional().default([]),
  optionGroups: z.array(groupSchema).max(10).optional().default([]),
  quantityOptions: optionListSchema.optional().default([]),
  ctaLabel: z.string().trim().max(80).optional().default(""),
  ctaHref: z.string().trim().max(500).optional().default(""),
  priceNoteLabel: z.string().trim().max(120).optional().default(""),
  priceNoteHref: z.string().trim().max(500).optional().default(""),
  tabs: z
    .array(
      z.object({
        id: z.string().trim().max(80).optional().default(""),
        label: z.string().trim().min(1).max(80),
        body: z.string().trim().max(5000).optional().default(""),
      }),
    )
    .max(8)
    .optional()
    .default([]),
  highlights: z
    .array(
      z.object({
        icon: z
          .enum(["globe", "box", "leaf", "shield", "clock"])
          .optional()
          .default("box"),
        title: z.string().trim().min(1).max(120),
        text: z.string().trim().max(600).optional().default(""),
      }),
    )
    .max(6)
    .optional()
    .default([]),
  banner: z
    .object({
      eyebrow: z.string().trim().max(120).optional().default(""),
      title: z.string().trim().max(240).optional().default(""),
      description: z.string().trim().max(1000).optional().default(""),
      buttonLabel: z.string().trim().max(80).optional().default(""),
      buttonHref: z.string().trim().max(500).optional().default(""),
      image: z.string().trim().max(1000).optional().default(""),
    })
    .optional(),
  featureSections: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(240),
        description: z.string().trim().max(1000).optional().default(""),
        linkLabel: z.string().trim().max(80).optional().default(""),
        linkHref: z.string().trim().max(500).optional().default(""),
        image: z.string().trim().max(1000).optional().default(""),
        imageSide: z.enum(["left", "right"]).optional().default("left"),
      }),
    )
    .max(6)
    .optional()
    .default([]),
  relatedTitle: z.string().trim().max(160).optional().default(""),
  relatedProductIds: z
    .array(z.string().trim().min(1).max(40))
    .max(12)
    .optional()
    .default([]),
});

export const createProductSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().max(180).optional().default(""),
  description: z.string().trim().max(5000).optional().default(""),
  price: z.string().trim().max(40).optional().default(""),
  image: z.string().trim().max(1000).optional().default(""),
  groupByIds: z.array(z.string().trim().min(1)).optional().default([]),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
  detail: productDetailSchema.optional(),
});

export const updateProductSchema = createProductSchema.partial().extend({
  name: z.string().trim().min(2).max(160).optional(),
});
