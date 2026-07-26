export type Industry = {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
};

export const industries: Industry[] = [
  {
    id: "apparel",
    title: "Apparel and Fashion Packaging",
    description:
      "Pair your apparel with one-of-a-kind custom printed clothing boxes.",
    image: "/images/catalog/gift-bags.png",
    href: "/industries/apparel",
  },
  {
    id: "candle",
    title: "Candle Packaging",
    description:
      "Add a personal touch to your candles with expertly engineered candle packaging boxes.",
    image: "/images/catalog/rigid-boxes.png",
    href: "/industries/candle",
  },
  {
    id: "bakery",
    title: "Bakery and Cake Packaging",
    description:
      "Show off your baked good with personalized cake and bakery boxes tailored to your brand.",
    image: "/images/catalog/product-packaging.png",
    href: "/industries/bakery",
  },
  {
    id: "chocolate",
    title: "Chocolate Packaging",
    description:
      "Arrange chocolates in custom chocolate boxes for a unified brand experience.",
    image: "/images/catalog/corrugated-boxes.png",
    href: "/industries/chocolate",
  },
  {
    id: "coffee-tea",
    title: "Coffee and Tea Packaging",
    description:
      "Design functional custom coffee bags and tea boxes that reflect your product's natural appeal.",
    image: "/images/catalog/pouches.png",
    href: "/industries/coffee-tea",
  },
  {
    id: "beer-liquor",
    title: "Beer and Liquor Packaging",
    description:
      "Conveniently house your drinks in simple beer packaging solutions tailored to your brand.",
    image: "/images/catalog/tin-containers.png",
    href: "/industries/beer-liquor",
  },
  {
    id: "beverage",
    title: "Beverage Packaging",
    description:
      "Get your customers excited for drinks with creatively designed beverage boxes.",
    image: "/images/catalog/mailers.png",
    href: "/industries/beverage",
  },
  {
    id: "cosmetics",
    title: "Cosmetics Packaging",
    description:
      "Elevate beauty products with premium boxes that protect and impress at first unboxing.",
    image: "/images/catalog/shopping-bags.png",
    href: "/industries/cosmetics",
  },
  {
    id: "food",
    title: "Food Packaging",
    description:
      "Keep food safe and shelf-ready with custom packaging built for freshness and compliance.",
    image: "/images/catalog/box-inserts.png",
    href: "/industries/food",
  },
];
