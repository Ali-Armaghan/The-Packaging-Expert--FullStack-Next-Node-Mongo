import type { ProductDetailContent } from "@/types/product";

const NEED = "Need Consultation";

/** Seed content for a new product page — admin can edit every field. */
export function getProductDetailDefaults(
  name = "Custom packaging",
): ProductDetailContent {
  return {
    sku: "",
    breadcrumbLabel: name,
    summary:
      "Custom packaging with a clean structure and premium print finish — built to protect your product and elevate the unboxing moment.",
    gallery: [],
    dimensionFields: [
      { id: "length", label: "Length (inch)", required: true },
      { id: "width", label: "Width (inch)", required: true },
      { id: "depth", label: "Depth (inch)", required: true },
    ],
    selectors: [
      {
        id: "material",
        label: "Material",
        options: [NEED, "Kraft", "Corrugated", "Cardboard", "Rigid"],
      },
      {
        id: "print",
        label: "Print",
        options: [NEED, "Outside only", "Inside only", "Both sides"],
      },
      {
        id: "finishing",
        label: "Finishing",
        options: [NEED, "Matte", "Gloss", "Soft touch", "Spot UV"],
      },
    ],
    optionGroups: [
      {
        id: "additional-options",
        label: "Additional Options",
        options: [
          "Foil Stamping",
          "Embossing",
          "Debossing",
          "Window Patching",
        ],
      },
      {
        id: "add-on",
        label: "Add-on",
        options: ["Insert", "Plastic Hang Tab", "Adhesive Strip"],
      },
    ],
    quantityOptions: ["100", "250", "500", "1000", "2500"],
    ctaLabel: "Add to quote",
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
        body: "",
      },
    ],
    orderProcess: {
      title: "Our Ordering Process",
      description:
        "Looking for custom packaging? Make it a breeze by following our four easy steps — soon you'll be on your way to meeting all your packaging needs!",
      steps: [
        {
          icon: "customize",
          title: "Customize your packaging",
          text: "Choose from our vast selection of packaging solutions and customize it with our wide range of options to create your dream packaging.",
        },
        {
          icon: "quote",
          title: "Add to quote and submit",
          text: "After customizing your packaging, simply add it to quote and submit quotation to be reviewed by one of our packaging specialists.",
        },
        {
          icon: "consult",
          title: "Consult with our expert",
          text: "Get expert consultation on your quotation to save on costs, streamline efficiency and reduce environmental impacts.",
        },
        {
          icon: "shipping",
          title: "Production & shipping",
          text: "Once everything is ready for production, have us manage your entire production and shipping! Just sit and wait for your order!",
        },
      ],
    },
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
      buttonHref: "/category",
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
