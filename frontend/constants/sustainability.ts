export type SustainabilityCard = {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
};

export const sustainabilityCards: SustainabilityCard[] = [
  {
    id: "recycled-materials",
    title: "We use recycled materials",
    description:
      "Our packaging is made from responsibly sourced, recyclable materials to reduce environmental impact.",
    image: "/images/catalog/corrugated-boxes.png",
    href: "/sustainability/recycled-materials",
  },
  {
    id: "sustainable-solutions",
    title: "Sustainable packaging solutions",
    description:
      "From design to delivery, we help brands choose eco-friendly options without compromising quality.",
    image: "/images/catalog/tissue-paper.png",
    href: "/sustainability",
  },
];
