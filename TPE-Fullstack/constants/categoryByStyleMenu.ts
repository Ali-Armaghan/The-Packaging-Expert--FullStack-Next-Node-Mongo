import type { MegaMenuGroup } from "./productsMegaMenu";

export const categoryByStyleGroup: MegaMenuGroup = {
  title: "Styles",
  items: [
    {
      id: "apparel-boxes",
      title: "Apparel Boxes",
      description: "Premium boxes for clothing and fashion brands.",
      image: "/images/catalog/rigid-boxes.png",
      href: "/products/apparel-boxes",
    },
    {
      id: "food-boxes",
      title: "Food Boxes",
      description: "Safe, compliant packaging for food products.",
      image: "/images/catalog/product-packaging.png",
      href: "/products/food-boxes",
    },
    {
      id: "bakery-boxes",
      title: "Bakery Boxes",
      description: "Attractive boxes for cakes, pastries, and baked goods.",
      image: "/images/catalog/corrugated-boxes.png",
      href: "/products/bakery-boxes",
    },
    {
      id: "jewellery-boxes",
      title: "Jewellery Boxes",
      description: "Elegant packaging for jewelry and accessories.",
      image: "/images/catalog/rigid-boxes.png",
      href: "/products/jewellery-boxes",
    },
  ],
};
