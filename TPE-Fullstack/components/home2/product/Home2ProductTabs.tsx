"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ProductInfoTabView } from "@/types/product";

type Home2ProductTabsProps = {
  tabs: ProductInfoTabView[];
};

export function Home2ProductTabs({ tabs }: Home2ProductTabsProps) {
  const [active, setActive] = useState(0);
  if (tabs.length === 0) return null;

  const current = tabs[Math.min(active, tabs.length - 1)];

  return (
    <div className="home2-pdp__tabs">
      <div
        role="tablist"
        aria-label="Product information"
        className="home2-pdp__tablist"
      >
        {tabs.map((tab, index) => {
          const isActive = index === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`home2-product-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`home2-product-panel-${tab.id}`}
              onClick={() => setActive(index)}
              className={cn(
                "home2-pdp__tab",
                isActive && "home2-pdp__tab--active",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`home2-product-panel-${current.id}`}
        aria-labelledby={`home2-product-tab-${current.id}`}
        className="home2-pdp__tabpanel"
      >
        <div className="home2-pdp__tab-sections">
          {current.sections.map((section) => (
            <section key={section.id} className="home2-pdp__tab-section">
              <h3 className="home2-pdp__tab-section-title">{section.title}</h3>
              <div className="home2-pdp__item-grid">
                {section.items.map((item) => {
                  const card = (
                    <>
                      <span className="home2-pdp__item-media">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image} alt="" />
                        ) : (
                          <span className="home2-pdp__item-placeholder" />
                        )}
                      </span>
                      <span className="home2-pdp__item-name">{item.title}</span>
                    </>
                  );
                  if (item.href) {
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className="home2-pdp__item-card"
                      >
                        {card}
                      </Link>
                    );
                  }
                  return (
                    <div key={item.id} className="home2-pdp__item-card">
                      {card}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
