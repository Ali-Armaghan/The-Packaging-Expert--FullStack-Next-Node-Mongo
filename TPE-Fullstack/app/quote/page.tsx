import type { Metadata } from "next";
import { Home2QuoteSection } from "@/components/home2/sections/Home2QuoteSection";
import { siteConfig } from "@/config/site";
import { home2Quote } from "@/lib/home2/content";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Share your packaging specs and get a tailored quote. Our team typically contacts you within one business day.",
};

const TRUST = [
  "Free custom quote",
  "Reply in 1 business day",
  "No obligation",
] as const;

export default function QuotePage() {
  return (
    <div className="route-enter quote-page">
      <header className="quote-page__hero">
        <p className="quote-page__eyebrow">Custom packaging quote</p>
        <h1>Tell us what you need — we’ll quote it.</h1>
        <p>
          Share sizes, material, and finish. A packaging specialist from{" "}
          {siteConfig.name} will contact you with a tailored estimate.
        </p>
        <ul className="quote-page__pills">
          {TRUST.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </header>

      <Home2QuoteSection content={home2Quote} variant="page" />
    </div>
  );
}
