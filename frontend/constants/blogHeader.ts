export type BlogHeaderNavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const blogHeaderNavItems: BlogHeaderNavItem[] = [
  {
    label: "Learn About Packaging",
    href: "/blog/learn-about-packaging",
  },
  {
    label: "Packaging Tips",
    href: "/blog/packaging-tips",
    children: [
      { label: "Expert Tips", href: "/blog?category=expert-tips" },
      { label: "Packaging Tips", href: "/blog?category=packaging-tips" },
      { label: "Guide", href: "/blog?category=guide" },
    ],
  },
  {
    label: "Find Ideas",
    href: "/blog/find-ideas",
    children: [
      { label: "Marketing", href: "/blog#marketing" },
      { label: "Inspiration", href: "/inspiration" },
      { label: "Customer Success Stories", href: "/blog#customer-success" },
    ],
  },
  {
    label: "AI In Packaging",
    href: "/blog/ai-in-packaging",
  },
];

export const blogHeaderSocialLinks = [
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
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: "linkedin" as const,
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
] as const;
