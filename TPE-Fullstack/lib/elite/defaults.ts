import type { ElitePageContent } from "@/types/elitePage";

const img = {
  hero: "https://images.unsplash.com/photo-1607166452427-7e4477079cb9?w=1400&q=85",
  cat1: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=700&q=80",
  cat2: "https://images.unsplash.com/photo-1607166452427-7e4477079cb9?w=700&q=80",
  cat3: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=700&q=80",
  cat4: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&q=80",
  cat5: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=700&q=80",
  cat6: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=700&q=80",
  cat7: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=700&q=80",
  cat8: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=700&q=80",
  cat9: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=700&q=80",
  cat10: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=700&q=80",
  collage1: "https://images.unsplash.com/photo-1607166452427-7e4477079cb9?w=600&q=80",
  collage2: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
  collage3: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80",
  collage4: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
  industry1: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
  industry2: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
  industry3: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
  industry4: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80",
  print: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=1000&q=85",
  design: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1000&q=85",
  review1: "https://images.unsplash.com/photo-1607166452427-7e4477079cb9?w=500&q=80",
  review2: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=80",
  review3: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=80",
  avatar1: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80",
  avatar2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80",
  avatar3: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80",
};

/** Fallback content until /elite is wired to Mongo. */
export const ELITE_PAGE_DEFAULTS: ElitePageContent = {
  hero: {
    eyebrow: "Custom packaging studio",
    brand: "Packaging Expert",
    headline: "Packaging that builds brand identity",
    description:
      "Custom boxes, mailers, and premium finishes designed to protect products and create unboxing moments people remember.",
    image: img.hero,
    primaryCta: { label: "Get a Quote", href: "/quote" },
    secondaryCta: { label: "Browse Products", href: "/catalog" },
  },
  catalog: {
    eyebrow: "Catalog",
    title: "Shop by popular box style",
    description:
      "Explore structures brands reorder again and again — priced to start lean and scale fast.",
    viewAllHref: "/catalog",
    viewAllLabel: "Show all styles",
    tabs: [
      "Mailer boxes",
      "Shipping boxes",
      "Product boxes",
      "Gift boxes",
      "Rigid boxes",
      "Display boxes",
    ],
    products: [
      { name: "Mailer boxes", price: "$0.68", image: img.cat1, href: "/quote" },
      {
        name: "Shipping boxes",
        price: "$0.82",
        image: img.cat2,
        href: "/quote",
      },
      {
        name: "Product boxes",
        price: "$0.95",
        image: img.cat3,
        href: "/quote",
      },
      { name: "Gift boxes", price: "$1.10", image: img.cat4, href: "/quote" },
      { name: "Rigid boxes", price: "$1.45", image: img.cat5, href: "/quote" },
      {
        name: "Display boxes",
        price: "$1.20",
        image: img.cat6,
        href: "/quote",
      },
      {
        name: "Subscription boxes",
        price: "$1.05",
        image: img.cat7,
        href: "/quote",
      },
      {
        name: "Cosmetic boxes",
        price: "$0.90",
        image: img.cat8,
        href: "/quote",
      },
      { name: "Food boxes", price: "$0.75", image: img.cat9, href: "/quote" },
      {
        name: "Apparel boxes",
        price: "$1.15",
        image: img.cat10,
        href: "/quote",
      },
    ],
  },
  whyUs: {
    eyebrow: "Why us",
    title: "Why brands choose us for custom packaging",
    items: [
      {
        title: "Free design support",
        text: "Complimentary dieline and artwork guidance from specialists.",
        icon: "palette",
      },
      {
        title: "Fast turnaround",
        text: "Production and delivery typically within 10–12 business days.",
        icon: "clock",
      },
      {
        title: "Quality guaranteed",
        text: "Premium materials and finishes inspected before every shipment.",
        icon: "shield",
      },
    ],
    collage: [img.collage1, img.collage2, img.collage3, img.collage4],
  },
  industries: {
    eyebrow: "Industries",
    title: "Packaging tailored for every industry",
    items: [
      {
        title: "Food & Beverage",
        subtitle: "Fresh, protective & brand-ready",
        image: img.industry1,
        href: "/industries",
        tone: "bg-[#1a1f2c]/55",
      },
      {
        title: "Beauty & Wellness",
        subtitle: "Luxury finishes that feel premium",
        image: img.industry2,
        href: "/industries",
        tone: "bg-[#2d1f28]/50",
      },
      {
        title: "Retail & Ecommerce",
        subtitle: "Ship-ready mailers & cartons",
        image: img.industry3,
        href: "/industries",
        tone: "bg-[#1a2a24]/55",
      },
      {
        title: "Gifts & Lifestyle",
        subtitle: "Unboxing moments that convert",
        image: img.industry4,
        href: "/industries",
        tone: "bg-[#1f2c1a]/50",
      },
    ],
  },
  process: {
    eyebrow: "Process",
    title: "A simplified process for custom packaging",
    cta: { label: "Get started", href: "/quote" },
    steps: [
      {
        n: "01",
        title: "Connect with our experts",
        text: "Share specs, branding goals, and timeline — we map the right structure and materials.",
      },
      {
        n: "02",
        title: "Review designs & proofs",
        text: "Approve dielines and print-ready proofs so every detail matches before production.",
      },
      {
        n: "03",
        title: "Production & quality check",
        text: "Premium materials, precise print, and inspection on every order before it ships.",
      },
      {
        n: "04",
        title: "Fast delivery to your door",
        text: "On-schedule shipping — packaging ready to pack, brand, and delight customers.",
      },
    ],
  },
  features: {
    blocks: [
      {
        eyebrow: "Print & finish",
        title: "Premium print that makes every unboxing count",
        description:
          "Soft-touch coatings, vivid color, and structural precision — packaging that performs on shelf and in content.",
        image: img.print,
        imageAlt: "Premium printed packaging boxes",
        bullets: [
          "CMYK, Pantone & specialty finishes",
          "Matte, gloss, foil & embossing options",
          "Structural engineering for perfect fit",
        ],
        cta: { label: "Start your project", href: "/quote", variant: "primary" },
        imageSide: "right",
      },
      {
        eyebrow: "Craft",
        title: "Craftsmanship from concept to carton",
        description:
          "Designers and production collaborate so every fold, print, and finish is intentional — built for your product and story.",
        image: img.design,
        imageAlt: "Packaging design craftsmanship",
        cta: {
          label: "Talk to a designer",
          href: "/contact",
          variant: "outline",
        },
        imageSide: "left",
      },
    ],
  },
  stats: {
    items: [
      { value: "40%", label: "Faster average delivery" },
      { value: "50%", label: "Cost savings vs agencies" },
      { value: "25%", label: "Less material waste" },
      { value: "100%", label: "Quality guaranteed" },
    ],
    cta: { label: "About us", href: "/about" },
  },
  testimonials: {
    eyebrow: "Reviews",
    title: "Trusted by customers around the world",
    cta: { label: "View more reviews", href: "/#testimonials" },
    reviews: [
      {
        image: img.review1,
        quote:
          "The unboxing experience elevated our brand overnight. Print quality and structure were flawless.",
        name: "Sarah Chen",
        role: "Founder, Glow Beauty",
        avatar: img.avatar1,
      },
      {
        image: img.review2,
        quote:
          "From quote to delivery everything was clear. Our mailer boxes arrived on time and looked premium.",
        name: "Marcus Reed",
        role: "Ops Lead, Nest Goods",
        avatar: img.avatar2,
      },
      {
        image: img.review3,
        quote:
          "Custom sizing and eco materials were exactly what we needed for our subscription launches.",
        name: "Elena Park",
        role: "Brand Manager, Habit Co.",
        avatar: img.avatar3,
      },
    ],
  },
  faq: {
    eyebrow: "Support",
    title: "Frequently asked questions",
    contactHref: "/contact",
    items: [
      {
        q: "What is the minimum order quantity?",
        a: "Most styles start from low minimums so you can test before scaling. Exact MOQs vary by material and finish.",
      },
      {
        q: "How long does production and shipping take?",
        a: "Typical turnaround is 10–12 business days after artwork approval, depending on quantity and destination.",
      },
      {
        q: "Do you offer free design support?",
        a: "Yes. Our team helps with dielines, file setup, and print-ready artwork for a polished first run.",
      },
      {
        q: "Can I order custom sizes?",
        a: "Absolutely — fully custom dimensions tailored to your product, with no stock-size limitations.",
      },
      {
        q: "What materials and finishes are available?",
        a: "Corrugated, folding carton, rigid, kraft, plus matte, gloss, soft-touch, foil, and more.",
      },
    ],
  },
  partners: {
    brands: ["REVLON", "NESTLÉ", "FOUR SEASONS", "SPOTIFY", "ADIDAS", "LUSH"],
  },
};

export function getEliteDefaults() {
  return ELITE_PAGE_DEFAULTS;
}
