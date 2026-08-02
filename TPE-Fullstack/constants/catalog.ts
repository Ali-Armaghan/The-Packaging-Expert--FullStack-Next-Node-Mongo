export type CatalogCategory = {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
};

export const catalogCategories: CatalogCategory[] = [
  {
    id: "product-packaging",
    title: "Product Packaging",
    description: "Standard cardstock boxes made from thin, flexible paperboard.",
    image: "/images/catalog/product-packaging.png",
    href: "/catalog/product-packaging",
  },
  {
    id: "corrugated-boxes",
    title: "Corrugated Boxes",
    description: "Durable 3-layer corrugated cardboard boxes.",
    image: "/images/catalog/corrugated-boxes.png",
    href: "/catalog/corrugated-boxes",
  },
  {
    id: "rigid-boxes",
    title: "Rigid Boxes",
    description: "Luxurious packaging made from thick durable chipboard.",
    image: "/images/catalog/rigid-boxes.png",
    href: "/catalog/rigid-boxes",
  },
  {
    id: "box-inserts",
    title: "Box Inserts",
    description: "Keep your loose products nicely tucked, presented, and protected.",
    image: "/images/catalog/box-inserts.png",
    href: "/catalog/box-inserts",
  },
  {
    id: "shopping-bags",
    title: "Shopping Bags",
    description: "Custom branded paper bags for retail, events, and promotions.",
    image: "/images/catalog/shopping-bags.png",
    href: "/catalog/shopping-bags",
  },
  {
    id: "gift-bags",
    title: "Gift Bags",
    description: "Elegant gift bags that elevate your brand presentation.",
    image: "/images/catalog/gift-bags.png",
    href: "/catalog/gift-bags",
  },
  {
    id: "mailers",
    title: "Mailers & Envelopes",
    description: "Protective bubble and poly mailers built for safe shipping.",
    image: "/images/catalog/mailers.png",
    href: "/catalog/mailers",
  },
  {
    id: "pouches",
    title: "Stand-up Pouches",
    description: "Flexible packaging for food, beauty, and retail products.",
    image: "/images/catalog/pouches.png",
    href: "/catalog/pouches",
  },
  {
    id: "tin-containers",
    title: "Tin Containers",
    description: "Need the added protection and a little bit of uniqueness?",
    image: "/images/catalog/tin-containers.png",
    href: "/catalog/tin-containers",
  },
  {
    id: "pop-displays",
    title: "POP Displays",
    description: "Showcase and highlight your products on counters or store floors.",
    image: "/images/catalog/pop-displays.png",
    href: "/catalog/pop-displays",
  },
  {
    id: "stickers-labels",
    title: "Stickers and Labels",
    description: "Add additional personality to all your products and packaging.",
    image: "/images/catalog/stickers-labels.png",
    href: "/catalog/stickers-labels",
  },
  {
    id: "tissue-paper",
    title: "Tissue Paper and Liners",
    description: "Give your packaging a bit of flair by branding your packaging paper.",
    image: "/images/catalog/tissue-paper.png",
    href: "/catalog/tissue-paper",
  },
  {
    id: "packaging-tape",
    title: "Packaging Tape",
    description: "Don't stop at the box, add your logo to your packaging tape.",
    image: "/images/catalog/packaging-tape.png",
    href: "/catalog/packaging-tape",
  },
  {
    id: "card-inserts",
    title: "Card Inserts",
    description: "Personalize your unboxing experience with a small surprise!",
    image: "/images/catalog/card-inserts.png",
    href: "/catalog/card-inserts",
  },
];
