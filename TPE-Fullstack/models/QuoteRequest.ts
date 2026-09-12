import mongoose, { Schema, model, type InferSchemaType, type Model } from "mongoose";

const quoteRequestSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, trim: true, maxlength: 40 },
    company: { type: String, trim: true, maxlength: 120 },
    productType: { type: String, trim: true, maxlength: 120, default: "" },
    industry: { type: String, trim: true, maxlength: 120 },
    quantity: { type: Number, min: 1 },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
      unit: { type: String, enum: ["in", "cm", "mm"], default: "in" },
    },
    zip: { type: String, trim: true, maxlength: 20 },
    material: { type: String, trim: true, maxlength: 120 },
    color: { type: String, trim: true, maxlength: 120 },
    printing: { type: String, trim: true, maxlength: 120 },
    coating: { type: String, trim: true, maxlength: 120 },
    thickness: { type: String, trim: true, maxlength: 80 },
    addOn: { type: String, trim: true, maxlength: 160 },
    notes: { type: String, trim: true, maxlength: 5000 },
    currentStep: { type: Number, min: 1, max: 4, default: 1 },
    status: {
      type: String,
      enum: ["draft", "new", "contacted", "quoted", "closed"],
      default: "draft",
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

if (mongoose.models.QuoteRequest) {
  delete mongoose.models.QuoteRequest;
}

export const QuoteRequest: Model<QuoteRequestDocument> =
  model<QuoteRequestDocument>("QuoteRequest", quoteRequestSchema);
