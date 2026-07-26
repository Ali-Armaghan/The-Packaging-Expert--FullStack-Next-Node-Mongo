export type IndustryMegaMenuItem = {
  id: string;
  label: string;
  href: string;
  icon:
    | "apparel"
    | "bakery"
    | "beer"
    | "beverage"
    | "candle"
    | "candy"
    | "cannabis"
    | "chocolate"
    | "coffee"
    | "cosmetics"
    | "ecommerce"
    | "electronics"
    | "food"
    | "gift"
    | "jewelry"
    | "pets"
    | "pharma"
    | "presentation"
    | "restaurant"
    | "retail"
    | "shipping"
    | "soap"
    | "toy"
    | "tea"
    | "window"
    | "wine"
    | "grid";
};

export const industriesMegaMenuColumns: IndustryMegaMenuItem[][] = [
  [
    { id: "apparel", label: "Apparel", href: "/industries/apparel", icon: "apparel" },
    { id: "bakery", label: "Bakery & Cake", href: "/industries/bakery", icon: "bakery" },
    { id: "beer", label: "Beer & Liquor", href: "/industries/beer-liquor", icon: "beer" },
    { id: "beverage", label: "Beverage", href: "/industries/beverage", icon: "beverage" },
    { id: "candle", label: "Candle", href: "/industries/candle", icon: "candle" },
    { id: "candy", label: "Candy & Sweets", href: "/industries/candy", icon: "candy" },
    { id: "cannabis", label: "Cannabis", href: "/industries/cannabis", icon: "cannabis" },
    { id: "chocolate", label: "Chocolate", href: "/industries/chocolate", icon: "chocolate" },
    { id: "coffee", label: "Coffee", href: "/industries/coffee-tea", icon: "coffee" },
  ],
  [
    { id: "cosmetics", label: "Cosmetics", href: "/industries/cosmetics", icon: "cosmetics" },
    { id: "ecommerce", label: "E-Commerce", href: "/industries/ecommerce", icon: "ecommerce" },
    { id: "electronics", label: "Electronics", href: "/industries/electronics", icon: "electronics" },
    { id: "food", label: "Food", href: "/industries/food", icon: "food" },
    { id: "gift", label: "Gift", href: "/industries/gift", icon: "gift" },
    { id: "jewelry", label: "Jewelry", href: "/industries/jewelry", icon: "jewelry" },
    { id: "pets", label: "Pets", href: "/industries/pets", icon: "pets" },
    { id: "pharma", label: "Pharmaceutical", href: "/industries/pharmaceutical", icon: "pharma" },
    { id: "presentation", label: "Presentation", href: "/industries/presentation", icon: "presentation" },
  ],
  [
    { id: "restaurant", label: "Restaurant", href: "/industries/restaurant", icon: "restaurant" },
    { id: "retail", label: "Retail", href: "/industries/retail", icon: "retail" },
    { id: "shipping", label: "Shipping", href: "/industries/shipping", icon: "shipping" },
    { id: "soap", label: "Soap", href: "/industries/soap", icon: "soap" },
    { id: "toy", label: "Toy", href: "/industries/toy", icon: "toy" },
    { id: "tea", label: "Tea", href: "/industries/tea", icon: "tea" },
    { id: "window", label: "Window", href: "/industries/window", icon: "window" },
    { id: "wine", label: "Wine", href: "/industries/wine", icon: "wine" },
    { id: "all", label: "See all industries", href: "/industries", icon: "grid" },
  ],
];

export const inspirationLibraryFeature = {
  title: "Inspiration Library",
  description:
    "Just starting your custom packaging journey but don't know where to start? Get inspired by browsing our extensive library of creative packaging concepts and see how brands from your industry are designing their packaging!",
  image: "/images/hero-packaging.png",
  href: "/inspiration",
  linkLabel: "Browse inspiration library",
} as const;
