"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCartIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductDetailContent } from "@/types/product";

type ProductPurchasePanelProps = {
  detail: ProductDetailContent;
  price: string;
};

export function ProductPurchasePanel({
  detail,
  price,
}: ProductPurchasePanelProps) {
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const group of detail.optionGroups) {
      if (group.options[0]) initial[group.id] = group.options[0];
    }
    return initial;
  });

  return (
    <div className="mt-8 space-y-7">
      {detail.selectors.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {detail.selectors.map((selector) => (
            <label key={selector.id} className="block">
              <span className="text-xs font-medium text-muted-foreground">
                {selector.label}
              </span>
              <select
                defaultValue={selector.options[0] ?? ""}
                className="mt-1.5 h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {selector.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      ) : null}

      {detail.optionGroups.map((group) => (
        <div key={group.id}>
          <span className="text-xs font-medium text-muted-foreground">
            {group.label}
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {group.options.map((option) => {
              const isActive = selected[group.id] === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() =>
                    setSelected((prev) => ({ ...prev, [group.id]: option }))
                  }
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-primary text-white shadow-[0_8px_20px_-12px_rgba(52,173,120,0.9)]"
                      : "bg-muted/60 text-muted-foreground ring-1 ring-black/5 hover:text-foreground hover:ring-primary/30",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {detail.priceNoteLabel ? (
        <Link
          href={detail.priceNoteHref || "#"}
          className="inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          {price ? `${price} — ${detail.priceNoteLabel}` : detail.priceNoteLabel}
        </Link>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        {detail.quantityOptions.length > 0 ? (
          <select
            aria-label="Quantity"
            defaultValue={detail.quantityOptions[0]}
            className="h-11 rounded-lg border border-border bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {detail.quantityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : null}

        <Link
          href={detail.ctaHref || "/quote"}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark hover:shadow-md"
        >
          <ShoppingCartIcon className="size-4" aria-hidden />
          {detail.ctaLabel || "Add to cart"}
        </Link>
      </div>
    </div>
  );
}
