import { Schema, models, model, type InferSchemaType, type Model } from "mongoose";

export const ADMIN_ROLES = ["superadmin", "admin"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

const adminUserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 160,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ADMIN_ROLES,
      default: "admin",
      index: true,
    },
    /** Sidebar nav item ids the user can access (ignored for superadmin) */
    permissions: {
      type: [String],
      default: [],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

adminUserSchema.index({ createdAt: -1 });

export type AdminUserDocument = InferSchemaType<typeof adminUserSchema> & {
  _id: Schema.Types.ObjectId;
};

export const AdminUser: Model<AdminUserDocument> =
  models.AdminUser || model<AdminUserDocument>("AdminUser", adminUserSchema);
