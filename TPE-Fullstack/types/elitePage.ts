export type EliteSectionKey =
  | "hero"
  | "catalog"
  | "whyUs"
  | "industries"
  | "process"
  | "features"
  | "stats"
  | "testimonials"
  | "faq"
  | "partners";

export type EliteHeroContent = {
  eyebrow: string;
  brand: string;
  headline: string;
  description: string;
  image: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

export type EliteCatalogContent = {
  eyebrow: string;
  title: string;
  description: string;
  viewAllHref: string;
  viewAllLabel: string;
  tabs: string[];
  products: Array<{
    name: string;
    price: string;
    image: string;
    href: string;
  }>;
};

export type EliteWhyUsContent = {
  eyebrow: string;
  title: string;
  items: Array<{
    title: string;
    text: string;
    icon: "palette" | "clock" | "shield";
  }>;
  collage: string[];
};

export type EliteIndustriesContent = {
  eyebrow: string;
  title: string;
  items: Array<{
    title: string;
    subtitle: string;
    image: string;
    href: string;
    tone: string;
  }>;
};

export type EliteProcessContent = {
  eyebrow: string;
  title: string;
  cta: { label: string; href: string };
  steps: Array<{
    n: string;
    title: string;
    text: string;
  }>;
};

export type EliteFeaturesContent = {
  blocks: Array<{
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    bullets?: string[];
    cta: { label: string; href: string; variant: "primary" | "outline" };
    imageSide: "left" | "right";
  }>;
};

export type EliteStatsContent = {
  items: Array<{ value: string; label: string }>;
  cta: { label: string; href: string };
};

export type EliteTestimonialsContent = {
  eyebrow: string;
  title: string;
  cta: { label: string; href: string };
  reviews: Array<{
    image: string;
    quote: string;
    name: string;
    role: string;
    avatar: string;
  }>;
};

export type EliteFaqContent = {
  eyebrow: string;
  title: string;
  contactHref: string;
  items: Array<{ q: string; a: string }>;
};

export type ElitePartnersContent = {
  brands: string[];
};

export type ElitePageContent = {
  hero: EliteHeroContent;
  catalog: EliteCatalogContent;
  whyUs: EliteWhyUsContent;
  industries: EliteIndustriesContent;
  process: EliteProcessContent;
  features: EliteFeaturesContent;
  stats: EliteStatsContent;
  testimonials: EliteTestimonialsContent;
  faq: EliteFaqContent;
  partners: ElitePartnersContent;
};

export type EliteBelowFoldKey = Exclude<EliteSectionKey, "hero">;
