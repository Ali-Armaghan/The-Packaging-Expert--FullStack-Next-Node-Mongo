import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined));

export const quoteRequestSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  phone: optionalText(40),
  company: optionalText(120),
  productType: z.string().trim().min(1, "Product type is required").max(120),
  industry: optionalText(120),
  quantity: z.coerce.number().int().positive().optional(),
  length: z.coerce.number().positive().optional(),
  width: z.coerce.number().positive().optional(),
  height: z.coerce.number().positive().optional(),
  unit: z.enum(["in", "cm", "mm"]).optional().default("in"),
  notes: optionalText(5000),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
