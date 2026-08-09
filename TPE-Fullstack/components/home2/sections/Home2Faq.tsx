"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { Home2FaqContent } from "@/lib/home2/content";

type Home2FaqProps = {
  content: Home2FaqContent;
};

/** Animated accordion FAQ — placed near the end of /home2. */
export function Home2Faq({ content }: Home2FaqProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(content.items[0]?.id ?? null);

  return (
    <section className="home2-faq" aria-label="Frequently asked questions">
      <div className="home2-faq__inner">
        <header className="home2-faq__header">
          <p className="home2-vision__eyebrow">
            <span className="home2-vision__eyebrow-dot" />
            {content.eyebrow}
          </p>
          <h2 className="home2-faq__title">{content.title}</h2>
          <p className="home2-faq__subtitle">{content.subtitle}</p>
          <Link href={content.cta.href} className="home2-faq__cta">
            {content.cta.label}
            <span aria-hidden="true">→</span>
          </Link>
        </header>

        <div className="home2-faq__list">
          {content.items.map((item, index) => {
            const isOpen = openId === item.id;
            const panelId = `${baseId}-panel-${item.id}`;
            const buttonId = `${baseId}-button-${item.id}`;

            return (
              <div
                key={item.id}
                className={`home2-faq__item ${isOpen ? "home2-faq__item--open" : ""}`}
                style={{ ["--faq-i" as string]: String(index) }}
              >
                <h3 className="home2-faq__question">
                  <button
                    id={buttonId}
                    type="button"
                    className="home2-faq__trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() =>
                      setOpenId((current) =>
                        current === item.id ? null : item.id,
                      )
                    }
                  >
                    <span className="home2-faq__q-text">{item.question}</span>
                    <span className="home2-faq__icon" aria-hidden="true">
                      <span className="home2-faq__icon-h" />
                      <span className="home2-faq__icon-v" />
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="home2-faq__panel"
                >
                  <div className="home2-faq__panel-inner">
                    <p className="home2-faq__answer">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
