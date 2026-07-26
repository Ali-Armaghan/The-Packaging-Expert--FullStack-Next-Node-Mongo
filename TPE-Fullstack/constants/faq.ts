export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    id: "minimum-order",
    question: "What is the minimum order quantity?",
    answer:
      "Minimum order quantities vary by product type. Many of our custom packaging options start at 100 units, with flexible quantities available for growing brands. Contact us for product-specific details.",
  },
  {
    id: "turnaround",
    question: "How long does production take?",
    answer:
      "Standard turnaround is 10–15 business days after proof approval. Rush options may be available depending on your project specs and order size.",
  },
  {
    id: "design-help",
    question: "Do you offer design assistance?",
    answer:
      "Yes. Our design team provides free proofs and can help prepare your artwork for print. Upload your logo and brand assets, and we'll guide you through revisions until you're satisfied.",
  },
  {
    id: "materials",
    question: "What materials do you offer?",
    answer:
      "We offer cardstock, corrugated, rigid board, kraft, pouches, mailers, and more. Eco-friendly and recyclable options are available across many product lines.",
  },
  {
    id: "shipping",
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship across the USA and offer international shipping options. Delivery timelines and costs depend on your location and order size.",
  },
  {
    id: "samples",
    question: "Can I order samples before placing a bulk order?",
    answer:
      "Sample orders are available for many products so you can review material, print quality, and sizing before committing to a full production run.",
  },
];
