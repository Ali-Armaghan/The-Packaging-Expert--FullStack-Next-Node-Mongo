export type FooterLinkGroup = {
  title: string;
  links: { label: string; href: string }[];
};

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Custom Design", href: "/services/design" },
      { label: "Prototyping", href: "/services/prototyping" },
      { label: "Warehousing", href: "/services/warehousing" },
      { label: "Fulfillment", href: "/services/fulfillment" },
    ],
  },
  {
    title: "Category",
    links: [
      { label: "Custom Boxes", href: "/catalog" },
      { label: "Mailers", href: "/catalog/mailers" },
      { label: "Bags & Pouches", href: "/catalog/pouches" },
      { label: "Labels & Inserts", href: "/catalog/stickers-labels" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "FAQs", href: "/#faq" },
      { label: "Shipping Info", href: "/shipping" },
      { label: "Returns", href: "/returns" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

export const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" as const },
  { label: "Twitter", href: "https://twitter.com", icon: "twitter" as const },
  { label: "Instagram", href: "https://instagram.com/packagingexpert", icon: "instagram" as const },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" as const },
] as const;

export const paymentMethods = ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay"] as const;
