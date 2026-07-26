import type { NavItem } from "@/types/navigation";

export const utilityNavItems: NavItem[] = [
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
  { label: "Sign In", href: "/sign-in" },
  { label: "Create an Account", href: "/sign-up" },
];

export const mainNavItems: NavItem[] = [
  { label: "Industries", href: "/industries" },
  { label: "Styles", href: "/products/style" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Why Packing Expert", href: "/about" },
];

export const ctaNavItem = {
  label: "Request a Quote",
  href: "/quote",
} as const;
