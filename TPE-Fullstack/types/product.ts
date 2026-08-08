export type ProductHighlightIcon = "globe" | "box" | "leaf" | "shield" | "clock";

export type ProductSelector = {
  id: string;
  label: string;
  options: string[];
};

export type ProductOptionGroup = {
  id: string;
  label: string;
  options: string[];
};

export type ProductTab = {
  id: string;
  label: string;
  body: string;
};

export type ProductHighlight = {
  icon: ProductHighlightIcon;
  title: string;
  text: string;
};

export type ProductBanner = {
  eyebrow: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  image: string;
};

export type ProductFeatureSection = {
  title: string;
  description: string;
  linkLabel: string;
  linkHref: string;
  image: string;
  imageSide: "left" | "right";
};

/** Everything the public product page renders beyond core fields. */
export type ProductDetailContent = {
  breadcrumbLabel: string;
  summary: string;
  gallery: string[];
  selectors: ProductSelector[];
  optionGroups: ProductOptionGroup[];
  quantityOptions: string[];
  ctaLabel: string;
  ctaHref: string;
  priceNoteLabel: string;
  priceNoteHref: string;
  tabs: ProductTab[];
  highlights: ProductHighlight[];
  banner: ProductBanner;
  featureSections: ProductFeatureSection[];
  relatedTitle: string;
  relatedProductIds: string[];
};

export type SerializedProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  image: string;
  images: string[];
  groupByIds: string[];
  isActive: boolean;
  sortOrder: number;
  detail: ProductDetailContent;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductCardItem = {
  id: string;
  name: string;
  slug: string;
  price: string;
  image: string;
};
