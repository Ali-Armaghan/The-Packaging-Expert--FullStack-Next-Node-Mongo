import { Schema, models, model, type InferSchemaType, type Model } from "mongoose";
import { MENU_LINK_KEYS } from "@/types/menuLinks";

const menuGroupLinkSchema = new Schema(
  {
    menuKey: {
      type: String,
      enum: MENU_LINK_KEYS,
      required: true,
      unique: true,
      index: true,
    },
    /** menuItemId → GroupBy slug */
    links: {
      type: Map,
      of: String,
      default: () => new Map(),
    },
  },
  { timestamps: true },
);

export type MenuGroupLinkDocument = InferSchemaType<
  typeof menuGroupLinkSchema
> & {
  _id: Schema.Types.ObjectId;
};

export const MenuGroupLink: Model<MenuGroupLinkDocument> =
  models.MenuGroupLink ||
  model<MenuGroupLinkDocument>("MenuGroupLink", menuGroupLinkSchema);
