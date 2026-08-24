"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ProductDetailContent } from "@/types/product";

type Home2ProductPurchasePanelProps = {
  name: string;
  price?: string;
  detail: ProductDetailContent;
};

function FieldLabel({
  children,
  required,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <span className="home2-pdp__label">
      {children}
      {required ? (
        <span className="home2-pdp__req" aria-hidden>
          *
        </span>
      ) : null}
    </span>
  );
}

function SelectField({
  label,
  required,
  options,
  defaultValue,
  ariaLabel,
}: {
  label?: string;
  required?: boolean;
  options: string[];
  defaultValue?: string;
  ariaLabel?: string;
}) {
  return (
    <label className="home2-pdp__field">
      {label ? <FieldLabel required={required}>{label}</FieldLabel> : null}
      <span className="home2-pdp__select">
        <select
          aria-label={ariaLabel ?? label}
          required={required}
          defaultValue={defaultValue ?? options[0] ?? ""}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}

const TRUST_ITEMS = [
  "Free design proof",
  "Low MOQ",
  "8–12 day turnaround",
] as const;

export function Home2ProductPurchasePanel({
  name,
  price,
  detail,
}: Home2ProductPurchasePanelProps) {
  const dimensionFields = detail.dimensionFields ?? [];
  const selectors = detail.selectors ?? [];
  const optionGroups = detail.optionGroups ?? [];
  const quantityOptions = detail.quantityOptions ?? [];

  const [picked, setPicked] = useState<Record<string, Set<string>>>(() => {
    const initial: Record<string, Set<string>> = {};
    for (const group of optionGroups) {
      initial[group.id] = new Set();
    }
    return initial;
  });

  const toggleOption = (groupId: string, option: string) => {
    setPicked((prev) => {
      const next = new Set(prev[groupId] ?? []);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return { ...prev, [groupId]: next };
    });
  };

  return (
    <div className="home2-pdp__panel">
      <div className="home2-pdp__panel-head">
        <div className="home2-pdp__meta">
          {detail.sku ? <span className="home2-pdp__sku">{detail.sku}</span> : null}
          {price ? <span className="home2-pdp__price">{price}</span> : null}
        </div>

        <h1 className="home2-pdp__title">{name}</h1>

        {(detail.summary || "").trim() ? (
          <p className="home2-pdp__summary">{detail.summary}</p>
        ) : null}

        <ul className="home2-pdp__trust" aria-label="Product benefits">
          {TRUST_ITEMS.map((item) => (
            <li key={item}>
              <span className="home2-pdp__trust-dot" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="home2-pdp__config">
        <p className="home2-pdp__config-label">Configure your order</p>

        {dimensionFields.length > 0 ? (
          <div className="home2-pdp__config-block">
            <p className="home2-pdp__block-title">Dimensions</p>
            <div className="home2-pdp__dims">
              {dimensionFields.map((field) => (
                <label key={field.id} className="home2-pdp__field">
                  <FieldLabel required={field.required !== false}>
                    {field.label}
                  </FieldLabel>
                  <input
                    type="text"
                    inputMode="decimal"
                    name={field.id}
                    required={field.required !== false}
                    autoComplete="off"
                    placeholder="0"
                  />
                </label>
              ))}
            </div>
          </div>
        ) : null}

        {selectors.length > 0 ? (
          <div className="home2-pdp__config-block">
            <p className="home2-pdp__block-title">Material & finish</p>
            <div className="home2-pdp__selectors">
              {selectors.map((selector) => (
                <SelectField
                  key={selector.id}
                  label={selector.label}
                  required
                  options={selector.options}
                />
              ))}
            </div>
          </div>
        ) : null}

        {optionGroups.map((group) => (
          <div key={group.id} className="home2-pdp__config-block">
            <p className="home2-pdp__block-title">{group.label}</p>
            <div className="home2-pdp__chips-row">
              {group.options.map((option) => {
                const isActive = picked[group.id]?.has(option);
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => toggleOption(group.id, option)}
                    className={cn(
                      "home2-pdp__chip",
                      isActive && "home2-pdp__chip--active",
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="home2-pdp__config-block home2-pdp__config-block--cta">
          {detail.priceNoteLabel ? (
            <p className="home2-pdp__price-note">
              <Link href={detail.priceNoteHref || "/contact"}>
                {detail.priceNoteLabel}
              </Link>
            </p>
          ) : null}

          <div className="home2-pdp__actions">
            {quantityOptions.length > 0 ? (
              <div className="home2-pdp__qty">
                <FieldLabel>Qty</FieldLabel>
                <SelectField
                  ariaLabel="Quantity"
                  options={quantityOptions}
                  defaultValue={
                    quantityOptions.includes("1000")
                      ? "1000"
                      : quantityOptions[0]
                  }
                />
              </div>
            ) : null}

            <Link href={detail.ctaHref || "/quote"} className="home2-pdp__cta">
              {detail.ctaLabel || "Add to quote"}
            </Link>
          </div>

          <p className="home2-pdp__panel-note">
            Need help choosing specs?{" "}
            <Link href="/contact">Talk to a packaging specialist</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
