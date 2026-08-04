import { z } from "zod";
import { HOME_SECTIONS } from "@/types/homePage";

const ctaSchema = z.object({
  label: z.string().trim().max(120),
  href: z.string().trim().max(500),
});

const cardSchema = z.object({
  id: z.string().trim().min(1).max(80),
  title: z.string().trim().max(200),
  description: z.string().trim().max(1000),
  image: z.string().trim().max(1000),
  href: z.string().trim().max(500),
  sortOrder: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const heroSectionSchema = z.object({
  title: z.string().trim().max(300),
  subtitle: z.string().trim().max(800),
  primaryCta: ctaSchema,
  secondaryCta: ctaSchema,
  image: z.string().trim().max(1000),
  imageAlt: z.string().trim().max(300),
  socialProofText: z.string().trim().max(300),
  ratingLabel: z.string().trim().max(120),
  brandLogos: z.array(z.string().trim().max(80)).max(20),
});

export const featuresSectionSchema = z.object({
  title: z.string().trim().max(300),
  highlights: z.array(z.string().trim().max(120)).max(20),
  subtitle: z.string().trim().max(800),
  items: z
    .array(
      z.object({
        id: z.string().trim().min(1).max(80),
        title: z.string().trim().max(200),
        description: z.string().trim().max(800),
        icon: z.enum(["headset", "journey", "ruler", "promise"]),
        sortOrder: z.number().int().optional().default(0),
        isActive: z.boolean().optional().default(true),
      }),
    )
    .max(20),
});

export const expertiseSectionSchema = z.object({
  title: z.string().trim().max(300),
  description: z.string().trim().max(2000),
  image: z.string().trim().max(1000),
  imageAlt: z.string().trim().max(300),
});

export const catalogSectionSchema = z.object({
  title: z.string().trim().max(300),
  subtitle: z.string().trim().max(800),
  browseCta: ctaSchema,
  cards: z.array(cardSchema).max(40),
  ctaCard: z.object({
    titleLines: z.array(z.string().trim().max(120)).max(6),
    buttonLabel: z.string().trim().max(120),
    buttonHref: z.string().trim().max(500),
  }),
});

export const industriesSectionSchema = z.object({
  title: z.string().trim().max(300),
  subtitle: z.string().trim().max(800),
  cards: z.array(cardSchema).max(40),
});

export const sustainabilitySectionSchema = z.object({
  cards: z.array(cardSchema).max(20),
});

export const howItWorksSectionSchema = z.object({
  title: z.string().trim().max(300),
  tabs: z
    .array(
      z.object({
        id: z.string().trim().min(1).max(80),
        label: z.string().trim().max(120),
        image: z.string().trim().max(1000),
        steps: z
          .array(
            z.object({
              id: z.string().trim().min(1).max(80),
              title: z.string().trim().max(200),
              description: z.string().trim().max(800),
              icon: z.enum([
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
              ]),
            }),
          )
          .max(12),
        sortOrder: z.number().int().optional().default(0),
        isActive: z.boolean().optional().default(true),
      }),
    )
    .max(12),
  benefits: z
    .array(
      z.object({
        id: z.string().trim().min(1).max(80),
        title: z.string().trim().max(200),
        description: z.string().trim().max(800),
        icon: z.enum(["minimum", "shipping", "costs", "support"]),
        sortOrder: z.number().int().optional().default(0),
        isActive: z.boolean().optional().default(true),
      }),
    )
    .max(12),
});

export const testimonialsSectionSchema = z.object({
  title: z.string().trim().max(300),
  subtitle: z.string().trim().max(800),
  items: z
    .array(
      z.object({
        id: z.string().trim().min(1).max(80),
        quote: z.string().trim().max(2000),
        name: z.string().trim().max(120),
        role: z.string().trim().max(200),
        avatar: z.string().trim().max(1000),
        rating: z.number().int().min(1).max(5),
        sortOrder: z.number().int().optional().default(0),
        isActive: z.boolean().optional().default(true),
      }),
    )
    .max(40),
});

export const faqSectionSchema = z.object({
  title: z.string().trim().max(300),
  items: z
    .array(
      z.object({
        id: z.string().trim().min(1).max(80),
        question: z.string().trim().max(400),
        answer: z.string().trim().max(4000),
        sortOrder: z.number().int().optional().default(0),
        isActive: z.boolean().optional().default(true),
      }),
    )
    .max(50),
});

export const instagramSectionSchema = z.object({
  title: z.string().trim().max(300),
  handle: z.string().trim().max(80),
  profileUrl: z.string().trim().max(500),
  posts: z
    .array(
      z.object({
        id: z.string().trim().min(1).max(80),
        image: z.string().trim().max(1000),
        alt: z.string().trim().max(300),
        href: z.string().trim().max(500),
        sortOrder: z.number().int().optional().default(0),
        isActive: z.boolean().optional().default(true),
      }),
    )
    .max(24),
});

export const homePageBodySchema = z.object({
  hero: heroSectionSchema,
  features: featuresSectionSchema,
  expertise: expertiseSectionSchema,
  catalog: catalogSectionSchema,
  industries: industriesSectionSchema,
  sustainability: sustainabilitySectionSchema,
  howItWorks: howItWorksSectionSchema,
  testimonials: testimonialsSectionSchema,
  faq: faqSectionSchema,
  instagram: instagramSectionSchema,
});

export const homeSectionPatchSchema = z.object({
  section: z.enum(HOME_SECTIONS),
  data: z.unknown(),
});

export const sectionSchemaMap = {
  hero: heroSectionSchema,
  features: featuresSectionSchema,
  expertise: expertiseSectionSchema,
  catalog: catalogSectionSchema,
  industries: industriesSectionSchema,
  sustainability: sustainabilitySectionSchema,
  howItWorks: howItWorksSectionSchema,
  testimonials: testimonialsSectionSchema,
  faq: faqSectionSchema,
  instagram: instagramSectionSchema,
} as const;
