export type InstagramPost = {
  id: string;
  image: string;
  alt: string;
  href: string;
};

export const instagramPosts: InstagramPost[] = [
  {
    id: "post-1",
    image: "/images/catalog/product-packaging.png",
    alt: "Custom printed product boxes on display",
    href: "https://instagram.com/packagingexpert",
  },
  {
    id: "post-2",
    image: "/images/catalog/mailers.png",
    alt: "Branded mailer boxes ready for shipping",
    href: "https://instagram.com/packagingexpert",
  },
  {
    id: "post-3",
    image: "/images/catalog/rigid-boxes.png",
    alt: "Luxury rigid gift boxes with custom print",
    href: "https://instagram.com/packagingexpert",
  },
  {
    id: "post-4",
    image: "/images/catalog/shopping-bags.png",
    alt: "Custom shopping bags for retail brands",
    href: "https://instagram.com/packagingexpert",
  },
  {
    id: "post-5",
    image: "/images/catalog/pouches.png",
    alt: "Stand-up pouches with vibrant branding",
    href: "https://instagram.com/packagingexpert",
  },
];

export const instagramHandle = "@packagingexpert";
