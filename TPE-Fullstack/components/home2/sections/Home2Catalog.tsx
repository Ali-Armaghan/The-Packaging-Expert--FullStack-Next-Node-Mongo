"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Home2CatalogContent, Home2CatalogItem } from "@/lib/home2/content";

type Home2CatalogProps = {
  content: Home2CatalogContent;
};

type RailProps = {
  label: string;
  children: ReactNode;
  className?: string;
  itemSelector: string;
  leading?: ReactNode;
};

function RailNav({
  onPrev,
  onNext,
  canPrev,
  canNext,
  prevLabel,
  nextLabel,
}: {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  prevLabel: string;
  nextLabel: string;
}) {
  return (
    <div className="home2-rail__nav">
      <button
        type="button"
        className="home2-rail__btn"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label={prevLabel}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        className="home2-rail__btn"
        onClick={onNext}
        disabled={!canNext}
        aria-label={nextLabel}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9 18l6-6-6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

function Home2Rail({
  label,
  children,
  className,
  itemSelector,
  leading,
}: RailProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [active, setActive] = useState(0);
  const [count, setCount] = useState(0);
  const regionId = useId();

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < max - 8);
    const items = el.querySelectorAll<HTMLElement>(itemSelector);
    setCount(items.length);
    if (!items.length) return;
    const center = el.scrollLeft + el.clientWidth * 0.35;
    let best = 0;
    let bestDist = Infinity;
    items.forEach((item, i) => {
      const dist = Math.abs(item.offsetLeft - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
  }, [itemSelector]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update, children]);

  const scrollByDir = (dir: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const item = el.querySelector<HTMLElement>(itemSelector);
    const gap = 16;
    const amount = (item?.offsetWidth ?? 280) + gap;
    el.scrollBy({
      left: dir === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  const scrollTo = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const item = el.querySelectorAll<HTMLElement>(itemSelector)[index];
    if (!item) return;
    el.scrollTo({ left: item.offsetLeft, behavior: "smooth" });
  };

  return (
    <div className={`home2-rail ${className ?? ""}`}>
      <div className="home2-rail__toolbar">
        <div className="home2-rail__leading">
          {leading ?? (
            <p className="home2-rail__hint" id={regionId}>
              {label}
            </p>
          )}
          {leading ? (
            <span className="home2-rail__hint-sr" id={regionId}>
              {label}
            </span>
          ) : null}
        </div>
        <RailNav
          onPrev={() => scrollByDir("prev")}
          onNext={() => scrollByDir("next")}
          canPrev={canPrev}
          canNext={canNext}
          prevLabel={`Previous ${label}`}
          nextLabel={`Next ${label}`}
        />
      </div>

      <div
        ref={scrollerRef}
        className="home2-rail__track"
        role="region"
        aria-labelledby={regionId}
        tabIndex={0}
      >
        {children}
      </div>

      {count > 1 && count <= 8 ? (
        <div className="home2-rail__dots" role="tablist" aria-label={label}>
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Go to slide ${i + 1}`}
              className={
                i === active
                  ? "home2-rail__dot home2-rail__dot--active"
                  : "home2-rail__dot"
              }
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CategoryCard({ item }: { item: Home2CatalogItem }) {
  return (
    <Link
      href={item.href}
      className="home2-catalog__slide"
      data-catalog-slide
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.image} alt="" className="home2-catalog__slide-img" />
      <span className="home2-catalog__slide-shade" />
      <span className="home2-catalog__slide-body">
        <span className="home2-catalog__slide-title">{item.title}</span>
        <span className="home2-catalog__slide-desc">{item.description}</span>
      </span>
    </Link>
  );
}

function StyleCard({ item }: { item: Home2CatalogItem }) {
  return (
    <Link href={item.href} className="home2-catalog__style-slide" data-style-slide>
      <span className="home2-catalog__style-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt="" />
      </span>
      <span className="home2-catalog__style-body">
        <span className="home2-catalog__style-title">{item.title}</span>
        <span className="home2-catalog__style-desc">{item.description}</span>
        <span className="home2-catalog__style-link">
          Explore <span aria-hidden="true">→</span>
        </span>
      </span>
    </Link>
  );
}

function ProductCard({ item }: { item: Home2CatalogItem }) {
  return (
    <Link
      href={item.href}
      className="home2-catalog__product-slide"
      data-product-slide
    >
      <span className="home2-catalog__product-thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt="" />
      </span>
      <span className="home2-catalog__product-text">
        <span className="home2-catalog__product-title">{item.title}</span>
        <span className="home2-catalog__product-desc">{item.description}</span>
      </span>
    </Link>
  );
}

/**
 * Early catalog directory — carousel rails for categories, styles, products.
 */
export function Home2Catalog({ content }: Home2CatalogProps) {
  return (
    <section className="home2-catalog">
      <div className="home2-catalog__inner">
        <nav className="home2-catalog__hubs" aria-label="Browse directions">
          {content.hubs.map((hub) => (
            <Link key={hub.href} href={hub.href} className="home2-catalog__hub">
              {hub.label}
            </Link>
          ))}
        </nav>

        <header className="home2-catalog__header">
          <div>
            <p className="home2-vision__eyebrow">
              <span className="home2-vision__eyebrow-dot" />
              {content.eyebrow}
            </p>
            <h2 className="home2-catalog__title">{content.title}</h2>
            <p className="home2-catalog__subtitle">{content.subtitle}</p>
          </div>
          <Link href={content.cta.href} className="home2-vision__cta">
            {content.cta.label}
            <span aria-hidden="true">→</span>
          </Link>
        </header>

        <Home2Rail
          label="Categories"
          itemSelector="[data-catalog-slide]"
          className="home2-rail--categories"
        >
          {content.categories.map((item) => (
            <CategoryCard key={item.id} item={item} />
          ))}
        </Home2Rail>

        <div className="home2-catalog__block">
          <Home2Rail
            label="Styles"
            itemSelector="[data-style-slide]"
            leading={
              <>
                <p className="home2-vision__eyebrow">
                  <span className="home2-vision__eyebrow-dot" />
                  {content.stylesEyebrow}
                </p>
                <h3 className="home2-catalog__block-title">
                  {content.stylesTitle}
                </h3>
              </>
            }
          >
            {content.styles.map((item) => (
              <StyleCard key={item.id} item={item} />
            ))}
          </Home2Rail>
        </div>

        <div className="home2-catalog__block">
          <Home2Rail
            label="Products"
            itemSelector="[data-product-slide]"
            leading={
              <>
                <p className="home2-vision__eyebrow">
                  <span className="home2-vision__eyebrow-dot" />
                  {content.productsEyebrow}
                </p>
                <h3 className="home2-catalog__block-title">
                  {content.productsTitle}
                </h3>
              </>
            }
          >
            {content.products.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </Home2Rail>
        </div>
      </div>
    </section>
  );
}
