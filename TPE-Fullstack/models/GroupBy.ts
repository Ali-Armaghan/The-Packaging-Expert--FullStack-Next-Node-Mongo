import { Schema, models, model, type InferSchemaType, type Model } from "mongoose";
import type { EliteSectionKey } from "@/types/elitePage";

export const GROUP_BY_SECTIONS = [
  "hero",
  "catalog",
  "whyUs",
  "industries",
  "process",
  "features",
  "stats",
  "testimonials",
  "faq",
  "partners",
] as const satisfies readonly EliteSectionKey[];

const groupBySchema = new Schema(
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
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 },
    /** Elite page section payloads (catalog.products not stored — live from Product). */
    content: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

groupBySchema.index({ isActive: 1, sortOrder: 1 });
groupBySchema.index({ name: 1 });
/** Speeds active public lookups (slug already unique). */
groupBySchema.index({ slug: 1, isActive: 1 });

export type GroupByDocument = InferSchemaType<typeof groupBySchema> & {
  _id: Schema.Types.ObjectId;
};

export const GroupBy: Model<GroupByDocument> =
  models.GroupBy || model<GroupByDocument>("GroupBy", groupBySchema);
