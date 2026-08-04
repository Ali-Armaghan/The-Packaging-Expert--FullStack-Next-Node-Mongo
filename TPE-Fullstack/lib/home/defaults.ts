import { catalogCategories } from "@/constants/catalog";
import { features, featuresContent } from "@/constants/features";
import { faqItems } from "@/constants/faq";
import { homeVisionContent } from "@/constants/homeContent";
import { industries } from "@/constants/industries";
import { instagramHandle, instagramPosts } from "@/constants/instagram";
import { processBenefits, processTabs } from "@/constants/process";
import { sustainabilityCards } from "@/constants/sustainability";
import { testimonials } from "@/constants/testimonials";
import type { HomePageContent } from "@/types/homePage";

export function buildDefaultHomePageContent(): Omit<
  HomePageContent,
  "id" | "updatedAt"
> {
  return {
    pageKey: "home",
    hero: {
      title: "Create custom boxes & packaging of your dreams",
      subtitle:
        "Order personalized, high-quality custom printed packaging and branded boxes your customers will love all-in-one place.",
      primaryCta: { label: "Request a Quote", href: "/quote" },
      secondaryCta: { label: "Choose Packaging style", href: "/packaging" },
      image: "/images/hero-packaging.png",
      imageAlt: "Custom branded packaging boxes, mailers, and pouches",
      socialProofText: "3,000+ brands big and small love us!",
      ratingLabel: "4.6 Google Reviews",
      brandLogos: [
        "REVLON",
        "FOUR SEASONS",
        "native pet",
        "GLOSSIER",
        "BOMBAS",
      ],
    },
    features: {
      title: featuresContent.title,
      highlights: [...featuresContent.highlights],
      subtitle: featuresContent.subtitle,
      items: features.map((item, index) => ({
        ...item,
        sortOrder: index,
        isActive: true,
      })),
    },
    expertise: {
      title: homeVisionContent.title,
      description: homeVisionContent.description,
      image: homeVisionContent.image,
      imageAlt: homeVisionContent.imageAlt,
    },
    catalog: {
      title: "One for all solution, for custom printed packaging",
      subtitle:
        "Get everything custom packaging your business needs all in one place.",
      browseCta: { label: "Browse full catalog", href: "/catalog" },
      cards: catalogCategories.map((item, index) => ({
        ...item,
        sortOrder: index,
        isActive: true,
      })),
      ctaCard: {
        titleLines: ["Looking for", "something else?", "We can help."],
        buttonLabel: "Request a custom quote",
        buttonHref: "/quote",
      },
    },
    industries: {
      title: "Shop packaging solutions by industry needs",
      subtitle:
        "Find the perfect packaging solutions tailored to your industry niche.",
      cards: industries.map((item, index) => ({
        ...item,
        sortOrder: index,
        isActive: true,
      })),
    },
    sustainability: {
      cards: sustainabilityCards.map((item, index) => ({
        ...item,
        sortOrder: index,
        isActive: true,
      })),
    },
    howItWorks: {
      title: "Let's find the best packaging for you",
      tabs: processTabs.map((tab, index) => ({
        ...tab,
        sortOrder: index,
        isActive: true,
      })),
      benefits: processBenefits.map((item, index) => ({
        ...item,
        sortOrder: index,
        isActive: true,
      })),
    },
    testimonials: {
      title: "See what our customers say",
      subtitle:
        "Trusted by thousands of brands for quality packaging and reliable service.",
      items: testimonials.map((item, index) => ({
        ...item,
        sortOrder: index,
        isActive: true,
      })),
    },
    faq: {
      title: "Frequently asked questions",
      items: faqItems.map((item, index) => ({
        ...item,
        sortOrder: index,
        isActive: true,
      })),
    },
    instagram: {
      title: "Follow us on Instagram",
      handle: instagramHandle,
      profileUrl: "https://instagram.com/packagingexpert",
      posts: instagramPosts.map((item, index) => ({
        ...item,
        sortOrder: index,
        isActive: true,
      })),
    },
  };
}
