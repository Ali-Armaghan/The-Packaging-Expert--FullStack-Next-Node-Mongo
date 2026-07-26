import { siteConfig } from "@/config/site";

export const contactPageContent = {
  eyebrow: "Get in touch",
  title: "Let's talk about your packaging",
  description:
    "Whether you need a custom quote, design advice, or help choosing the right packaging — our specialists are ready to help.",
  formTitle: "Send us a message",
  formDescription:
    "Fill out the form and we’ll get back to you within one business day.",
  successTitle: "Message sent successfully",
  successDescription:
    "Thanks for reaching out. A packaging specialist will contact you shortly.",
  faqNote: "Need a project estimate instead?",
  faqCta: { label: "Request a Quote", href: "/quote" },
} as const;

export const contactChannels = [
  {
    id: "phone",
    title: "Call us",
    description: siteConfig.contact.phoneSubtext,
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone.replace(/[^+\d]/g, "")}`,
    detail: siteConfig.contact.hours,
    icon: "phone" as const,
  },
  {
    id: "email",
    title: "Email us",
    description: "We reply within 1 business day",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    detail: "Sales & support",
    icon: "email" as const,
  },
  {
    id: "hours",
    title: "Business hours",
    description: "Speak with our packaging experts",
    value: siteConfig.contact.hours,
    href: undefined,
    detail: "Monday – Friday",
    icon: "clock" as const,
  },
] as const;

export const contactTopics = [
  "General inquiry",
  "Custom packaging quote",
  "Design & artwork help",
  "Existing order support",
  "Partnership / wholesale",
] as const;
