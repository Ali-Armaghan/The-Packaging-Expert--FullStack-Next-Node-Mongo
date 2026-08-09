import Link from "next/link";
import type { Home2ClosingContent } from "@/lib/home2/content";

type Home2ClosingProps = {
  content: Home2ClosingContent;
};

/** Final dark CTA band before footer. */
export function Home2Closing({ content }: Home2ClosingProps) {
  return (
    <section className="home2-closing">
      <div className="home2-closing__inner">
        <p className="home2-pillars__eyebrow">
          <span className="home2-pillars__eyebrow-dot" />
          {content.eyebrow}
        </p>
        <h2 className="home2-closing__title">{content.title}</h2>
        <p className="home2-closing__subtitle">{content.subtitle}</p>
        <div className="home2-closing__actions">
          <Link href={content.primaryCta.href} className="home2-closing__primary">
            {content.primaryCta.label}
          </Link>
          <Link
            href={content.secondaryCta.href}
            className="home2-closing__secondary"
          >
            {content.secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
