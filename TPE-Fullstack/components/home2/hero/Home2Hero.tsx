import Link from "next/link";
import type { Home2HeroContent } from "@/lib/home2/content";
import { HeroFloatStage } from "./HeroFloatStage";

type Home2HeroProps = {
  content: Home2HeroContent;
};

/**
 * /home2 hero — dark studio stage matching the glass nav theme.
 * Left: editorial copy. Right: floating packaging PNGs that cycle.
 */
export function Home2Hero({ content }: Home2HeroProps) {
  const [lineOne, lineTwo] = content.headline;

  return (
    <section className="home2-hero">
      <div className="home2-hero__mesh" aria-hidden="true">
        <span className="home2-hero__blob home2-hero__blob--a" />
        <span className="home2-hero__blob home2-hero__blob--b" />
        <span className="home2-hero__blob home2-hero__blob--c" />
      </div>
      <div className="home2-hero__grid" aria-hidden="true" />
      <div className="home2-hero__grain" aria-hidden="true" />

      <div className="home2-hero__inner">
        <div className="home2-hero__copy">
          <p className="home2-hero__eyebrow">
            <span className="home2-hero__eyebrow-dot" />
            {content.eyebrow}
          </p>

          <h1 className="home2-hero__title">
            <span className="home2-hero__line">{lineOne}</span>
            <span className="home2-hero__line home2-hero__line--accent">
              {lineTwo}
            </span>
          </h1>

          <p className="home2-hero__subtitle">{content.subtitle}</p>

          <div className="home2-hero__actions">
            <Link href={content.primaryCta.href} className="home2-hero__cta">
              {content.primaryCta.label}
            </Link>
            <Link
              href={content.secondaryCta.href}
              className="home2-hero__ghost"
            >
              {content.secondaryCta.label}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <dl className="home2-hero__stats">
            {content.stats.map((stat, index) => (
              <div key={stat.label} className="home2-hero__stat">
                <dt className="home2-hero__stat-index">
                  {String(index + 1).padStart(2, "0")}
                </dt>
                <dd className="home2-hero__stat-value">{stat.value}</dd>
                <dd className="home2-hero__stat-label">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroFloatStage images={content.floatImages} />
      </div>
    </section>
  );
}
