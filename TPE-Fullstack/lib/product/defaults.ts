import type { ProductDetailContent } from "@/types/product";

/** Seed content for a new product page — admin can edit every field. */
export function getProductDetailDefaults(
  name = "Custom packaging",
): ProductDetailContent {
  return {
    breadcrumbLabel: name,
    summary:
      "Custom packaging with a clean structure and premium print finish — built to protect your product and elevate the unboxing moment.",
    gallery: [],
    selectors: [
      {
        id: "quantity",
        label: "Select Quantity",
        options: ["100", "250", "500", "1000", "2500"],
      },
      {
        id: "print-side",
        label: "Print Side",
        options: ["Outside only", "Inside only", "Both sides"],
      },
      {
        id: "box-style",
        label: "Box Style",
        options: ["Standard", "Custom size"],
      },
    ],
    optionGroups: [
      {
        id: "material",
        label: "Material",
        options: ["Kraft", "Corrugated", "Cardboard", "Rigid"],
      },
      {
        id: "finishing",
        label: "Finishing",
        options: ["Matte", "Gloss", "Soft touch", "Spot UV", "Foil stamping"],
      },
    ],
    quantityOptions: ["100", "250", "500", "1000"],
    ctaLabel: "Add to cart",
    ctaHref: "/quote",
    priceNoteLabel: "Price on request",
    priceNoteHref: "/contact",
    tabs: [
      {
        id: "details",
        label: "Details",
        body: "Durable structure, precise die-lines, and full-colour printing. Every order includes free design support and a digital proof before production.",
      },
      {
        id: "available-options",
        label: "Available Options",
        body: "Choose from kraft, corrugated, cardboard, and rigid stocks with matte, gloss, soft-touch, spot UV, or foil finishes.",
      },
      {
        id: "inspiration",
        label: "Inspiration",
        body: "Browse structures brands reorder again and again — from retail-ready displays to premium gifting.",
      },
      {
        id: "order-process",
        label: "Order Process",
        body: "Share your specs, approve the digital proof, and we produce and ship within 10–12 business days.",
      },
    ],
    highlights: [
      {
        icon: "globe",
        title: "Global sourcing",
        text: "A vetted manufacturing network keeps quality consistent and lead times short.",
      },
      {
        icon: "box",
        title: "Low minimum quantity",
        text: "Start lean with small runs, then scale production as your demand grows.",
      },
      {
        icon: "leaf",
        title: "Eco-friendly choices",
        text: "Recyclable stocks and water-based inks available across every structure.",
      },
    ],
    banner: {
      eyebrow: "Structural packaging",
      title: "Looking for stronger packaging solutions?",
      description:
        "Our structural engineers help you choose the right board, flute, and finish so your packaging performs in transit and on the shelf.",
      buttonLabel: "Explore corrugated packaging",
      buttonHref: "/products",
      image: "",
    },
    featureSections: [
      {
        title: "Captivating packaging, industry-wide",
        description:
          "From food and beverage to cosmetics and apparel, we design packaging that fits your product and your brand story.",
        linkLabel: "Start customizing",
        linkHref: "/quote",
        image: "",
        imageSide: "left",
      },
      {
        title: "Dynamic personalization: endless possibilities",
        description:
          "Combine materials, coatings, inserts, and print effects to create packaging your customers remember.",
        linkLabel: "Start customizing",
        linkHref: "/quote",
        image: "",
        imageSide: "right",
      },
    ],
    relatedTitle: "Related products",
    relatedProductIds: [],
  };
}
