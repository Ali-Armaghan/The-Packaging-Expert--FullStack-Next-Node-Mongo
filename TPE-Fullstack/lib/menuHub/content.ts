import { categoryByStyleGroup } from "@/constants/categoryByStyleMenu";
import { industriesMegaMenuColumns } from "@/constants/industriesMegaMenu";
import { productsMegaMenuGroups } from "@/constants/productsMegaMenu";
import type {
  MenuHubContent,
  MenuHubItem,
  MenuHubKey,
  MenuHubSection,
} from "@/types/menuHub";

function item(
  partial: Omit<MenuHubItem, "description" | "image" | "icon"> &
    Partial<MenuHubItem>,
): MenuHubItem {
  return {
    description: "",
    image: "",
    icon: "",
    ...partial,
  };
}

const industries: MenuHubContent = {
  hubKey: "industries",
  hero: {
    eyebrow: "Industries",
    title: "Packaging built for your market",
    description:
      "Explore custom packaging solutions tailored to apparel, food, cosmetics, retail, and dozens more industries.",
    image: "/images/hero-packaging.png",
    imageAlt: "Custom packaging for every industry",
    primaryCta: { label: "Request a quote", href: "/quote" },
    secondaryCta: { label: "View products", href: "/products" },
  },
  intro: {
    title: "Industry-ready packaging expertise",
    body: "Whether you ship apparel, food, or cosmetics, our team designs packaging that protects your product and elevates your brand unboxing experience — with structures proven in real retail and e‑commerce workflows.",
    image: "/images/hero-packaging.png",
    imageAlt: "Packaging samples by industry",
  },
  highlights: [
    {
      id: "fit",
      title: "Category fit",
      description: "Formats and materials matched to your vertical.",
      image: "/images/catalog/product-packaging.png",
    },
    {
      id: "compliance",
      title: "Practical compliance",
      description: "Food-safe, retail-ready, and ship-tested options.",
      image: "/images/catalog/corrugated-boxes.png",
    },
    {
      id: "brand",
      title: "Brand impact",
      description: "Print and finishes that make shelves and unboxings pop.",
      image: "/images/catalog/rigid-boxes.png",
    },
  ],
  sections: [
    {
      id: "browse",
      title: "Browse by industry",
      description: "Pick your market to explore relevant packaging ideas.",
      items: industriesMegaMenuColumns
        .flat()
        .filter((row) => row.id !== "all")
        .map((row) =>
          item({
            id: row.id,
            title: row.label,
            href: row.href,
            icon: row.icon,
          }),
        ),
    },
  ],
  ctaBand: {
    title: "Not sure where to start?",
    description:
      "Tell us about your product — we’ll recommend the right structure.",
    buttonLabel: "Talk to packaging experts",
    buttonHref: "/quote",
    image: "/images/catalog/pop-displays.png",
  },
};

const styles: MenuHubContent = {
  hubKey: "styles",
  hero: {
    eyebrow: "Styles",
    title: "Find packaging by style",
    description:
      "From apparel boxes to bakery and jewellery packaging — choose a style that fits your brand story.",
    image: "/images/catalog/rigid-boxes.png",
    imageAlt: "Packaging styles",
    primaryCta: { label: "Request a quote", href: "/quote" },
    secondaryCta: { label: "View products", href: "/products" },
  },
  intro: {
    title: "Style-led packaging collections",
    body: "Browse popular packaging styles used by brands across fashion, food, and gifting. Each style can be customized for size, print, and finish.",
    image: "/images/catalog/product-packaging.png",
    imageAlt: "Style packaging collage",
  },
  highlights: [
    {
      id: "premium",
      title: "Premium finishes",
      description: "Soft-touch, foil, and spot UV ready options.",
      image: "/images/catalog/rigid-boxes.png",
    },
    {
      id: "fast",
      title: "Production ready",
      description: "Structures proven for e‑commerce and retail.",
      image: "/images/catalog/mailers.png",
    },
    {
      id: "custom",
      title: "Fully customizable",
      description: "Dims, inserts, and branding tailored to you.",
      image: "/images/catalog/box-inserts.png",
    },
  ],
  sections: [
    {
      id: "styles",
      title: "Popular styles",
      description: "Jump into a style collection.",
      items: categoryByStyleGroup.items.map((row) =>
        item({
          id: row.id,
          title: row.title,
          description: row.description,
          href: row.href,
          image: row.image,
        }),
      ),
    },
  ],
  ctaBand: {
    title: "Need a custom style?",
    description: "We’ll help you engineer the right look and structure.",
    buttonLabel: "Start a project",
    buttonHref: "/quote",
    image: "/images/catalog/gift-bags.png",
  },
};

const products: MenuHubContent = {
  hubKey: "products",
  hero: {
    eyebrow: "Products",
    title: "Packaging products & categories",
    description:
      "Explore cartons, corrugated, rigid boxes, bags, labels, and more — all customizable for your brand.",
    image: "/images/catalog/product-packaging.png",
    imageAlt: "Packaging product categories",
    primaryCta: { label: "Request a quote", href: "/quote" },
    secondaryCta: { label: "Browse industries", href: "/industries" },
  },
  intro: {
    title: "Every format, one expert partner",
    body: "From folding cartons to mailer bags, choose a product category to see options, materials, and use cases. Our team helps you specify the right structure at the right cost.",
    image: "/images/catalog/corrugated-boxes.png",
    imageAlt: "Product packaging lineup",
  },
  highlights: [
    {
      id: "range",
      title: "Wide range",
      description: "Boxes, bags, displays, labels, and inserts.",
      image: "/images/catalog/shopping-bags.png",
    },
    {
      id: "quality",
      title: "Quality control",
      description: "Consistent print and structural performance.",
      image: "/images/catalog/stickers-labels.png",
    },
    {
      id: "scale",
      title: "Built to scale",
      description: "Prototype to production quantities.",
      image: "/images/catalog/pouches.png",
    },
  ],
  sections: productsMegaMenuGroups.map((group, gIndex) => {
    const section: MenuHubSection = {
      id: `section-${gIndex}`,
      title: group.title,
      description: "",
      items: group.items.map((row) =>
        item({
          id: row.id,
          title: row.title,
          description: row.description,
          href: row.href,
          image: row.image,
        }),
      ),
    };
    return section;
  }),
  ctaBand: {
    title: "Ready to specify your packaging?",
    description:
      "Share your product details and get a tailored recommendation.",
    buttonLabel: "Get a quote",
    buttonHref: "/quote",
    image: "/images/catalog/tin-containers.png",
  },
};

const HUBS: Record<MenuHubKey, MenuHubContent> = {
  industries,
  styles,
  products,
};

export function getStaticMenuHub(hubKey: MenuHubKey): MenuHubContent {
  return HUBS[hubKey];
}
