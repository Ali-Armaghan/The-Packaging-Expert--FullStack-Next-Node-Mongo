import { z } from "zod";
import { NAV_MENU_LOCATIONS } from "@/models/NavMenuItem";

const navChildSchema = z.object({
  id: z.string().optional(),
  label: z.string().trim().min(1).max(120),
  href: z.string().trim().min(1).max(500),
  sortOrder: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const navMenuItemBodySchema = z.object({
  location: z.enum(NAV_MENU_LOCATIONS).optional().default("blog-header"),
  label: z.string().trim().min(1).max(120),
  href: z.string().trim().min(1).max(500),
  children: z.array(navChildSchema).optional().default([]),
  sortOrder: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const createNavMenuItemSchema = navMenuItemBodySchema;
export const updateNavMenuItemSchema = navMenuItemBodySchema.partial().extend({
  label: z.string().trim().min(1).max(120).optional(),
  href: z.string().trim().min(1).max(500).optional(),
});

export const reorderNavMenuSchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(1),
});

export type NavMenuItemInput = z.infer<typeof navMenuItemBodySchema>;
