export type BlogCategory =
  | "marketing"
  | "business"
  | "events"
  | "customer-success"
  | "sustainability";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: BlogCategory;
  categoryLabel: string;
  date: string;
  author: string;
  featured?: boolean;
  featuredSidebar?: boolean;
};

export const blogCategories: {
  id: BlogCategory;
  label: string;
  href: string;
}[] = [
  { id: "marketing", label: "Marketing", href: "#marketing" },
  { id: "business", label: "Business", href: "#business" },
  { id: "events", label: "Events", href: "#events" },
  {
    id: "customer-success",
    label: "Customer Success",
    href: "#customer-success",
  },
  { id: "sustainability", label: "Sustainability", href: "#sustainability" },
];

export const blogPosts: BlogPost[] = [
  {
    id: "ai-packaging-design",
    slug: "how-to-use-ai-for-packaging-design",
    title: "How To Use AI For Packaging Design",
    excerpt:
      "Learn how to use AI for packaging design—from finding inspiration to creating artwork, dielines, and production-ready files.",
    image: "/images/hero-packaging.png",
    category: "marketing",
    categoryLabel: "Marketing",
    date: "July 14, 2025",
    author: "Crystal Chan",
    featured: true,
  },
  {
    id: "tariffs-custom-packaging",
    slug: "protect-your-business-from-tariffs-on-custom-packaging",
    title: "Protect Your Business From Tariffs On Custom Packaging",
    excerpt:
      "Understand how tariffs affect custom packaging costs and what steps you can take to protect your margins and supply chain.",
    image: "/images/catalog/corrugated-boxes.png",
    category: "marketing",
    categoryLabel: "Packaging Tips",
    date: "July 7, 2025",
    author: "Crystal Chan",
    featuredSidebar: true,
  },
  {
    id: "ai-packaging-sidebar",
    slug: "how-to-use-ai-for-packaging-design-sidebar",
    title: "How To Use AI For Packaging Design",
    excerpt:
      "AI is changing how brands approach packaging design. Learn practical ways to use AI tools while keeping your creative vision intact.",
    image: "/images/hero-packaging.png",
    category: "marketing",
    categoryLabel: "AI In Packaging",
    date: "July 14, 2025",
    author: "Crystal Chan",
    featuredSidebar: true,
  },
  {
    id: "packaging-engineering",
    slug: "why-packaging-isnt-just-a-design-challenge-its-engineering",
    title: "Why Packaging Isn't Just a Design Challenge—It's Engineering",
    excerpt:
      "Great packaging balances aesthetics with structural integrity. Discover why engineering matters as much as design in custom packaging.",
    image: "/images/catalog/rigid-boxes.png",
    category: "marketing",
    categoryLabel: "Packaging Tips",
    date: "June 28, 2025",
    author: "Crystal Chan",
    featuredSidebar: true,
  },
  {
    id: "social-media-packaging",
    slug: "packaging-that-performs-on-social-media",
    title: "Packaging That Performs on Social Media",
    excerpt:
      "Design share-worthy packaging that drives organic reach and builds community around your brand.",
    image: "/images/catalog/shopping-bags.png",
    category: "marketing",
    categoryLabel: "Marketing",
    date: "Apr 15, 2024",
    author: "Sarah Chen",
  },
  {
    id: "brand-storytelling",
    slug: "brand-storytelling-through-packaging",
    title: "Brand Storytelling Through Packaging",
    excerpt:
      "Use every surface of your packaging to communicate your brand values and connect with customers.",
    image: "/images/catalog/stickers-labels.png",
    category: "marketing",
    categoryLabel: "Marketing",
    date: "Apr 2, 2024",
    author: "James Miller",
  },
  {
    id: "sustainable-materials-guide",
    slug: "guide-to-sustainable-packaging-materials",
    title: "A Guide to Sustainable Packaging Materials",
    excerpt:
      "Compare eco-friendly material options and find the right sustainable solution for your product line.",
    image: "/images/catalog/tissue-paper.png",
    category: "marketing",
    categoryLabel: "Marketing",
    date: "Mar 22, 2024",
    author: "Emily Rodriguez",
  },
  {
    id: "startup-packaging-budget",
    slug: "packaging-on-a-startup-budget",
    title: "Packaging on a Startup Budget",
    excerpt:
      "Smart strategies for launching with professional packaging without overspending your early-stage budget.",
    image: "/images/catalog/product-packaging.png",
    category: "business",
    categoryLabel: "Business",
    date: "May 20, 2024",
    author: "David Park",
  },
  {
    id: "scaling-packaging-ops",
    slug: "scaling-your-packaging-operations",
    title: "Scaling Your Packaging Operations",
    excerpt:
      "From first order to full-scale production — how growing brands manage packaging at every stage.",
    image: "/images/catalog/corrugated-boxes.png",
    category: "business",
    categoryLabel: "Business",
    date: "May 12, 2024",
    author: "Lisa Thompson",
  },
  {
    id: "cost-reduction-tips",
    slug: "reducing-packaging-costs-without-sacrificing-quality",
    title: "Reducing Packaging Costs Without Sacrificing Quality",
    excerpt:
      "Practical tips to optimize your packaging spend while keeping the premium feel your customers expect.",
    image: "/images/catalog/mailers.png",
    category: "business",
    categoryLabel: "Business",
    date: "Apr 30, 2024",
    author: "David Park",
  },
  {
    id: "supply-chain-resilience",
    slug: "building-a-resilient-packaging-supply-chain",
    title: "Building a Resilient Packaging Supply Chain",
    excerpt:
      "How to plan ahead and avoid disruptions when sourcing custom packaging for your business.",
    image: "/images/catalog/box-inserts.png",
    category: "business",
    categoryLabel: "Business",
    date: "Apr 18, 2024",
    author: "Lisa Thompson",
  },
  {
    id: "moq-explained",
    slug: "understanding-minimum-order-quantities",
    title: "Understanding Minimum Order Quantities",
    excerpt:
      "Everything you need to know about MOQs and how to find the right balance for your business size.",
    image: "/images/catalog/packing-tape.png",
    category: "business",
    categoryLabel: "Business",
    date: "Apr 5, 2024",
    author: "David Park",
  },
  {
    id: "trade-show-prep",
    slug: "preparing-packaging-for-trade-shows",
    title: "Preparing Packaging for Trade Shows",
    excerpt:
      "Make your booth stand out with display-ready packaging that captures attention on the show floor.",
    image: "/images/catalog/pop-displays.png",
    category: "business",
    categoryLabel: "Business",
    date: "Mar 25, 2024",
    author: "Lisa Thompson",
  },
  {
    id: "pack-expo-recap",
    slug: "pack-expo-highlights-and-takeaways",
    title: "Pack Expo Highlights and Takeaways",
    excerpt:
      "Our team's top insights from this year's Pack Expo — innovations, trends, and networking wins.",
    image: "/images/catalog/rigid-boxes.png",
    category: "events",
    categoryLabel: "Events",
    date: "May 16, 2024",
    author: "Packing Expert Team",
  },
  {
    id: "sustainable-packaging-summit",
    slug: "sustainable-packaging-summit-recap",
    title: "Sustainable Packaging Summit Recap",
    excerpt:
      "Key sessions and announcements from the leading sustainability event in the packaging industry.",
    image: "/images/catalog/tissue-paper.png",
    category: "events",
    categoryLabel: "Events",
    date: "May 8, 2024",
    author: "Emily Rodriguez",
  },
  {
    id: "design-week-packaging",
    slug: "design-week-packaging-showcase",
    title: "Design Week Packaging Showcase",
    excerpt:
      "Standout packaging designs from this year's design week that are pushing creative boundaries.",
    image: "/images/catalog/gift-bags.png",
    category: "events",
    categoryLabel: "Events",
    date: "Apr 22, 2024",
    author: "Sarah Chen",
  },
  {
    id: "beauty-brand-launch",
    slug: "how-a-beauty-brand-launched-with-custom-boxes",
    title: "How a Beauty Brand Launched With Custom Boxes",
    excerpt:
      "See how one skincare startup used custom rigid boxes to create a luxury unboxing experience from day one.",
    image: "/images/catalog/rigid-boxes.png",
    category: "customer-success",
    categoryLabel: "Customer Success",
    date: "May 14, 2024",
    author: "Packing Expert Team",
  },
  {
    id: "food-brand-growth",
    slug: "food-brand-scales-with-custom-packaging",
    title: "Food Brand Scales With Custom Packaging",
    excerpt:
      "From farmers market to national retail — how consistent packaging fueled this food brand's growth.",
    image: "/images/catalog/pouches.png",
    category: "customer-success",
    categoryLabel: "Customer Success",
    date: "May 6, 2024",
    author: "Lisa Thompson",
  },
  {
    id: "ecommerce-unboxing",
    slug: "ecommerce-brand-doubles-repeat-customers",
    title: "Ecommerce Brand Doubles Repeat Customers",
    excerpt:
      "A DTC apparel brand shares how premium mailer packaging transformed their customer retention rate.",
    image: "/images/catalog/mailers.png",
    category: "customer-success",
    categoryLabel: "Customer Success",
    date: "Apr 24, 2024",
    author: "David Park",
  },
  {
    id: "compostable-packaging",
    slug: "switching-to-compostable-packaging",
    title: "Switching to Compostable Packaging",
    excerpt:
      "A step-by-step guide to transitioning your product line to fully compostable packaging materials.",
    image: "/images/catalog/tissue-paper.png",
    category: "sustainability",
    categoryLabel: "Sustainability",
    date: "May 22, 2024",
    author: "Emily Rodriguez",
  },
  {
    id: "carbon-footprint",
    slug: "reducing-your-packaging-carbon-footprint",
    title: "Reducing Your Packaging Carbon Footprint",
    excerpt:
      "Measure, track, and reduce the environmental impact of your packaging with these proven strategies.",
    image: "/images/catalog/shopping-bags.png",
    category: "sustainability",
    categoryLabel: "Sustainability",
    date: "May 4, 2024",
    author: "Sarah Chen",
  },
  {
    id: "recyclable-materials",
    slug: "choosing-fully-recyclable-materials",
    title: "Choosing Fully Recyclable Materials",
    excerpt:
      "Not all recyclable claims are equal — learn what to look for when selecting eco-friendly packaging.",
    image: "/images/catalog/corrugated-boxes.png",
    category: "sustainability",
    categoryLabel: "Sustainability",
    date: "Apr 12, 2024",
    author: "James Miller",
  },
];

export function getFeaturedPost(): BlogPost {
  return blogPosts.find((post) => post.featured)!;
}

export function getFeaturedSidebarPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.featuredSidebar);
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}

export function getBrowseAllPosts(): BlogPost[] {
  return blogPosts.slice(0, 9);
}

export function getCategorySectionTitle(category: BlogCategory): string {
  const titles: Record<BlogCategory, string> = {
    marketing: "Marketing",
    business: "Business",
    events: "Events",
    "customer-success": "Customer Success Stories",
    sustainability: "Sustainability",
  };
  return titles[category];
}
