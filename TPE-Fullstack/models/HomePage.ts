import { Schema, models, model, type InferSchemaType, type Model } from "mongoose";

const ctaSchema = new Schema(
  {
    label: { type: String, trim: true, default: "" },
    href: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const cardSchema = new Schema(
  {
    id: { type: String, trim: true, required: true },
    title: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    image: { type: String, trim: true, default: "" },
    href: { type: String, trim: true, default: "" },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: false },
);

const homePageSchema = new Schema(
  {
    pageKey: {
      type: String,
      enum: ["home"],
      required: true,
      unique: true,
      default: "home",
    },
    hero: {
      title: { type: String, default: "" },
      subtitle: { type: String, default: "" },
      primaryCta: { type: ctaSchema, default: () => ({}) },
      secondaryCta: { type: ctaSchema, default: () => ({}) },
      image: { type: String, default: "" },
      imageAlt: { type: String, default: "" },
      socialProofText: { type: String, default: "" },
      ratingLabel: { type: String, default: "" },
      brandLogos: [{ type: String, trim: true }],
    },
    features: {
      title: { type: String, default: "" },
      highlights: [{ type: String, trim: true }],
      subtitle: { type: String, default: "" },
      items: [
        {
          id: { type: String, required: true },
          title: { type: String, default: "" },
          description: { type: String, default: "" },
          icon: {
            type: String,
            enum: ["headset", "journey", "ruler", "promise"],
            default: "headset",
          },
          sortOrder: { type: Number, default: 0 },
          isActive: { type: Boolean, default: true },
          _id: false,
        },
      ],
    },
    expertise: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      image: { type: String, default: "" },
      imageAlt: { type: String, default: "" },
    },
    catalog: {
      title: { type: String, default: "" },
      subtitle: { type: String, default: "" },
      browseCta: { type: ctaSchema, default: () => ({}) },
      cards: { type: [cardSchema], default: [] },
      ctaCard: {
        titleLines: [{ type: String, trim: true }],
        buttonLabel: { type: String, default: "" },
        buttonHref: { type: String, default: "" },
      },
    },
    industries: {
      title: { type: String, default: "" },
      subtitle: { type: String, default: "" },
      cards: { type: [cardSchema], default: [] },
    },
    sustainability: {
      cards: { type: [cardSchema], default: [] },
    },
    howItWorks: {
      title: { type: String, default: "" },
      tabs: [
        {
          id: { type: String, required: true },
          label: { type: String, default: "" },
          image: { type: String, default: "" },
          steps: [
            {
              id: { type: String, required: true },
              title: { type: String, default: "" },
              description: { type: String, default: "" },
              icon: {
                type: String,
                enum: [
                  "choose",
                  "design",
                  "order",
                  "delivery",
                  "check",
                  "upload",
                  "eye",
                  "refresh",
                  "package",
                  "headset",
                  "sliders",
                  "clipboard",
                ],
                default: "choose",
              },
              _id: false,
            },
          ],
          sortOrder: { type: Number, default: 0 },
          isActive: { type: Boolean, default: true },
          _id: false,
        },
      ],
      benefits: [
        {
          id: { type: String, required: true },
          title: { type: String, default: "" },
          description: { type: String, default: "" },
          icon: {
            type: String,
            enum: ["minimum", "shipping", "costs", "support"],
            default: "minimum",
          },
          sortOrder: { type: Number, default: 0 },
          isActive: { type: Boolean, default: true },
          _id: false,
        },
      ],
    },
    testimonials: {
      title: { type: String, default: "" },
      subtitle: { type: String, default: "" },
      items: [
        {
          id: { type: String, required: true },
          quote: { type: String, default: "" },
          name: { type: String, default: "" },
          role: { type: String, default: "" },
          avatar: { type: String, default: "" },
          rating: { type: Number, default: 5, min: 1, max: 5 },
          sortOrder: { type: Number, default: 0 },
          isActive: { type: Boolean, default: true },
          _id: false,
        },
      ],
    },
    faq: {
      title: { type: String, default: "" },
      items: [
        {
          id: { type: String, required: true },
          question: { type: String, default: "" },
          answer: { type: String, default: "" },
          sortOrder: { type: Number, default: 0 },
          isActive: { type: Boolean, default: true },
          _id: false,
        },
      ],
    },
    instagram: {
      title: { type: String, default: "" },
      handle: { type: String, default: "" },
      profileUrl: { type: String, default: "" },
      posts: [
        {
          id: { type: String, required: true },
          image: { type: String, default: "" },
          alt: { type: String, default: "" },
          href: { type: String, default: "" },
          sortOrder: { type: Number, default: 0 },
          isActive: { type: Boolean, default: true },
          _id: false,
        },
      ],
    },
  },
  { timestamps: true },
);

export type HomePageDocument = InferSchemaType<typeof homePageSchema> & {
  _id: Schema.Types.ObjectId;
};

export const HomePage: Model<HomePageDocument> =
  models.HomePage || model<HomePageDocument>("HomePage", homePageSchema);
