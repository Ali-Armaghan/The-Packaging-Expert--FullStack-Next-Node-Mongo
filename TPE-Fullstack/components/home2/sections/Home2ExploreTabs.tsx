"use client";

import Link from "next/link";
import { useId, useState, useTransition } from "react";
import type {
  Home2ExploreContent,
  Home2ExploreTabId,
} from "@/lib/home2/content";

type Home2ExploreTabsProps = {
  content: Home2ExploreContent;
};

/**
 * Tabbed browse section — Industry / Style / Category / Product.
 * Sits above the “Why brands choose us” pillars.
 */
export function Home2ExploreTabs({ content }: Home2ExploreTabsProps) {
  const tabsId = useId();
  const [activeId, setActiveId] = useState<Home2ExploreTabId>(
    content.tabs[0]?.id ?? "industry",
  );
  const [, startTransition] = useTransition();

  const activeTab =
    content.tabs.find((tab) => tab.id === activeId) ?? content.tabs[0];

  if (!activeTab) return null;

  return (
    <section className="home2-explore" aria-label="Browse packaging">
      <div className="home2-explore__inner">
        <header className="home2-explore__header">
          <p className="home2-vision__eyebrow">
            <span className="home2-vision__eyebrow-dot" />
            {content.eyebrow}
          </p>
          <h2 className="home2-explore__title">{content.title}</h2>
          <p className="home2-explore__subtitle">{content.subtitle}</p>
        </header>

        <div
          className="home2-explore__tabs"
          role="tablist"
          aria-label="Browse by"
        >
          {content.tabs.map((tab) => {
            const selected = tab.id === activeId;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`${tabsId}-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`${tabsId}-panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                className={
                  selected
                    ? "home2-explore__tab home2-explore__tab--active"
                    : "home2-explore__tab"
                }
                onClick={() =>
                  startTransition(() => {
                    setActiveId(tab.id);
                  })
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          key={activeTab.id}
          role="tabpanel"
          id={`${tabsId}-panel-${activeTab.id}`}
          aria-labelledby={`${tabsId}-tab-${activeTab.id}`}
          className="home2-explore__panel"
        >
          <div className="home2-explore__panel-head">
            <p className="home2-explore__panel-desc">{activeTab.description}</p>
            <Link href={activeTab.cta.href} className="home2-explore__panel-cta">
              {activeTab.cta.label}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <ul className="home2-explore__grid">
            {activeTab.items.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className="home2-explore__card">
                  <span className="home2-explore__media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt="" />
                  </span>
                  <span className="home2-explore__body">
                    <span className="home2-explore__name">{item.title}</span>
                    <span className="home2-explore__text">
                      {item.description}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
