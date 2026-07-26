import { Schema, models, model, type InferSchemaType, type Model } from "mongoose";

const contactMessageSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, trim: true, maxlength: 40 },
    topic: { type: String, required: true, trim: true, maxlength: 120 },
    company: { type: String, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: ["new", "in_progress", "closed"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true },
);

contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ email: 1 });

export type ContactMessageDocument = InferSchemaType<typeof contactMessageSchema> & {
  _id: Schema.Types.ObjectId;
};

export const ContactMessage: Model<ContactMessageDocument> =
  models.ContactMessage ||
  model<ContactMessageDocument>("ContactMessage", contactMessageSchema);
