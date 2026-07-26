export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    id: "sarah",
    quote:
      "Packing Expert made our launch packaging effortless. The quality exceeded expectations and our customers love the unboxing experience.",
    name: "Sarah Mitchell",
    role: "Founder, Glow Cosmetics",
    avatar: "/images/catalog/gift-bags.png",
    rating: 5,
  },
  {
    id: "james",
    quote:
      "From design proofs to delivery, the team was responsive and professional. We reordered three times already.",
    name: "James Chen",
    role: "Operations, Bean & Brew Co.",
    avatar: "/images/catalog/pouches.png",
    rating: 5,
  },
  {
    id: "emily",
    quote:
      "Custom sizing and low minimums made it easy for our small business to get premium packaging without breaking the budget.",
    name: "Emily Rodriguez",
    role: "CEO, Sweet Crumb Bakery",
    avatar: "/images/catalog/rigid-boxes.png",
    rating: 5,
  },
  {
    id: "david",
    quote:
      "The sustainability options were a big win for our brand. Great print quality and fast turnaround every time.",
    name: "David Park",
    role: "Brand Manager, Native Goods",
    avatar: "/images/catalog/shopping-bags.png",
    rating: 5,
  },
];
