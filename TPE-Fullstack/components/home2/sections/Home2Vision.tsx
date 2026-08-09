import Link from "next/link";
import type { Home2VisionContent } from "@/lib/home2/content";

type Home2VisionProps = {
  content: Home2VisionContent;
};

/** Light split section — in-house production story under the dark pillars. */
export function Home2Vision({ content }: Home2VisionProps) {
  return (
    <section className="home2-vision">
      <div className="home2-vision__inner">
        <div className="home2-vision__copy">
          <p className="home2-vision__eyebrow">
            <span className="home2-vision__eyebrow-dot" />
            {content.eyebrow}
          </p>
          <h2 className="home2-vision__title">{content.title}</h2>
          <p className="home2-vision__text">{content.description}</p>
          <ul className="home2-vision__points">
            {content.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <Link href={content.cta.href} className="home2-vision__cta">
            {content.cta.label}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="home2-vision__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.image}
            alt={content.imageAlt}
            className="home2-vision__img"
          />
        </div>
      </div>
    </section>
  );
}
