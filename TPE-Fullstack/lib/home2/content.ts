export type Home2Cta = {
  label: string;
  href: string;
};

export type Home2FloatImage = {
  src: string;
  alt: string;
};

export type Home2HeroContent = {
  eyebrow: string;
  headline: [string, string];
  accent: string;
  subtitle: string;
  primaryCta: Home2Cta;
  secondaryCta: Home2Cta;
  stats: Array<{ value: string; label: string }>;
  /** Pool of packaging PNGs cycled through the floating stage */
  floatImages: Home2FloatImage[];
};

export const home2Hero: Home2HeroContent = {
  eyebrow: "Custom packaging studio",
  headline: ["Packaging that", "sells itself"],
  accent: "sells itself",
  subtitle:
    "Premium boxes, print-ready finishes, and low minimums — designed for brands that treat the unboxing as part of the product.",
  primaryCta: { label: "Request a Quote", href: "/quote" },
  secondaryCta: { label: "Explore styles", href: "/style" },
  stats: [
    { value: "3,000+", label: "Brands shipped" },
    { value: "8–12 days", label: "Avg. turnaround" },
    { value: "4.6 / 5", label: "Customer rating" },
  ],
  floatImages: [
    {
      src: "https://media.pakfactory.com/media_upload/coding_guide/folding-carton-boxes.webp",
      alt: "Custom folding carton boxes",
    },
    {
      src: "https://media.pakfactory.com/media_upload/coding_guide/corrugated-boxes.webp",
      alt: "Custom corrugated boxes",
    },
    {
      src: "https://media.pakfactory.com/media_upload/coding_guide/rigid-boxes.webp",
      alt: "Custom rigid boxes",
    },
    {
      src: "https://media.pakfactory.com/media_upload/coding_guide/box-packaging-inserts.webp",
      alt: "Custom box packaging inserts",
    },
    {
      src: "https://media.pakfactory.com/media_upload/coding_guide/paper-shopping-bags.webp",
      alt: "Custom paper shopping bags",
    },
  ],
};
