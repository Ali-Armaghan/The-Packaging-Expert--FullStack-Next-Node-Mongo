import mongoose, { Schema, models, model, type InferSchemaType, type Model } from "mongoose";

const productContentItemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, trim: true, lowercase: true, maxlength: 180 },
    image: { type: String, trim: true, maxlength: 1000, default: "" },
    body: { type: String, trim: true, maxlength: 50000, default: "" },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: false },
);

const productContentSectionSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    items: [productContentItemSchema],
  },
  { timestamps: false },
);

const productContentTabSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 80,
    },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    sections: [productContentSectionSchema],
  },
  { timestamps: true },
);

productContentTabSchema.index({ isActive: 1, sortOrder: 1 });
productContentTabSchema.index({ "sections.items.slug": 1 });

export type ProductContentTabDocument = InferSchemaType<
  typeof productContentTabSchema
> & {
  _id: Schema.Types.ObjectId;
};

if (mongoose.models.ProductContentTab) {
  delete mongoose.models.ProductContentTab;
}

export const ProductContentTab: Model<ProductContentTabDocument> =
  model<ProductContentTabDocument>(
    "ProductContentTab",
    productContentTabSchema,
  );
