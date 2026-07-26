import { z } from "zod";
import { getAllPermissionIds } from "@/lib/auth/permissions";
import { ADMIN_ROLES } from "@/models/AdminUser";

const permissionIds = getAllPermissionIds();

export const createAdminUserSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  role: z.enum(ADMIN_ROLES).default("admin"),
  permissions: z
    .array(z.string())
    .default([])
    .transform((ids) => ids.filter((id) => permissionIds.includes(id))),
  isActive: z.boolean().optional().default(true),
});

export const updateAdminUserSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().email().max(160).optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),
  role: z.enum(ADMIN_ROLES).optional(),
  permissions: z
    .array(z.string())
    .optional()
    .transform((ids) =>
      ids ? ids.filter((id) => permissionIds.includes(id)) : undefined,
    ),
  isActive: z.boolean().optional(),
});

export type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>;
export type UpdateAdminUserInput = z.infer<typeof updateAdminUserSchema>;
