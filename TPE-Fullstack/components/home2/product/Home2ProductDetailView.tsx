import Image from "next/image";
import Link from "next/link";
import {
  BoxIcon,
  ClockIcon,
  GlobeIcon,
  LeafIcon,
  ShieldCheckIcon,
  type LucideIcon,
} from "lucide-react";
import { Home2ProductGallery } from "./Home2ProductGallery";
import { Home2ProductPurchasePanel } from "./Home2ProductPurchasePanel";
import { Home2ProductTabs } from "./Home2ProductTabs";
import type {
  ProductCardItem,
  ProductHighlight,
  ProductHighlightIcon,
  SerializedProduct,
} from "@/types/product";

const HIGHLIGHT_ICONS: Record<ProductHighlightIcon, LucideIcon> = {
  globe: GlobeIcon,
  box: BoxIcon,
  leaf: LeafIcon,
  shield: ShieldCheckIcon,
  clock: ClockIcon,
};

type Home2ProductDetailViewProps = {
  product: SerializedProduct;
  related: ProductCardItem[];
};

export function Home2ProductDetailView({
  product,
  related,
}: Home2ProductDetailViewProps) {
  const { detail } = product;
  const images = Array.from(
    new Set(
      [product.image, ...product.images, ...detail.gallery].filter(Boolean),
    ),
  );

  return (
    <div className="home2-pdp route-enter">
      <section className="home2-pdp__hero">
        <div className="home2-pdp__hero-mesh" aria-hidden="true" />
        <div className="home2-pdp__hero-inner">
          <nav aria-label="Breadcrumb" className="home2-pdp__crumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/category">Category</Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page">{detail.breadcrumbLabel || product.name}</li>
            </ol>
          </nav>

          <div className="home2-pdp__hero-grid">
            <Home2ProductGallery name={product.name} images={images} />
            <div className="home2-pdp__hero-aside">
              <Home2ProductPurchasePanel name={product.name} detail={detail} />
            </div>
          </div>
        </div>
      </section>

      <section className="home2-pdp__info">
        <div className="home2-pdp__info-inner">
          <Home2ProductTabs tabs={detail.tabs} orderProcess={detail.orderProcess} />
          {detail.highlights.length > 0 ? (
            <div className="home2-pdp__highlights">
              {detail.highlights.map((highlight) => (
                <HighlightItem key={highlight.title} highlight={highlight} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {detail.banner.title ? (
        <section className="home2-pdp__promo">
          <div className="home2-pdp__promo-inner">
            <div className="home2-pdp__promo-copy">
              {detail.banner.eyebrow ? (
                <p className="home2-pdp__eyebrow">
                  <span className="home2-pdp__eyebrow-dot" aria-hidden />
                  {detail.banner.eyebrow}
                </p>
              ) : null}
              <h2>{detail.banner.title}</h2>
              {detail.banner.description ? <p>{detail.banner.description}</p> : null}
              {detail.banner.buttonLabel ? (
                <Link
                  href={detail.banner.buttonHref || "/category"}
                  className="home2-pdp__promo-btn"
                >
                  {detail.banner.buttonLabel}
                </Link>
              ) : null}
            </div>
            {detail.banner.image ? (
              <div className="home2-pdp__promo-media">
                <Image
                  src={detail.banner.image}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 46vw"
                  className="home2-pdp__promo-img"
                />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {detail.featureSections.length > 0 ? (
        <section className="home2-pdp__features">
          <div className="home2-pdp__features-inner">
            {detail.featureSections.map((section, index) => {
              const imageRight = section.imageSide === "right";
              return (
                <article
                  key={`${section.title}-${index}`}
                  className={`home2-pdp__feature ${imageRight ? "home2-pdp__feature--flip" : ""}`}
                >
                  <div className="home2-pdp__feature-media">
                    {section.image ? (
                      <Image
                        src={section.image}
                        alt=""
                        fill
                        loading="lazy"
                        sizes="(max-width: 1024px) 100vw, 46vw"
                        className="home2-pdp__feature-img"
                      />
                    ) : null}
                  </div>
                  <div className="home2-pdp__feature-copy">
                    <h2>{section.title}</h2>
                    {section.description ? <p>{section.description}</p> : null}
                    {section.linkLabel ? (
                      <Link href={section.linkHref || "/quote"}>
                        {section.linkLabel}
                        <span aria-hidden>→</span>
                      </Link>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="home2-pdp__related">
          <div className="home2-pdp__related-inner">
            <p className="home2-pdp__eyebrow home2-pdp__eyebrow--light">
              <span className="home2-pdp__eyebrow-dot" aria-hidden />
              You may also like
            </p>
            <h2>{detail.relatedTitle || "Related products"}</h2>
            <div className="home2-pdp__related-grid">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.slug}`}
                  className="home2-pdp__related-card"
                >
                  <div className="home2-pdp__related-img">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 50vw, 20vw"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <h3>{item.name}</h3>
                  {item.price ? <span>{item.price}</span> : null}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function HighlightItem({ highlight }: { highlight: ProductHighlight }) {
  const Icon = HIGHLIGHT_ICONS[highlight.icon] ?? BoxIcon;
  return (
    <div className="home2-pdp__highlight">
      <span className="home2-pdp__highlight-icon">
        <Icon aria-hidden />
      </span>
      <div>
        <h3>{highlight.title}</h3>
        <p>{highlight.text}</p>
      </div>
    </div>
  );
}
