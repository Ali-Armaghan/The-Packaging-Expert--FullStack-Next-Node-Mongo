import Link from "next/link";
import type { Home2PillarsContent } from "@/lib/home2/content";

type Home2PillarsProps = {
  content: Home2PillarsContent;
};

/** Why-us — editorial numbered rows (distinct from the process journey cards). */
export function Home2Pillars({ content }: Home2PillarsProps) {
  return (
    <section className="home2-pillars">
      <div className="home2-pillars__wash" aria-hidden="true" />
      <div className="home2-pillars__stripe" aria-hidden="true" />

      <div className="home2-pillars__inner">
        <div className="home2-pillars__layout">
          <header className="home2-pillars__header">
            <p className="home2-pillars__eyebrow">
              <span className="home2-pillars__eyebrow-dot" />
              {content.eyebrow}
            </p>
            <h2 className="home2-pillars__title">{content.title}</h2>
            <p className="home2-pillars__subtitle">{content.subtitle}</p>
            <Link href={content.cta.href} className="home2-pillars__cta">
              <span>{content.cta.label}</span>
              <span className="home2-pillars__cta-icon" aria-hidden="true">
                →
              </span>
            </Link>
          </header>

          <ol className="home2-pillars__list">
            {content.pillars.map((pillar) => (
              <li key={pillar.id} className="home2-pillars__row">
                <span className="home2-pillars__index" aria-hidden="true">
                  {pillar.index}
                </span>
                <div className="home2-pillars__body">
                  <h3 className="home2-pillars__row-title">{pillar.title}</h3>
                  <p className="home2-pillars__row-text">{pillar.description}</p>
                </div>
                <span className="home2-pillars__mark" aria-hidden="true" />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
