export type BlogFooterLinkGroup = {
  title: string;
  links: { label: string; href: string }[];
};

export const blogFooterLinkGroups: BlogFooterLinkGroup[] = [
  {
    title: "Categories",
    links: [
      { label: "Expert Tips", href: "/blog?category=expert-tips" },
      { label: "Guide", href: "/blog?category=guide" },
      { label: "Marketing", href: "/blog#marketing" },
      { label: "Packaging Tips", href: "/blog?category=packaging-tips" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Templates And Dielines", href: "/resources/templates" },
      { label: "Option Library", href: "/options" },
      { label: "Inspiration", href: "/inspiration" },
    ],
  },
  {
    title: "Services",
    links: [
      {
        label: "Structural Design & Engineering",
        href: "/services/structural-design",
      },
      {
        label: "Packaging Artwork Design",
        href: "/services/artwork-design",
      },
      { label: "Samples & Prototyping", href: "/services/prototyping" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contribute To Our Blog", href: "/blog/contribute" },
      { label: "Request Quote", href: "/quote" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms Of Service", href: "/terms" },
    ],
  },
];

export const blogFooterSocialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/packingexpert",
    icon: "instagram" as const,
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: "facebook" as const,
  },
  {
    label: "Pinterest",
    href: "https://pinterest.com",
    icon: "pinterest" as const,
  },
  {
    label: "X",
    href: "https://twitter.com",
    icon: "twitter" as const,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: "linkedin" as const,
  },
] as const;
