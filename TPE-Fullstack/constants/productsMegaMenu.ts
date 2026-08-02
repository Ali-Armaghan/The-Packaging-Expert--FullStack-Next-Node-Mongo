export type MegaMenuItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
};

export type MegaMenuGroup = {
  title: string;
  items: MegaMenuItem[];
};

export const productsMegaMenuGroups: MegaMenuGroup[] = [
  {
    title: "Products",
    items: [
      {
        id: "folding-carton",
        title: "Folding Carton",
        description: "Versatile all-round packaging.",
        image: "/images/catalog/product-packaging.png",
        href: "/products/folding-carton",
      },
      {
        id: "corrugated",
        title: "Corrugated",
        description: "Sturdy and durable packaging.",
        image: "/images/catalog/corrugated-boxes.png",
        href: "/products/corrugated",
      },
      {
        id: "rigid",
        title: "Rigid",
        description: "Premium and luxurious packaging.",
        image: "/images/catalog/rigid-boxes.png",
        href: "/products/rigid",
      },
      {
        id: "display",
        title: "Display",
        description: "Impactful floor and counter displays.",
        image: "/images/catalog/pop-displays.png",
        href: "/products/display",
      },
    ],
  },
  {
    title: "Others",
    items: [
      {
        id: "labels-stickers",
        title: "Labels & Stickers",
        description: "All-purpose custom stickers",
        image: "/images/catalog/stickers-labels.png",
        href: "/products/labels-stickers",
      },
      {
        id: "box-inserts",
        title: "Box Inserts",
        description: "Add protection to your packaging",
        image: "/images/catalog/box-inserts.png",
        href: "/products/box-inserts",
      },
    ],
  },
  {
    title: "Custom Bags",
    items: [
      {
        id: "paper-shopping-bags",
        title: "Paper Shopping Bags",
        description: "Stylish eco-friendly paper bags",
        image: "/images/catalog/shopping-bags.png",
        href: "/products/paper-shopping-bags",
      },
      {
        id: "reusable-bags",
        title: "Reusable Bags",
        description: "Sturdy reusable fabric bags",
        image: "/images/catalog/gift-bags.png",
        href: "/products/reusable-bags",
      },
      {
        id: "mailer-bags",
        title: "Mailer Bags",
        description: "Flexible shipping mailer bags",
        image: "/images/catalog/mailers.png",
        href: "/products/mailer-bags",
      },
      {
        id: "pouches",
        title: "Pouches",
        description: "Flexible food pouches",
        image: "/images/catalog/pouches.png",
        href: "/products/pouches",
      },
      {
        id: "eco-friendly",
        title: "Eco-friendly Packaging",
        description: "Sustainable alternatives to packaging",
        image: "/images/catalog/tissue-paper.png",
        href: "/products/eco-friendly",
      },
      {
        id: "tin",
        title: "Tin",
        description: "Sturdy reusable tin containers",
        image: "/images/catalog/tin-containers.png",
        href: "/products/tin",
      },
    ],
  },
];

export const optionLibraryImages = [
  "/images/catalog/product-packaging.png",
  "/images/catalog/corrugated-boxes.png",
  "/images/catalog/rigid-boxes.png",
  "/images/catalog/pop-displays.png",
  "/images/catalog/shopping-bags.png",
  "/images/catalog/gift-bags.png",
  "/images/catalog/mailers.png",
  "/images/catalog/pouches.png",
  "/images/catalog/tin-containers.png",
  "/images/catalog/stickers-labels.png",
  "/images/catalog/tissue-paper.png",
  "/images/catalog/packaging-tape.png",
] as const;

export const optionLibraryFeature = {
  title: "Option Library",
  description:
    "Want to make a statement with your custom packaging? Browse Packaging Expert's ever-growing library of materials, options and packaging features to find how you can make your new custom packaging as impactful as ever.",
  href: "/options",
  linkLabel: "Browse all options",
} as const;
