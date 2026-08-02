import { Schema, models, model, type InferSchemaType, type Model } from "mongoose";

const faqSchema = new Schema(
  {
    question: { type: String, required: true, trim: true, maxlength: 300 },
    answer: { type: String, required: true, trim: true, maxlength: 20000 },
  },
  { _id: false },
);

const blogImageDetailSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 2000 },
    image: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const industrySchema = new Schema(
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
    icon: { type: String, trim: true },

    pageTitle: { type: String, trim: true, maxlength: 200 },
    shortDescription: { type: String, trim: true, maxlength: 1000 },
    types: [{ type: String, trim: true, maxlength: 120 }],

    faqs: { type: [faqSchema], default: [] },
    blogImageDetails: { type: [blogImageDetailSchema], default: [] },
    attachedImages: [{ type: String, trim: true }],

    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

industrySchema.index({ isActive: 1, sortOrder: 1 });
industrySchema.index({ name: 1 });

export type IndustryDocument = InferSchemaType<typeof industrySchema> & {
  _id: Schema.Types.ObjectId;
};

export const Industry: Model<IndustryDocument> =
  models.Industry || model<IndustryDocument>("Industry", industrySchema);
