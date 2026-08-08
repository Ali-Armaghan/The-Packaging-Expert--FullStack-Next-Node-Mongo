"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ProductTab } from "@/types/product";

export function ProductTabs({ tabs }: { tabs: ProductTab[] }) {
  const [active, setActive] = useState(0);
  if (tabs.length === 0) return null;

  const current = tabs[Math.min(active, tabs.length - 1)];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Product information"
        className="flex gap-1 overflow-x-auto border-b border-border pb-px [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`product-tab-${tab.id}`}
            aria-selected={index === active}
            aria-controls={`product-panel-${tab.id}`}
            onClick={() => setActive(index)}
            className={cn(
              "-mb-px shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition",
              index === active
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`product-panel-${current.id}`}
        aria-labelledby={`product-tab-${current.id}`}
        className="max-w-3xl pt-6 text-sm leading-relaxed text-muted-foreground"
      >
        {current.body.split("\n").filter(Boolean).map((line, index) => (
          <p key={index} className={index > 0 ? "mt-3" : undefined}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
