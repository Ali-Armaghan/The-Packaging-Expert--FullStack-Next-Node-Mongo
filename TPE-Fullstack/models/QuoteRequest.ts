import { Schema, models, model, type InferSchemaType, type Model } from "mongoose";

const quoteRequestSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, trim: true, maxlength: 40 },
    company: { type: String, trim: true, maxlength: 120 },
    productType: { type: String, required: true, trim: true, maxlength: 120 },
    industry: { type: String, trim: true, maxlength: 120 },
    quantity: { type: Number, min: 1 },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
      unit: { type: String, enum: ["in", "cm", "mm"], default: "in" },
    },
    notes: { type: String, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: ["new", "contacted", "quoted", "closed"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true },
);

quoteRequestSchema.index({ createdAt: -1 });
quoteRequestSchema.index({ email: 1 });
quoteRequestSchema.index({ productType: 1 });

export type QuoteRequestDocument = InferSchemaType<typeof quoteRequestSchema> & {
  _id: Schema.Types.ObjectId;
};

export const QuoteRequest: Model<QuoteRequestDocument> =
  models.QuoteRequest ||
  model<QuoteRequestDocument>("QuoteRequest", quoteRequestSchema);
