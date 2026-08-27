"use client";

import { useState } from "react";
import {
  GiftIcon,
  HeadphonesIcon,
  PackageOpenIcon,
  TruckIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  ProductOrderProcess,
  ProductOrderProcessIcon,
  ProductTab,
} from "@/types/product";

const ORDER_ICONS: Record<ProductOrderProcessIcon, LucideIcon> = {
  customize: GiftIcon,
  quote: PackageOpenIcon,
  consult: HeadphonesIcon,
  shipping: TruckIcon,
};

type Home2ProductTabsProps = {
  tabs: ProductTab[];
  orderProcess?: ProductOrderProcess;
};

export function Home2ProductTabs({ tabs, orderProcess }: Home2ProductTabsProps) {
  const [active, setActive] = useState(0);
  if (tabs.length === 0) return null;

  const current = tabs[Math.min(active, tabs.length - 1)];
  const isOrderProcess =
    current.id === "order-process" ||
    current.label.toLowerCase().includes("order process");

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
        {isOrderProcess && orderProcess ? (
          <OrderProcessPanel content={orderProcess} />
        ) : (
          <div className="home2-pdp__copy">
            {current.body
              .split("\n")
              .filter(Boolean)
              .map((line, index) => (
                <p key={index}>{line}</p>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderProcessPanel({ content }: { content: ProductOrderProcess }) {
  const steps = content.steps ?? [];
  if (!content.title && steps.length === 0) return null;

  return (
    <div className="home2-pdp__process">
      <div className="home2-pdp__process-intro">
        {content.title ? (
          <h3 className="home2-pdp__process-title">{content.title}</h3>
        ) : null}
        {content.description ? (
          <p className="home2-pdp__process-desc">{content.description}</p>
        ) : null}
      </div>

      {steps.length > 0 ? (
        <ol className="home2-pdp__process-grid">
          {steps.map((step, index) => {
            const Icon = ORDER_ICONS[step.icon] ?? GiftIcon;
            return (
              <li key={step.title} className="home2-pdp__process-card">
                <div className="home2-pdp__process-top">
                  <span className="home2-pdp__process-icon">
                    <Icon aria-hidden />
                  </span>
                  <span className="home2-pdp__process-num">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </li>
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}
