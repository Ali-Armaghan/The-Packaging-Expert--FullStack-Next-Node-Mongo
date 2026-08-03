import { Schema, models, model, type InferSchemaType, type Model } from "mongoose";

export const BLOG_CATEGORIES = [
  "marketing",
  "business",
  "events",
  "customer-success",
  "sustainability",
] as const;

export type BlogCategoryId = (typeof BLOG_CATEGORIES)[number];

const featuredImageSchema = new Schema(
  {
    url: { type: String, trim: true, default: "" },
    alt: { type: String, trim: true, maxlength: 300, default: "" },
  },
  { _id: false },
);

const blogPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 220,
    },
    excerpt: { type: String, trim: true, maxlength: 500, default: "" },
    content: { type: String, default: "" },
    featuredImage: { type: featuredImageSchema, default: () => ({}) },
    category: {
      type: String,
      enum: BLOG_CATEGORIES,
      required: true,
      index: true,
    },
    categoryLabel: { type: String, trim: true, maxlength: 80, default: "" },
    tags: [{ type: String, trim: true, maxlength: 60 }],
    authorName: { type: String, trim: true, maxlength: 120, default: "" },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    featured: { type: Boolean, default: false },
    featuredSidebar: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    sortOrder: { type: Number, default: 0 },

    seoTitle: { type: String, trim: true, maxlength: 70, default: "" },
    seoDescription: { type: String, trim: true, maxlength: 180, default: "" },
    seoKeywords: [{ type: String, trim: true, maxlength: 60 }],
    canonicalUrl: { type: String, trim: true, maxlength: 500, default: "" },
    ogImage: { type: String, trim: true, default: "" },
    ogTitle: { type: String, trim: true, maxlength: 100, default: "" },
    ogDescription: { type: String, trim: true, maxlength: 200, default: "" },
    robotsIndex: { type: Boolean, default: true },
    robotsFollow: { type: Boolean, default: true },
    focusKeyword: { type: String, trim: true, maxlength: 100, default: "" },
  },
  { timestamps: true },
);

blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1, status: 1, publishedAt: -1 });
blogPostSchema.index({ title: "text", excerpt: "text", tags: "text" });

export type BlogPostDocument = InferSchemaType<typeof blogPostSchema> & {
  _id: Schema.Types.ObjectId;
};

export const BlogPost: Model<BlogPostDocument> =
  models.BlogPost || model<BlogPostDocument>("BlogPost", blogPostSchema);
