import type { ProductDetailContent } from "@/types/product";

/** Unsplash stock packaging photos for the sample product preview. */
const u = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const IMG = {
  main: u("photo-1607345366928-199ea26cfe3e"),
  gallery2: u("photo-1581235720704-06d3acfcb36f"),
  gallery3: u("photo-1615529182904-14819c35db37"),
  gallery4: u("photo-1607166452427-7e4477079cb9"),
  corrugated: u("photo-1595078475328-1ab05d0a6a0e"),
  rigid: u("photo-1549465220-1a8b9238cd48"),
  inserts: u("photo-1513885535751-8b9238bd345a"),
  bags: u("photo-1553062407-98eeb64c6a62"),
  stickers: u("photo-1618005182384-a83a8bd57fbe"),
  banner: u("photo-1553413077-190dd305871c", 1200),
  feature1: u("photo-1600880292203-757bb62b4baf", 1200),
  feature2: u("photo-1556742049-0cfed4f6a45d", 1200),
} as const;

/** Full mock detail for the sample product page preview. */
export function getSampleProductDetail(): ProductDetailContent {
  const NEED = "Need Consultation";
  return {
    sku: "F064",
    breadcrumbLabel: "Tuck End Sleeve",
    summary:
      "Tuck End Sleeve boxes are ideal for packaging items that need a sleek, protective wrap. Their unique design features tuck-in flaps that secure the product while offering a premium unboxing experience. Perfect for cosmetics, electronics, and gift sets, these boxes can be fully customized in size, print, and finish.",
    gallery: [IMG.main, IMG.gallery2, IMG.gallery3, IMG.gallery4],
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
    quantityOptions: ["100", "250", "500", "1000", "2500", "5000"],
    ctaLabel: "Add to quote",
    ctaHref: "/quote",
    priceNoteLabel: "Price on request",
    priceNoteHref: "/contact",
    tabs: [
      {
        id: "details",
        label: "Details",
        body: "The tuck end sleeve is a clean, wrap-around structure that slides over your primary carton or product. Full-colour CMYK print, precise die-lines, and optional soft-touch or foil finishes make it ideal for shelf impact.\nEvery order includes free design support and a digital proof before production starts.",
      },
      {
        id: "available-options",
        label: "Available Options",
        body: "Materials: kraft, corrugated, cardboard, and rigid board.\nFinishes: matte, gloss, soft-touch lamination, spot UV, foil stamping, embossing, and window patching.\nAdd-ons: inserts, hang tabs, and custom die-cuts.",
      },
      {
        id: "inspiration",
        label: "Inspiration",
        body: "Brands use tuck end sleeves for seasonal drops, limited editions, and retail gift sets. Pair bold outside print with a surprise inside print for a memorable unboxing.",
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
        title: "Bold colour output",
        text: "Vibrant CMYK print that stays sharp on kraft, white board, and coated stocks.",
      },
      {
        icon: "box",
        title: "Lightweight packaging",
        text: "Protects the product without adding bulk — better for shipping and shelf space.",
      },
      {
        icon: "leaf",
        title: "Earth-friendly choice",
        text: "Recyclable board options and water-based inks available on every run.",
      },
    ],
    banner: {
      eyebrow: "Structural packaging",
      title: "Looking for stronger packaging solutions?",
      description:
        "Our structural engineers help you choose the right board, flute, and finish so your packaging performs in transit and on the shelf.",
      buttonLabel: "Explore corrugated packaging",
      buttonHref: "/category",
      image: IMG.banner,
    },
    featureSections: [
      {
        title: "Captivating packaging, industry-wide",
        description:
          "From food and beverage to cosmetics and apparel, we design packaging that fits your product and your brand story.",
        linkLabel: "Start customizing",
        linkHref: "/quote",
        image: IMG.feature1,
        imageSide: "left",
      },
      {
        title: "Dynamic personalization: endless possibilities",
        description:
          "Combine materials, coatings, inserts, and print effects to create packaging your customers remember.",
        linkLabel: "Start customizing",
        linkHref: "/quote",
        image: IMG.feature2,
        imageSide: "right",
      },
    ],
    relatedTitle: "Related products",
    relatedProductIds: [],
  };
}

export const SAMPLE_PRODUCT = {
  name: "Tuck End Sleeve",
  slug: "tuck-end-sleeve",
  description:
    "Custom tuck end sleeve packaging with premium print finishes — built for retail and gifting.",
  price: "From $0.48",
  image: IMG.main,
  images: [IMG.main, IMG.gallery2, IMG.gallery3, IMG.gallery4],
  sortOrder: 0,
} as const;

/** Extra products so the Related Products row looks filled. */
export const SAMPLE_RELATED_PRODUCTS = [
  {
    name: "Corrugated Boxes",
    slug: "corrugated-boxes-sample",
    description: "Durable shipping cartons in custom sizes.",
    price: "From $0.62",
    image: IMG.corrugated,
  },
  {
    name: "Rigid Boxes",
    slug: "rigid-boxes-sample",
    description: "Premium two-piece rigid gift boxes.",
    price: "From $1.20",
    image: IMG.rigid,
  },
  {
    name: "Box Inserts",
    slug: "box-inserts-sample",
    description: "Custom die-cut inserts that lock products in place.",
    price: "From $0.35",
    image: IMG.inserts,
  },
  {
    name: "Paper Bags",
    slug: "paper-bags-sample",
    description: "Branded kraft and coated shopping bags.",
    price: "From $0.28",
    image: IMG.bags,
  },
  {
    name: "Labels & Stickers",
    slug: "labels-stickers-sample",
    description: "Custom labels for bottles, boxes, and retail packs.",
    price: "From $0.08",
    image: IMG.stickers,
  },
] as const;
