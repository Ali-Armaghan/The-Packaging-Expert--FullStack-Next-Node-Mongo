import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined));

const optionalPositive = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  return value;
}, z.coerce.number().positive().optional());

const optionalPositiveInt = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  return value;
}, z.coerce.number().int().positive().optional());

export const quoteRequestSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  phone: optionalText(40),
  company: optionalText(120),
  productType: optionalText(120),
  industry: optionalText(120),
  quantity: optionalPositiveInt,
  length: optionalPositive,
  width: optionalPositive,
  height: optionalPositive,
  unit: z.enum(["in", "cm", "mm"]).optional().default("in"),
  zip: optionalText(20),
  material: optionalText(120),
  color: optionalText(120),
  printing: optionalText(120),
  coating: optionalText(120),
  thickness: optionalText(80),
  addOn: optionalText(160),
  notes: optionalText(5000),
  sourcePage: z.enum(["home", "quote", "product"]).optional(),
  sourcePath: optionalText(300),
  productId: optionalText(40),
  productSlug: optionalText(160),
  sourceProductName: optionalText(160),
  journey: z
    .array(
      z.object({
        path: z.string().trim().min(1).max(300),
        title: z.string().trim().max(160).optional().default(""),
        durationMs: z.coerce.number().int().min(0).max(86_400_000),
        visitedAt: z.coerce.number().int().optional(),
      }),
    )
    .max(30)
    .optional(),
  step: z.coerce.number().int().min(1).max(3).optional().default(1),
  complete: z.boolean().optional().default(false),
});

export const quoteUpdateSchema = quoteRequestSchema
  .omit({ unit: true, step: true, complete: true })
  .partial()
  .extend({
    unit: z.enum(["in", "cm", "mm"]).optional(),
    step: z.coerce.number().int().min(1).max(3).optional(),
    complete: z.boolean().optional(),
  });

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
export type QuoteUpdateInput = z.infer<typeof quoteUpdateSchema>;
