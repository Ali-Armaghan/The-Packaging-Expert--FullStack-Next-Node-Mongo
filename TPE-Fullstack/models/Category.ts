import { Schema, models, model, type InferSchemaType, type Model } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 140,
    },
    description: { type: String, trim: true, maxlength: 2000 },
    image: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

categorySchema.index({ isActive: 1, sortOrder: 1 });

export type CategoryDocument = InferSchemaType<typeof categorySchema> & {
  _id: Schema.Types.ObjectId;
};

export const Category: Model<CategoryDocument> =
  models.Category || model<CategoryDocument>("Category", categorySchema);
