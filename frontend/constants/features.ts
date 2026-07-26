export type Feature = {
  id: string;
  title: string;
  description: string;
  icon: "headset" | "journey" | "ruler" | "promise";
};

export const featuresContent = {
  title: "We are your best solution for",
  highlights: [
    "Restaurant Packaging",
    "Luxury Packaging",
    "Eco-Friendly Packaging",
    "Cosmetic Packaging",
    "Retail Packaging",
    "Apparel Packaging",
    "Custom Packaging",
  ],
  subtitle:
    "Never worry about going to multiple sources to get your dream packaging.",
};

export const features: Feature[] = [
  {
    id: "expert-support",
    title: "Dedicated expert support",
    description:
      "Make more informed decisions with unlimited support from our team of product specialists.",
    icon: "headset",
  },
  {
    id: "end-to-end",
    title: "End-to-end solution",
    description:
      "From concept to your door, we simplify your project by handling everything for you.",
    icon: "journey",
  },
  {
    id: "custom-sizing",
    title: "Custom sizing",
    description:
      "Fully control the size of your packaging with no limitations to tailor to your product.",
    icon: "ruler",
  },
  {
    id: "promise",
    title: "The Packing Expert Promise",
    description:
      "We guarantee the highest quality product and customer experience with every order!",
    icon: "promise",
  },
];
