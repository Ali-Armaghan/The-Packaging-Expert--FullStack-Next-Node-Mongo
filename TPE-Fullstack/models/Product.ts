import { Schema, models, model, type InferSchemaType, type Model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 180,
    },
    description: { type: String, trim: true, maxlength: 5000 },
    price: { type: String, trim: true, maxlength: 40, default: "" },
    image: { type: String, trim: true, default: "" },
    category: { type: Schema.Types.ObjectId, ref: "Category", index: true },
    groupByIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "GroupBy",
        index: true,
      },
    ],
    images: [{ type: String, trim: true }],
    industryTags: [{ type: String, trim: true, lowercase: true }],
    /** Flexible packaging specs that vary by category */
    specs: { type: Schema.Types.Mixed, default: {} },
    /** Public product page content (gallery, options, tabs, banners…) */
    detail: { type: Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

productSchema.index({ isActive: 1, sortOrder: 1 });
productSchema.index({ groupByIds: 1, isActive: 1, sortOrder: 1 });
productSchema.index({ industryTags: 1 });
productSchema.index({ name: "text", description: "text" });

export type ProductDocument = InferSchemaType<typeof productSchema> & {
  _id: Schema.Types.ObjectId;
};

export const Product: Model<ProductDocument> =
  models.Product || model<ProductDocument>("Product", productSchema);
