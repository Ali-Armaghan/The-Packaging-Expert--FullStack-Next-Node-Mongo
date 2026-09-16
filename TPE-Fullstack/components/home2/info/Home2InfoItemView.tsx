import Link from "next/link";
import type { ContentItemPage } from "@/lib/productContentTab/queries";

type Home2InfoItemViewProps = {
  data: ContentItemPage;
  bodyHtml: string;
};

export function Home2InfoItemView({ data, bodyHtml }: Home2InfoItemViewProps) {
  const { tab, section, item } = data;

  return (
    <article className="home2-info route-enter">
      <header className="home2-info__hero">
        <div className="home2-info__hero-inner">
          <nav aria-label="Breadcrumb" className="home2-pdp__crumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-hidden className="home2-pdp__crumb-sep">
                /
              </li>
              <li>{tab.name}</li>
              <li aria-hidden className="home2-pdp__crumb-sep">
                /
              </li>
              <li>{section.title}</li>
              <li aria-hidden className="home2-pdp__crumb-sep">
                /
              </li>
              <li aria-current="page">{item.title}</li>
            </ol>
          </nav>
          <p className="home2-info__kicker">
            {tab.name} · {section.title}
          </p>
          <h1>{item.title}</h1>
        </div>
      </header>

      <div className="home2-info__body">
        {item.image ? (
          <div className="home2-info__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.title} />
          </div>
        ) : null}
        {bodyHtml ? (
          <div
            className="home2-info__copy"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        ) : (
          <p className="home2-info__empty">Article copy is coming soon.</p>
        )}
      </div>
    </article>
  );
}
