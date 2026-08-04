export type ProcessTab = {
  id: string;
  label: string;
  steps: ProcessStep[];
  image: string;
};

export type ProcessStep = {
  id: string;
  title: string;
  description: string;
  icon:
    | "choose"
    | "design"
    | "order"
    | "delivery"
    | "check"
    | "upload"
    | "eye"
    | "refresh"
    | "package"
    | "headset"
    | "sliders"
    | "clipboard";
};

export type ProcessBenefit = {
  id: string;
  title: string;
  description: string;
  icon: "minimum" | "shipping" | "costs" | "support";
};

export const processTabs: ProcessTab[] = [
  {
    id: "choose",
    label: "Choose Style",
    image: "/images/hero-packaging.png",
    steps: [
      {
        id: "browse",
        title: "Browse products",
        description: "Explore our catalog of boxes, bags, mailers, and more.",
        icon: "choose",
      },
      {
        id: "compare",
        title: "Compare options",
        description: "Find the right material, size, and finish for your brand.",
        icon: "sliders",
      },
      {
        id: "select",
        title: "Select your style",
        description: "Pick the packaging that fits your product and budget.",
        icon: "check",
      },
      {
        id: "confirm",
        title: "Confirm details",
        description: "Review specs before moving to design and production.",
        icon: "clipboard",
      },
    ],
  },
  {
    id: "design",
    label: "Design",
    image: "/images/catalog/product-packaging.png",
    steps: [
      {
        id: "upload",
        title: "Upload artwork",
        description: "Share your logo and brand assets with our design team.",
        icon: "upload",
      },
      {
        id: "proof",
        title: "Review proofs",
        description: "Approve digital mockups before anything goes to print.",
        icon: "eye",
      },
      {
        id: "revise",
        title: "Request revisions",
        description: "Work with experts until every detail looks perfect.",
        icon: "refresh",
      },
      {
        id: "finalize",
        title: "Finalize design",
        description: "Lock in your approved artwork for production.",
        icon: "check",
      },
    ],
  },
  {
    id: "order",
    label: "Order",
    image: "/images/catalog/rigid-boxes.png",
    steps: [
      {
        id: "quote",
        title: "Get a quote",
        description: "Receive transparent pricing with no hidden fees.",
        icon: "clipboard",
      },
      {
        id: "approve",
        title: "Approve order",
        description: "Confirm quantity, timeline, and shipping details.",
        icon: "check",
      },
      {
        id: "produce",
        title: "Production begins",
        description: "Your packaging is printed and assembled with care.",
        icon: "package",
      },
      {
        id: "quality",
        title: "Quality check",
        description: "Every order is inspected before it leaves our facility.",
        icon: "eye",
      },
    ],
  },
  {
    id: "delivery",
    label: "Delivery",
    image: "/images/catalog/mailers.png",
    steps: [
      {
        id: "ship",
        title: "Fast shipping",
        description: "Orders ship quickly to your door or warehouse.",
        icon: "delivery",
      },
      {
        id: "track",
        title: "Track progress",
        description: "Stay updated with real-time shipping notifications.",
        icon: "package",
      },
      {
        id: "receive",
        title: "Receive packaging",
        description: "Unbox premium packaging ready for your products.",
        icon: "order",
      },
      {
        id: "support",
        title: "Ongoing support",
        description: "Reorder easily with saved specs and dedicated help.",
        icon: "headset",
      },
    ],
  },
];

export const processBenefits: ProcessBenefit[] = [
  {
    id: "minimums",
    title: "Low minimums",
    description: "Start small and scale as your business grows.",
    icon: "minimum",
  },
  {
    id: "shipping",
    title: "Fast shipping",
    description: "Get your order in as little as 10 business days.",
    icon: "shipping",
  },
  {
    id: "costs",
    title: "No hidden costs",
    description: "Transparent pricing from quote to delivery.",
    icon: "costs",
  },
  {
    id: "support",
    title: "Expert support",
    description: "Dedicated specialists guide you at every step.",
    icon: "support",
  },
];
