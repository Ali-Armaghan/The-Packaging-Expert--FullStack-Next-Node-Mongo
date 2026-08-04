export type HomeCta = {
  label: string;
  href: string;
};

export type HomeCardItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
  sortOrder: number;
  isActive: boolean;
};

export type HomeHeroContent = {
  title: string;
  subtitle: string;
  primaryCta: HomeCta;
  secondaryCta: HomeCta;
  image: string;
  imageAlt: string;
  socialProofText: string;
  ratingLabel: string;
  brandLogos: string[];
};

export type HomeFeatureItem = {
  id: string;
  title: string;
  description: string;
  icon: "headset" | "journey" | "ruler" | "promise";
  sortOrder: number;
  isActive: boolean;
};

export type HomeFeaturesContent = {
  title: string;
  highlights: string[];
  subtitle: string;
  items: HomeFeatureItem[];
};

export type HomeExpertiseContent = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export type HomeCatalogContent = {
  title: string;
  subtitle: string;
  browseCta: HomeCta;
  cards: HomeCardItem[];
  ctaCard: {
    titleLines: string[];
    buttonLabel: string;
    buttonHref: string;
  };
};

export type HomeIndustriesContent = {
  title: string;
  subtitle: string;
  cards: HomeCardItem[];
};

export type HomeSustainabilityContent = {
  cards: HomeCardItem[];
};

export type HomeProcessStep = {
  id: string;
  title: string;
  description: string;
  icon:
    | "choose"
    | "design"
    | "order"
    | "delivery"
    | "check"
    | "upload"
    | "eye"
    | "refresh"
    | "package"
    | "headset"
    | "sliders"
    | "clipboard";
};

export type HomeProcessTab = {
  id: string;
  label: string;
  image: string;
  steps: HomeProcessStep[];
  sortOrder: number;
  isActive: boolean;
};

export type HomeProcessBenefit = {
  id: string;
  title: string;
  description: string;
  icon: "minimum" | "shipping" | "costs" | "support";
  sortOrder: number;
  isActive: boolean;
};

export type HomeHowItWorksContent = {
  title: string;
  tabs: HomeProcessTab[];
  benefits: HomeProcessBenefit[];
};

export type HomeTestimonialItem = {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  sortOrder: number;
  isActive: boolean;
};

export type HomeTestimonialsContent = {
  title: string;
  subtitle: string;
  items: HomeTestimonialItem[];
};

export type HomeFaqItem = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
};

export type HomeFaqContent = {
  title: string;
  items: HomeFaqItem[];
};

export type HomeInstagramPost = {
  id: string;
  image: string;
  alt: string;
  href: string;
  sortOrder: number;
  isActive: boolean;
};

export type HomeInstagramContent = {
  title: string;
  handle: string;
  profileUrl: string;
  posts: HomeInstagramPost[];
};

export type HomePageContent = {
  id: string;
  pageKey: "home";
  hero: HomeHeroContent;
  features: HomeFeaturesContent;
  expertise: HomeExpertiseContent;
  catalog: HomeCatalogContent;
  industries: HomeIndustriesContent;
  sustainability: HomeSustainabilityContent;
  howItWorks: HomeHowItWorksContent;
  testimonials: HomeTestimonialsContent;
  faq: HomeFaqContent;
  instagram: HomeInstagramContent;
  updatedAt?: string;
};

export const HOME_SECTIONS = [
  "hero",
  "features",
  "expertise",
  "catalog",
  "industries",
  "sustainability",
  "howItWorks",
  "testimonials",
  "faq",
  "instagram",
] as const;

export type HomeSectionKey = (typeof HOME_SECTIONS)[number];
