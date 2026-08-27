import Link from "next/link";
import {
  BoxIcon,
  ClockIcon,
  GlobeIcon,
  LeafIcon,
  ShieldCheckIcon,
  type LucideIcon,
} from "lucide-react";
import { H2_MEDIA } from "@/lib/home2/content";
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

const DEFAULT_GALLERY = [
  H2_MEDIA.folding,
  H2_MEDIA.rigid,
  H2_MEDIA.corrugated,
  H2_MEDIA.inserts,
] as const;

const RELATED_FALLBACKS = [
  H2_MEDIA.corrugated,
  H2_MEDIA.rigid,
  H2_MEDIA.inserts,
  H2_MEDIA.shoppingBags,
  H2_MEDIA.labels,
] as const;

function resolveProductImages(product: SerializedProduct): string[] {
  const fromProduct = [
    product.image,
    ...product.images,
    ...product.detail.gallery,
  ].filter((url) => typeof url === "string" && url.trim() !== "");

  const unique = Array.from(new Set(fromProduct));
  return unique.length > 0 ? unique : [...DEFAULT_GALLERY];
}

function resolveImage(url: string | undefined, fallback: string): string {
  return url?.trim() ? url.trim() : fallback;
}

type Home2ProductDetailViewProps = {
  product: SerializedProduct;
  related: ProductCardItem[];
};

export function Home2ProductDetailView({
  product,
  related,
}: Home2ProductDetailViewProps) {
  const { detail } = product;
  const images = resolveProductImages(product);
  const bannerImage = resolveImage(detail.banner.image, H2_MEDIA.corrugated);

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
              <li aria-hidden className="home2-pdp__crumb-sep">
                /
              </li>
              <li>
                <Link href="/category">Category</Link>
              </li>
              <li aria-hidden className="home2-pdp__crumb-sep">
                /
              </li>
              <li aria-current="page">
                {detail.breadcrumbLabel || product.name}
              </li>
            </ol>
          </nav>

          <div className="home2-pdp__hero-grid">
            <Home2ProductGallery name={product.name} images={images} />
            <div className="home2-pdp__hero-aside">
              <Home2ProductPurchasePanel
                name={product.name}
                price={product.price}
                detail={detail}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="home2-pdp__info">
        <div className="home2-pdp__info-inner">
          <header className="home2-pdp__section-head">
            <p className="home2-pdp__eyebrow home2-pdp__eyebrow--dark">
              <span className="home2-pdp__eyebrow-dot" aria-hidden />
              Details
            </p>
            <h2>Product information</h2>
          </header>

          <Home2ProductTabs
            tabs={detail.tabs}
            orderProcess={detail.orderProcess}
          />

          {detail.highlights.length > 0 ? (
            <div className="home2-pdp__highlights-wrap">
              <header className="home2-pdp__section-head">
                <p className="home2-pdp__eyebrow home2-pdp__eyebrow--dark">
                  <span className="home2-pdp__eyebrow-dot" aria-hidden />
                  Advantages
                </p>
                <h2>Why brands choose this</h2>
              </header>
              <div className="home2-pdp__highlights">
                {detail.highlights.map((highlight) => (
                  <HighlightItem key={highlight.title} highlight={highlight} />
                ))}
              </div>
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
              {detail.banner.description ? (
                <p>{detail.banner.description}</p>
              ) : null}
              {detail.banner.buttonLabel ? (
                <Link
                  href={detail.banner.buttonHref || "/category"}
                  className="home2-pdp__promo-btn"
                >
                  {detail.banner.buttonLabel}
                  <span aria-hidden>→</span>
                </Link>
              ) : null}
            </div>
            <div className="home2-pdp__promo-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bannerImage}
                alt=""
                className="home2-pdp__promo-img"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      ) : null}

      {detail.featureSections.length > 0 ? (
        <section className="home2-pdp__features">
          <div className="home2-pdp__features-inner">
            <header className="home2-pdp__section-head">
              <p className="home2-pdp__eyebrow home2-pdp__eyebrow--dark">
                <span className="home2-pdp__eyebrow-dot" aria-hidden />
                Capabilities
              </p>
              <h2>Designed for every brand moment</h2>
            </header>

            {detail.featureSections.map((section, index) => {
              const imageRight = section.imageSide === "right";
              const featureImage = resolveImage(
                section.image,
                index === 0 ? H2_MEDIA.folding : H2_MEDIA.rigid,
              );
              return (
                <article
                  key={`${section.title}-${index}`}
                  className={`home2-pdp__feature ${imageRight ? "home2-pdp__feature--flip" : ""}`}
                >
                  <div className="home2-pdp__feature-media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featureImage}
                      alt=""
                      className="home2-pdp__feature-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="home2-pdp__feature-copy">
                    <span className="home2-pdp__feature-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3>{section.title}</h3>
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
            <header className="home2-pdp__related-head">
              <div>
                <p className="home2-pdp__eyebrow">
                  <span className="home2-pdp__eyebrow-dot" aria-hidden />
                  Explore more
                </p>
                <h2>{detail.relatedTitle || "Related products"}</h2>
              </div>
              <Link href="/category" className="home2-pdp__related-all">
                View catalog
                <span aria-hidden>→</span>
              </Link>
            </header>

            <div className="home2-pdp__related-grid">
              {related.map((item, index) => {
                const relatedImage = resolveImage(
                  item.image,
                  RELATED_FALLBACKS[index] ?? H2_MEDIA.folding,
                );
                return (
                  <Link
                    key={item.id}
                    href={`/products/${item.slug}`}
                    className="home2-pdp__related-card"
                  >
                    <div className="home2-pdp__related-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={relatedImage}
                        alt={item.name}
                        className="home2-pdp__related-photo"
                        loading="lazy"
                      />
                    </div>
                    <div className="home2-pdp__related-body">
                      <h3>{item.name}</h3>
                      {item.price ? <span>{item.price}</span> : null}
                    </div>
                  </Link>
                );
              })}
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
    <article className="home2-pdp__highlight">
      <span className="home2-pdp__highlight-icon">
        <Icon aria-hidden />
      </span>
      <div>
        <h3>{highlight.title}</h3>
        <p>{highlight.text}</p>
      </div>
    </article>
  );
}
