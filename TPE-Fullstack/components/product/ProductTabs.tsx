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

type ProductTabsProps = {
  tabs: ProductTab[];
  orderProcess?: ProductOrderProcess;
};

export function ProductTabs({ tabs, orderProcess }: ProductTabsProps) {
  const [active, setActive] = useState(0);
  if (tabs.length === 0) return null;

  const current = tabs[Math.min(active, tabs.length - 1)];
  const isOrderProcess =
    current.id === "order-process" ||
    current.label.toLowerCase().includes("order process");

  return (
    <div>
      <div
        role="tablist"
        aria-label="Product information"
        className="flex gap-0 overflow-x-auto border-b border-black/[0.08] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab, index) => {
          const isActive = index === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`product-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`product-panel-${tab.id}`}
              onClick={() => setActive(index)}
              className={cn(
                "-mb-px shrink-0 border-b-2 px-4 py-3 text-[14px] font-semibold transition sm:px-5",
                isActive
                  ? "border-foreground bg-[#f0f0f0] text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`product-panel-${current.id}`}
        aria-labelledby={`product-tab-${current.id}`}
        className="pt-8 sm:pt-10"
      >
        {isOrderProcess && orderProcess ? (
          <OrderProcessPanel content={orderProcess} />
        ) : (
          <div className="max-w-3xl text-[15px] leading-[1.75] text-muted-foreground">
            {current.body
              .split("\n")
              .filter(Boolean)
              .map((line, index) => (
                <p key={index} className={index > 0 ? "mt-3.5" : undefined}>
                  {line}
                </p>
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
    <div className="mx-auto max-w-5xl">
      <div className="mx-auto max-w-2xl text-center">
        {content.title ? (
          <h2 className="text-[1.65rem] font-bold tracking-[-0.02em] text-foreground sm:text-[1.85rem]">
            {content.title}
          </h2>
        ) : null}
        {content.description ? (
          <p className="mt-3 text-[14px] leading-[1.7] text-[#555] sm:text-[15px]">
            {content.description}
          </p>
        ) : null}
      </div>

      {steps.length > 0 ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {steps.map((step) => {
            const Icon = ORDER_ICONS[step.icon] ?? GiftIcon;
            return (
              <article
                key={step.title}
                className="flex flex-col items-center rounded-[3px] bg-[#f5f5f5] px-5 py-8 text-center"
              >
                <span className="relative inline-flex size-14 items-center justify-center text-primary">
                  <Icon className="size-10 stroke-[1.5]" aria-hidden />
                  {step.icon === "quote" ? (
                    <span
                      className="absolute -right-0.5 -top-0.5 inline-flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white"
                      aria-hidden
                    >
                      1
                    </span>
                  ) : null}
                </span>
                <h3 className="mt-5 text-[15px] font-bold leading-snug text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[13px] leading-[1.65] text-[#666]">
                  {step.text}
                </p>
              </article>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
