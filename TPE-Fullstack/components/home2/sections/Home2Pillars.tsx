import Link from "next/link";
import type { Home2PillarsContent } from "@/lib/home2/content";

type Home2PillarsProps = {
  content: Home2PillarsContent;
};

/** Why-us pillars under the catalog — dark glass continuation. */
export function Home2Pillars({ content }: Home2PillarsProps) {
  return (
    <section className="home2-pillars">
      <div className="home2-pillars__inner">
        <header className="home2-pillars__header">
          <div className="home2-pillars__intro">
            <p className="home2-pillars__eyebrow">
              <span className="home2-pillars__eyebrow-dot" />
              {content.eyebrow}
            </p>
            <h2 className="home2-pillars__title">{content.title}</h2>
          </div>
          <div className="home2-pillars__aside">
            <p className="home2-pillars__subtitle">{content.subtitle}</p>
            <Link href={content.cta.href} className="home2-pillars__cta">
              {content.cta.label}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </header>

        <ul className="home2-pillars__grid">
          {content.pillars.map((pillar) => (
            <li key={pillar.id} className="home2-pillars__card">
              <span className="home2-pillars__index">{pillar.index}</span>
              <h3 className="home2-pillars__card-title">{pillar.title}</h3>
              <p className="home2-pillars__card-text">{pillar.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
