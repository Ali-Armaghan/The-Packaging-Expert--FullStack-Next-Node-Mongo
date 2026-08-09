import Link from "next/link";
import type { Home2IndustriesContent } from "@/lib/home2/content";

type Home2IndustriesProps = {
  content: Home2IndustriesContent;
};

/** Industry formats — light surface with horizontal rail on small screens. */
export function Home2Industries({ content }: Home2IndustriesProps) {
  return (
    <section className="home2-industries">
      <div className="home2-industries__inner">
        <header className="home2-industries__header">
          <div>
            <p className="home2-vision__eyebrow">
              <span className="home2-vision__eyebrow-dot" />
              {content.eyebrow}
            </p>
            <h2 className="home2-industries__title">{content.title}</h2>
          </div>
          <div className="home2-industries__aside">
            <p className="home2-industries__subtitle">{content.subtitle}</p>
            <Link href={content.cta.href} className="home2-vision__cta">
              {content.cta.label}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </header>

        <ul className="home2-industries__rail">
          {content.items.map((item) => (
            <li key={item.id}>
              <Link href={item.href} className="home2-industries__card">
                <span className="home2-industries__thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" />
                </span>
                <span className="home2-industries__body">
                  <span className="home2-industries__name">{item.title}</span>
                  <span className="home2-industries__desc">
                    {item.description}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
