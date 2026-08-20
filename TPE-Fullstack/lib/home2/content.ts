/** Shared PakFactory coding-guide assets for /home2 visuals */
const H2_MEDIA = {
  folding:
    "https://media.pakfactory.com/media_upload/coding_guide/folding-carton-boxes.webp",
  corrugated:
    "https://media.pakfactory.com/media_upload/coding_guide/corrugated-boxes.webp",
  rigid:
    "https://media.pakfactory.com/media_upload/coding_guide/rigid-boxes.webp",
  inserts:
    "https://media.pakfactory.com/media_upload/coding_guide/box-packaging-inserts.webp",
  shoppingBags:
    "https://media.pakfactory.com/media_upload/coding_guide/paper-shopping-bags.webp",
  reusableBags:
    "https://media.pakfactory.com/media_upload/coding_guide/reusable-bags.webp",
  mailerBags:
    "https://media.pakfactory.com/media_upload/coding_guide/mailer-bags.webp",
  pouches:
    "https://media.pakfactory.com/media_upload/coding_guide/flexible-pouches.webp",
  tins:
    "https://media.pakfactory.com/media_upload/coding_guide/tin-containers.webp",
  displays:
    "https://media.pakfactory.com/media_upload/coding_guide/pop-displays.webp",
  labels:
    "https://media.pakfactory.com/media_upload/coding_guide/stickers-and-labels.webp",
  tissue:
    "https://media.pakfactory.com/media_upload/coding_guide/tissue-paper-and-liners.webp",
  tape:
    "https://media.pakfactory.com/media_upload/coding_guide/packing-tape.webp",
  cards:
    "https://media.pakfactory.com/media_upload/coding_guide/card-inserts.webp",
} as const;

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

export type Home2Pillar = {
  id: string;
  index: string;
  title: string;
  description: string;
};

export type Home2PillarsContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: Home2Cta;
  pillars: Home2Pillar[];
};

export type Home2CatalogItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
};

export type Home2CatalogContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: Home2Cta;
  hubs: Array<{ label: string; href: string }>;
  categories: Home2CatalogItem[];
  stylesEyebrow: string;
  stylesTitle: string;
  styles: Home2CatalogItem[];
  productsEyebrow: string;
  productsTitle: string;
  products: Home2CatalogItem[];
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
    { src: H2_MEDIA.folding, alt: "Custom folding carton boxes" },
    { src: H2_MEDIA.corrugated, alt: "Custom corrugated boxes" },
    { src: H2_MEDIA.rigid, alt: "Custom rigid boxes" },
    { src: H2_MEDIA.inserts, alt: "Custom box packaging inserts" },
    { src: H2_MEDIA.shoppingBags, alt: "Custom paper shopping bags" },
  ],
};

export type Home2MarqueeItem = {
  id: string;
  src: string;
  alt: string;
  label: string;
};

export type Home2MarqueeContent = {
  items: Home2MarqueeItem[];
};

/** Slow infinite image strip shown directly under the hero. */
export const home2Marquee: Home2MarqueeContent = {
  items: [
    {
      id: "folding",
      src: H2_MEDIA.folding,
      alt: "Folding carton boxes",
      label: "Folding cartons",
    },
    {
      id: "corrugated",
      src: H2_MEDIA.corrugated,
      alt: "Corrugated boxes",
      label: "Corrugated",
    },
    {
      id: "rigid",
      src: H2_MEDIA.rigid,
      alt: "Rigid boxes",
      label: "Rigid boxes",
    },
    {
      id: "inserts",
      src: H2_MEDIA.inserts,
      alt: "Box inserts",
      label: "Inserts",
    },
    {
      id: "shopping-bags",
      src: H2_MEDIA.shoppingBags,
      alt: "Paper shopping bags",
      label: "Shopping bags",
    },
    {
      id: "reusable-bags",
      src: H2_MEDIA.reusableBags,
      alt: "Reusable bags",
      label: "Reusable bags",
    },
    {
      id: "mailer-bags",
      src: H2_MEDIA.mailerBags,
      alt: "Mailer bags",
      label: "Mailer bags",
    },
    {
      id: "pouches",
      src: H2_MEDIA.pouches,
      alt: "Flexible pouches",
      label: "Pouches",
    },
    {
      id: "tins",
      src: H2_MEDIA.tins,
      alt: "Tin containers",
      label: "Tins",
    },
    {
      id: "displays",
      src: H2_MEDIA.displays,
      alt: "POP displays",
      label: "Displays",
    },
    {
      id: "labels",
      src: H2_MEDIA.labels,
      alt: "Stickers and labels",
      label: "Labels",
    },
    {
      id: "tissue",
      src: H2_MEDIA.tissue,
      alt: "Tissue paper and liners",
      label: "Tissue",
    },
    {
      id: "tape",
      src: H2_MEDIA.tape,
      alt: "Packing tape",
      label: "Tape",
    },
    {
      id: "cards",
      src: H2_MEDIA.cards,
      alt: "Card inserts",
      label: "Card inserts",
    },
  ],
};

export type Home2ExploreItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
};

export type Home2ExploreTabId =
  | "industry"
  | "style"
  | "category"
  | "product";

export type Home2ExploreTab = {
  id: Home2ExploreTabId;
  label: string;
  description: string;
  cta: Home2Cta;
  items: Home2ExploreItem[];
};

export type Home2ExploreContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  tabs: Home2ExploreTab[];
};

export const home2Explore: Home2ExploreContent = {
  eyebrow: "Explore",
  title: "Browse by how you shop.",
  subtitle:
    "Jump into industries, styles, categories, or products — pick a tab and find your next format.",
  tabs: [
    {
      id: "industry",
      label: "Industry",
      description: "Packaging tailored to the category you sell in.",
      cta: { label: "All industries", href: "/industries" },
      items: [
        {
          id: "cosmetics",
          title: "Cosmetics",
          description: "Premium unboxing for beauty brands.",
          image: H2_MEDIA.shoppingBags,
          href: "/industries/cosmetics",
        },
        {
          id: "food",
          title: "Food & bakery",
          description: "Shelf-ready packs built for freshness.",
          image: H2_MEDIA.folding,
          href: "/industries/bakery",
        },
        {
          id: "apparel",
          title: "Apparel",
          description: "Fashion boxes that feel intentional.",
          image: H2_MEDIA.reusableBags,
          href: "/industries/apparel",
        },
        {
          id: "candle",
          title: "Candles",
          description: "Gift-ready structures for candle brands.",
          image: H2_MEDIA.rigid,
          href: "/industries/candle",
        },
        {
          id: "coffee",
          title: "Coffee & tea",
          description: "Bags and boxes with natural appeal.",
          image: H2_MEDIA.pouches,
          href: "/industries/coffee-tea",
        },
        {
          id: "beverage",
          title: "Beverage",
          description: "Creative packs that build excitement.",
          image: H2_MEDIA.mailerBags,
          href: "/industries/beverage",
        },
      ],
    },
    {
      id: "style",
      label: "Style",
      description: "Built around how your product shows up.",
      cta: { label: "Browse styles", href: "/style" },
      items: [
        {
          id: "apparel-boxes",
          title: "Apparel Boxes",
          description: "Premium boxes for clothing brands.",
          image: H2_MEDIA.rigid,
          href: "/style",
        },
        {
          id: "food-boxes",
          title: "Food Boxes",
          description: "Safe, compliant food packaging.",
          image: H2_MEDIA.folding,
          href: "/style",
        },
        {
          id: "bakery-boxes",
          title: "Bakery Boxes",
          description: "Cakes, pastries, and baked goods.",
          image: H2_MEDIA.corrugated,
          href: "/style",
        },
        {
          id: "jewellery-boxes",
          title: "Jewellery Boxes",
          description: "Elegant boxes for accessories.",
          image: H2_MEDIA.rigid,
          href: "/style",
        },
        {
          id: "shopping-style",
          title: "Shopping Bags",
          description: "Branded bags for retail moments.",
          image: H2_MEDIA.shoppingBags,
          href: "/style",
        },
        {
          id: "mailer-style",
          title: "Mailer Bags",
          description: "Flexible shipping-ready mailers.",
          image: H2_MEDIA.mailerBags,
          href: "/style",
        },
      ],
    },
    {
      id: "category",
      label: "Category",
      description: "Core formats from cartons to displays.",
      cta: { label: "Browse categories", href: "/category" },
      items: [
        {
          id: "folding",
          title: "Folding Carton",
          description: "Versatile everyday retail packaging.",
          image: H2_MEDIA.folding,
          href: "/category",
        },
        {
          id: "corrugated",
          title: "Corrugated",
          description: "Durable shipping and retail strength.",
          image: H2_MEDIA.corrugated,
          href: "/category",
        },
        {
          id: "rigid",
          title: "Rigid",
          description: "Luxury chipboard presentation.",
          image: H2_MEDIA.rigid,
          href: "/category",
        },
        {
          id: "display",
          title: "POP Displays",
          description: "Counter and floor retail impact.",
          image: H2_MEDIA.displays,
          href: "/category",
        },
        {
          id: "inserts",
          title: "Box Inserts",
          description: "Hold and protect loose products.",
          image: H2_MEDIA.inserts,
          href: "/category",
        },
        {
          id: "labels",
          title: "Stickers & Labels",
          description: "Add personality to every pack.",
          image: H2_MEDIA.labels,
          href: "/category",
        },
      ],
    },
    {
      id: "product",
      label: "Product",
      description: "Specific SKUs ready to customize.",
      cta: { label: "Browse products", href: "/products" },
      items: [
        {
          id: "paper-bags",
          title: "Paper Shopping Bags",
          description: "Eco-friendly retail carriers.",
          image: H2_MEDIA.shoppingBags,
          href: "/products",
        },
        {
          id: "reusable",
          title: "Reusable Bags",
          description: "Sturdy fabric tote options.",
          image: H2_MEDIA.reusableBags,
          href: "/products",
        },
        {
          id: "mailers",
          title: "Mailer Bags",
          description: "Flexible shipping mailers.",
          image: H2_MEDIA.mailerBags,
          href: "/products",
        },
        {
          id: "pouches",
          title: "Flexible Pouches",
          description: "Stand-up packs for food & beauty.",
          image: H2_MEDIA.pouches,
          href: "/products",
        },
        {
          id: "tins",
          title: "Tin Containers",
          description: "Reusable tins with shelf presence.",
          image: H2_MEDIA.tins,
          href: "/products",
        },
        {
          id: "tape",
          title: "Packing Tape",
          description: "Logo tape that carries the brand.",
          image: H2_MEDIA.tape,
          href: "/products",
        },
      ],
    },
  ],
};

export const home2Pillars: Home2PillarsContent = {
  eyebrow: "Why brands choose us",
  title: "Everything between your idea and the unboxing.",
  subtitle:
    "Structure, print, and production under one roof — so you ship packaging that looks intentional, not improvised.",
  cta: { label: "Start a project", href: "/quote" },
  pillars: [
    {
      id: "design",
      index: "01",
      title: "Structural design",
      description:
        "Dielines, inserts, and fit engineered around your product — not forced into a stock blank.",
    },
    {
      id: "print",
      index: "02",
      title: "Print that holds up",
      description:
        "Soft-touch, foil, litho, and color-accurate proofs so what you approve is what arrives.",
    },
    {
      id: "speed",
      index: "03",
      title: "Fast, clear turnaround",
      description:
        "Typical projects ship in 8–12 days with dedicated specialists guiding every step.",
    },
    {
      id: "scale",
      index: "04",
      title: "Low MOQs, real scale",
      description:
        "Start lean for launches, then scale the same spec when your brand takes off.",
    },
  ],
};

export const home2Catalog: Home2CatalogContent = {
  eyebrow: "Catalog",
  title: "Every direction your packaging can go.",
  subtitle:
    "Browse formats, styles, and product types — jump straight into the category that fits your brand.",
  cta: { label: "Browse full catalog", href: "/category" },
  hubs: [
    // { label: "Styles", href: "/style" },
    // { label: "Categories", href: "/category" },
    // { label: "Industries", href: "/industries" },
    // { label: "Products", href: "/products" },
  ],
  categories: [
    {
      id: "product-packaging",
      title: "Product Packaging",
      description: "Flexible cardstock boxes for everyday retail.",
      image: H2_MEDIA.folding,
      href: "/category",
    },
    {
      id: "corrugated-boxes",
      title: "Corrugated Boxes",
      description: "Durable 3-layer shipping and retail strength.",
      image: H2_MEDIA.corrugated,
      href: "/category",
    },
    {
      id: "rigid-boxes",
      title: "Rigid Boxes",
      description: "Luxury chipboard for premium unboxing.",
      image: H2_MEDIA.rigid,
      href: "/category",
    },
    {
      id: "box-inserts",
      title: "Box Inserts",
      description: "Hold, present, and protect loose products.",
      image: H2_MEDIA.inserts,
      href: "/category",
    },
    {
      id: "shopping-bags",
      title: "Shopping Bags",
      description: "Branded paper bags for retail and events.",
      image: H2_MEDIA.shoppingBags,
      href: "/style",
    },
    {
      id: "gift-bags",
      title: "Reusable Bags",
      description: "Elevated bags for gifting and launches.",
      image: H2_MEDIA.reusableBags,
      href: "/style",
    },
    {
      id: "mailers",
      title: "Mailers & Envelopes",
      description: "Protective mailers built for safe shipping.",
      image: H2_MEDIA.mailerBags,
      href: "/category",
    },
    {
      id: "pouches",
      title: "Stand-up Pouches",
      description: "Flexible packs for food, beauty, and retail.",
      image: H2_MEDIA.pouches,
      href: "/category",
    },
    {
      id: "tin-containers",
      title: "Tin Containers",
      description: "Reusable tins with a unique shelf presence.",
      image: H2_MEDIA.tins,
      href: "/category",
    },
    {
      id: "pop-displays",
      title: "POP Displays",
      description: "Counter and floor displays that sell in-store.",
      image: H2_MEDIA.displays,
      href: "/category",
    },
    {
      id: "stickers-labels",
      title: "Stickers & Labels",
      description: "Add personality to products and packaging.",
      image: H2_MEDIA.labels,
      href: "/category",
    },
    {
      id: "tissue-paper",
      title: "Tissue & Liners",
      description: "Branded paper that finishes the unboxing.",
      image: H2_MEDIA.tissue,
      href: "/category",
    },
    {
      id: "packaging-tape",
      title: "Packaging Tape",
      description: "Logo tape that carries the brand outside the box.",
      image: H2_MEDIA.tape,
      href: "/category",
    },
    {
      id: "card-inserts",
      title: "Card Inserts",
      description: "Thank-you cards and inserts for the unbox moment.",
      image: H2_MEDIA.cards,
      href: "/category",
    },
  ],
  stylesEyebrow: "Shop by style",
  stylesTitle: "Built for how your product shows up.",
  styles: [
    {
      id: "apparel-boxes",
      title: "Apparel Boxes",
      description: "Fashion and clothing brands.",
      image: H2_MEDIA.rigid,
      href: "/style",
    },
    {
      id: "food-boxes",
      title: "Food Boxes",
      description: "Safe, compliant food packaging.",
      image: H2_MEDIA.folding,
      href: "/style",
    },
    {
      id: "bakery-boxes",
      title: "Bakery Boxes",
      description: "Cakes, pastries, and baked goods.",
      image: H2_MEDIA.corrugated,
      href: "/style",
    },
    {
      id: "jewellery-boxes",
      title: "Jewellery Boxes",
      description: "Elegant boxes for accessories.",
      image: H2_MEDIA.rigid,
      href: "/style",
    },
  ],
  productsEyebrow: "Product directions",
  productsTitle: "Jump into a specific format.",
  products: [
    {
      id: "folding-carton",
      title: "Folding Carton",
      description: "Versatile all-round packaging.",
      image: H2_MEDIA.folding,
      href: "/products",
    },
    {
      id: "corrugated",
      title: "Corrugated",
      description: "Sturdy shipping-ready strength.",
      image: H2_MEDIA.corrugated,
      href: "/products",
    },
    {
      id: "rigid",
      title: "Rigid",
      description: "Premium luxury presentation.",
      image: H2_MEDIA.rigid,
      href: "/products",
    },
    {
      id: "display",
      title: "Display",
      description: "Floor and counter impact.",
      image: H2_MEDIA.displays,
      href: "/products",
    },
    {
      id: "labels-stickers",
      title: "Labels & Stickers",
      description: "Custom stickers that stick.",
      image: H2_MEDIA.labels,
      href: "/products",
    },
    {
      id: "paper-shopping-bags",
      title: "Paper Shopping Bags",
      description: "Eco-friendly retail bags.",
      image: H2_MEDIA.shoppingBags,
      href: "/products",
    },
    {
      id: "reusable-bags",
      title: "Reusable Bags",
      description: "Sturdy fabric carriers.",
      image: H2_MEDIA.reusableBags,
      href: "/products",
    },
    {
      id: "mailer-bags",
      title: "Mailer Bags",
      description: "Flexible shipping mailers.",
      image: H2_MEDIA.mailerBags,
      href: "/products",
    },
    {
      id: "pouches-product",
      title: "Pouches",
      description: "Flexible food & beauty packs.",
      image: H2_MEDIA.pouches,
      href: "/products",
    },
    {
      id: "eco-friendly",
      title: "Eco-friendly",
      description: "Sustainable packaging options.",
      image: H2_MEDIA.tissue,
      href: "/products",
    },
    {
      id: "tin",
      title: "Tin",
      description: "Reusable tin containers.",
      image: H2_MEDIA.tins,
      href: "/products",
    },
    {
      id: "box-inserts-product",
      title: "Box Inserts",
      description: "Protection inside the pack.",
      image: H2_MEDIA.inserts,
      href: "/products",
    },
  ],
};

export type Home2VisionContent = {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  cta: Home2Cta;
  image: string;
  imageAlt: string;
};

export type Home2IndustryCard = {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
};

export type Home2IndustriesContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: Home2Cta;
  items: Home2IndustryCard[];
};

export type Home2ProcessStep = {
  id: string;
  index: string;
  title: string;
  description: string;
};

export type Home2ProcessContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  steps: Home2ProcessStep[];
};

export type Home2Quote = {
  id: string;
  quote: string;
  name: string;
  role: string;
};

export type Home2TestimonialsContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: Home2Quote[];
};

export type Home2ClosingContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: Home2Cta;
  secondaryCta: Home2Cta;
};

export const home2Vision: Home2VisionContent = {
  eyebrow: "In-house production",
  title: "Your vision, precisely made.",
  description:
    "Decades of experience and modern machinery under one roof — from custom prints to intricate structures, every detail lands on-brand.",
  points: [
    "Full control from design through delivery",
    "Color-accurate proofs before you print",
    "Structural engineering for real product fit",
  ],
  cta: { label: "Explore styles", href: "/style" },
  image: H2_MEDIA.displays,
  imageAlt: "Custom packaging production with precision machinery",
};

export const home2Industries: Home2IndustriesContent = {
  eyebrow: "Industries",
  title: "Packaging for the brands you know.",
  subtitle:
    "Whether you ship cosmetics, food, or fashion — we build formats that fit your category and your shelf.",
  cta: { label: "Browse all industries", href: "/industries" },
  items: [
    {
      id: "cosmetics",
      title: "Cosmetics",
      description: "Premium boxes that protect and impress at first unboxing.",
      image: H2_MEDIA.shoppingBags,
      href: "/industries/cosmetics",
    },
    {
      id: "food",
      title: "Food & bakery",
      description: "Shelf-ready structures built for freshness and brand presence.",
      image: H2_MEDIA.folding,
      href: "/industries/bakery",
    },
    {
      id: "apparel",
      title: "Apparel",
      description: "Custom printed clothing boxes that feel as intentional as the fit.",
      image: H2_MEDIA.reusableBags,
      href: "/industries/apparel",
    },
    {
      id: "candle",
      title: "Candles",
      description: "Engineered candle packaging with a personal, gift-ready finish.",
      image: H2_MEDIA.rigid,
      href: "/industries/candle",
    },
    {
      id: "coffee",
      title: "Coffee & tea",
      description: "Functional bags and boxes that reflect natural product appeal.",
      image: H2_MEDIA.pouches,
      href: "/industries/coffee-tea",
    },
    {
      id: "beverage",
      title: "Beverage",
      description: "Creative drink packaging that builds excitement before the pour.",
      image: H2_MEDIA.mailerBags,
      href: "/industries/beverage",
    },
  ],
};

export const home2Process: Home2ProcessContent = {
  eyebrow: "Why Choose Us",
  title: "Your Trusted Custom Packaging Boxes Manufacturers",
  subtitle:
    "Custom Boxes Market is a trusted brand with transparency at all steps. Neither do we ask for plate charges, nor do you have to pay for shipping. Get high-quality printed custom boxes at the fastest rate with a minimum order quantity of 100 boxes. Select your box style and enjoy competitive prices with free design support.",
  steps: [
    {
      id: "no-die-plate",
      index: "01",
      title: "No die & Plate Charge",
      description:
        "No hidden fees or extra plate charges across all custom box orders.",
    },
    {
      id: "offset-printing",
      index: "02",
      title: "High-quality offset printing",
      description:
        "Vibrant, sharp colors and precision detail for every packaging run.",
    },
    {
      id: "turnaround",
      index: "03",
      title: "12 Days Turnaround",
      description:
        "Fast, reliable production delivered right on schedule.",
    },
    {
      id: "moq",
      index: "04",
      title: "Starting from 100 boxes",
      description:
        "Low minimum order quantities to launch, test, and scale with ease.",
    },
    {
      id: "style",
      index: "05",
      title: "Style",
      description:
        "Extensive range of box structures, materials, and custom formats.",
    },
    {
      id: "competitive-price",
      index: "06",
      title: "Competitive price",
      description:
        "Direct-from-manufacturer wholesale rates without cutting quality.",
    },
    {
      id: "design-support",
      index: "07",
      title: "Free Design Support",
      description:
        "Expert dieline guidance, artwork setup, and 3D digital proofing.",
    },
    {
      id: "free-shipping",
      index: "08",
      title: "Free Shipping",
      description:
        "Doorstep delivery with zero shipping charges on every order.",
    },
  ],
};

export const home2Testimonials: Home2TestimonialsContent = {
  eyebrow: "Social proof",
  title: "Brands that unbox with confidence.",
  subtitle: "Real teams shipping real product — and reordering when it works.",
  items: [
    {
      id: "sarah",
      quote:
        "Packaging Expert made our launch packaging effortless. The quality exceeded expectations and our customers love the unboxing experience.",
      name: "Sarah Mitchell",
      role: "Founder, Glow Cosmetics",
    },
    {
      id: "james",
      quote:
        "From design proofs to delivery, the team was responsive and professional. We reordered three times already.",
      name: "James Chen",
      role: "Operations, Bean & Brew Co.",
    },
    {
      id: "emily",
      quote:
        "Custom sizing and low minimums made it easy for our small business to get premium packaging without breaking the budget.",
      name: "Emily Rodriguez",
      role: "CEO, Sweet Crumb Bakery",
    },
    {
      id: "david",
      quote:
        "The sustainability options were a big win for our brand. Great print quality and fast turnaround every time.",
      name: "David Park",
      role: "Brand Manager, Native Goods",
    },
    {
      id: "aisha",
      quote:
        "Our rigid boxes looked exactly like the proof. Unboxing photos from customers basically became our ads.",
      name: "Aisha Khan",
      role: "Creative Lead, Lumen Beauty",
    },
    {
      id: "marcus",
      quote:
        "Clear pricing, quick samples, and a specialist who actually understood food packaging requirements.",
      name: "Marcus Lee",
      role: "Owner, Hearth & Crumb",
    },
  ],
};

export type Home2FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type Home2FaqContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: Home2Cta;
  items: Home2FaqItem[];
};

export const home2Faq: Home2FaqContent = {
  eyebrow: "Support",
  title: "Questions, answered clearly.",
  subtitle:
    "Straight answers on MOQs, timelines, design help, and shipping — before you start a project.",
  cta: { label: "Still need help? Contact us", href: "/contact" },
  items: [
    {
      id: "minimum-order",
      question: "What is the minimum order quantity?",
      answer:
        "Minimums vary by format. Many custom options start around 100 units, with flexible quantities for growing brands. We’ll confirm the right MOQ for your product when you request a quote.",
    },
    {
      id: "turnaround",
      question: "How long does production take?",
      answer:
        "Typical projects ship in about 8–12 days after proof approval. Rush options may be available depending on specs, finishes, and order size.",
    },
    {
      id: "design-help",
      question: "Do you offer design assistance?",
      answer:
        "Yes. Our team provides proofs and helps prepare artwork for print. Share your logo and brand assets — we’ll guide revisions until you’re ready to go to press.",
    },
    {
      id: "materials",
      question: "What materials do you offer?",
      answer:
        "Cardstock, corrugated, rigid board, kraft, pouches, mailers, and more. Eco-friendly and recyclable options are available across many product lines.",
    },
    {
      id: "shipping",
      question: "Do you ship internationally?",
      answer:
        "Yes — we ship across the USA and offer international options. Delivery timelines and costs depend on your location and order size.",
    },
    {
      id: "samples",
      question: "Can I order samples before a bulk run?",
      answer:
        "Sample orders are available for many products so you can review material, print quality, and sizing before committing to full production.",
    },
  ],
};

export type Home2OrderStep = {
  id: string;
  title: string;
  description: string;
};

export type Home2QuoteTopic = {
  id: string;
  label: string;
};

export type Home2QuoteSelectOption = {
  value: string;
  label: string;
};

export type Home2QuoteContent = {
  processTitle: string;
  steps: Home2OrderStep[];
  queriesTitle: string;
  queriesText: string;
  topics: Home2QuoteTopic[];
  formTitle: string;
  submitLabel: string;
  successTitle: string;
  successDescription: string;
  materials: Home2QuoteSelectOption[];
  colors: Home2QuoteSelectOption[];
  printing: Home2QuoteSelectOption[];
  coatings: Home2QuoteSelectOption[];
  thicknesses: Home2QuoteSelectOption[];
  units: Home2QuoteSelectOption[];
};

export const home2Quote: Home2QuoteContent = {
  processTitle: "Our 5-step order process",
  steps: [
    {
      id: "order",
      title: "Order",
      description:
        "You can place the custom order directly through our website.",
    },
    {
      id: "design",
      title: "Design",
      description:
        "Choose from our portfolio of custom designs or provide a layout, pattern, logo, or artwork.",
    },
    {
      id: "approve",
      title: "Approve",
      description:
        "You’ll get an email confirmation once you finalise the custom design.",
    },
    {
      id: "production",
      title: "Production",
      description:
        "Our team develops custom packaging tailor-made to your approved designs.",
    },
    {
      id: "delivery",
      title: "Delivery",
      description:
        "Orders typically deliver within about two weeks after confirmation.",
    },
  ],
  queriesTitle: "Have more queries?",
  queriesText:
    "To know more about our order process, 24/7 customer support is available to handle queries related to:",
  topics: [
    { id: "delivery", label: "Delivery Time" },
    { id: "customization", label: "Customization" },
    { id: "order-size", label: "Order Size" },
    { id: "price", label: "Price Comparison" },
  ],
  formTitle: "Get custom quote",
  submitLabel: "Submit",
  successTitle: "Quote request received",
  successDescription:
    "Thanks — our team will review your specs and follow up shortly.",
  materials: [
    { value: "cardstock", label: "Cardstock" },
    { value: "corrugated", label: "Corrugated" },
    { value: "rigid", label: "Rigid / chipboard" },
    { value: "kraft", label: "Kraft" },
    { value: "other", label: "Other / not sure" },
  ],
  colors: [
    { value: "cmyk", label: "CMYK full color" },
    { value: "spot", label: "Spot color" },
    { value: "one-color", label: "One color" },
    { value: "unprinted", label: "Unprinted" },
  ],
  printing: [
    { value: "outside", label: "Outside only" },
    { value: "inside-outside", label: "Inside + outside" },
    { value: "none", label: "No printing" },
  ],
  coatings: [
    { value: "matte", label: "Matte lamination" },
    { value: "gloss", label: "Gloss lamination" },
    { value: "soft-touch", label: "Soft-touch" },
    { value: "none", label: "No coating" },
  ],
  thicknesses: [
    { value: "14pt", label: "14pt" },
    { value: "16pt", label: "16pt" },
    { value: "18pt", label: "18pt" },
    { value: "24pt", label: "24pt / rigid" },
    { value: "other", label: "Other / not sure" },
  ],
  units: [
    { value: "in", label: "in" },
    { value: "cm", label: "cm" },
    { value: "mm", label: "mm" },
  ],
};

export const home2Closing: Home2ClosingContent = {
  eyebrow: "Ready when you are",
  title: "Let’s build packaging worth opening.",
  subtitle:
    "Tell us about your product — we’ll recommend a format, finish, and timeline that fits.",
  primaryCta: { label: "Request a Quote", href: "/quote" },
  secondaryCta: { label: "Talk to us", href: "/contact" },
};
