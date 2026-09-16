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

export type ProductContentTabSelection = {
  tabId: string;
  itemIds: string[];
};

export type ProductInfoItemView = {
  id: string;
  title: string;
  slug: string;
  image: string;
  href: string;
};

export type ProductInfoSectionView = {
  id: string;
  title: string;
  items: ProductInfoItemView[];
};

export type ProductInfoTabView = {
  id: string;
  label: string;
  sections: ProductInfoSectionView[];
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

export type ProductDimensionField = {
  id: string;
  label: string;
  required?: boolean;
};

export type ProductOrderProcessIcon =
  | "customize"
  | "quote"
  | "consult"
  | "shipping";

export type ProductOrderProcessStep = {
  icon: ProductOrderProcessIcon;
  title: string;
  text: string;
};

export type ProductOrderProcess = {
  title: string;
  description: string;
  steps: ProductOrderProcessStep[];
};

/** Everything the public product page renders beyond core fields. */
export type ProductDetailContent = {
  sku: string;
  breadcrumbLabel: string;
  summary: string;
  gallery: string[];
  /** Length / Width / Depth style number inputs */
  dimensionFields: ProductDimensionField[];
  /** Material / Print / Finishing dropdowns */
  selectors: ProductSelector[];
  /** Chip groups e.g. Additional Options, Add-on */
  optionGroups: ProductOptionGroup[];
  quantityOptions: string[];
  ctaLabel: string;
  ctaHref: string;
  priceNoteLabel: string;
  priceNoteHref: string;
  tabs: ProductTab[];
  /** Selected library tabs/sections for this product. */
  contentTabs: ProductContentTabSelection[];
  /** Resolved public tab content — filled at read time, not stored. */
  infoTabs: ProductInfoTabView[];
  orderProcess: ProductOrderProcess;
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
