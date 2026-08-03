import { Schema, models, model, type InferSchemaType, type Model } from "mongoose";

export const NAV_MENU_LOCATIONS = ["blog-header"] as const;
export type NavMenuLocation = (typeof NAV_MENU_LOCATIONS)[number];

const navChildSchema = new Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 120 },
    href: { type: String, required: true, trim: true, maxlength: 500 },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true },
);

const navMenuItemSchema = new Schema(
  {
    location: {
      type: String,
      enum: NAV_MENU_LOCATIONS,
      required: true,
      index: true,
      default: "blog-header",
    },
    label: { type: String, required: true, trim: true, maxlength: 120 },
    href: { type: String, required: true, trim: true, maxlength: 500 },
    children: { type: [navChildSchema], default: [] },
    sortOrder: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

navMenuItemSchema.index({ location: 1, sortOrder: 1 });
navMenuItemSchema.index({ location: 1, isActive: 1, sortOrder: 1 });

export type NavMenuItemDocument = InferSchemaType<typeof navMenuItemSchema> & {
  _id: Schema.Types.ObjectId;
};

export const NavMenuItem: Model<NavMenuItemDocument> =
  models.NavMenuItem ||
  model<NavMenuItemDocument>("NavMenuItem", navMenuItemSchema);
