"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductDetailContent } from "@/types/product";

type ProductPurchasePanelProps = {
  name: string;
  detail: ProductDetailContent;
};

const inputClass =
  "h-10 w-full rounded-[3px] border border-[#d0d0d0] bg-white px-3 text-[13px] text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/15";

const selectClass =
  "h-10 w-full appearance-none rounded-[3px] border border-[#d0d0d0] bg-white px-3 pr-9 text-[13px] text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

function FieldLabel({
  children,
  required,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <span className="mb-1.5 block text-[12px] font-medium text-[#5c5c5c]">
      {children}
      {required ? (
        <span className="ml-0.5 text-[#e11d48]" aria-hidden>
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
    <label className="block min-w-0">
      {label ? <FieldLabel required={required}>{label}</FieldLabel> : null}
      <span className="relative block">
        <select
          aria-label={ariaLabel ?? label}
          required={required}
          defaultValue={defaultValue ?? options[0] ?? ""}
          className={selectClass}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#8a8a8a]"
          aria-hidden
        />
      </span>
    </label>
  );
}

export function ProductPurchasePanel({
  name,
  detail,
}: ProductPurchasePanelProps) {
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
    <div>
      {detail.sku ? (
        <p className="text-[12px] font-medium tracking-wide text-[#9a9a9a]">
          {detail.sku}
        </p>
      ) : null}

      <h1
        className={cn(
          "text-[1.75rem] font-bold leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[2.1rem]",
          detail.sku ? "mt-1.5" : undefined,
        )}
      >
        {name}
      </h1>

      {(detail.summary || "").trim() ? (
        <p className="mt-3.5 text-[14px] leading-[1.65] text-[#333]">
          {detail.summary}
        </p>
      ) : null}

      <div className="mt-5 border-t border-[#e6e6e6] pt-5">
        {dimensionFields.length > 0 ? (
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {dimensionFields.map((field) => (
              <label key={field.id} className="block min-w-0">
                <FieldLabel required={field.required !== false}>
                  {field.label}
                </FieldLabel>
                <input
                  type="text"
                  inputMode="decimal"
                  name={field.id}
                  required={field.required !== false}
                  className={inputClass}
                  autoComplete="off"
                />
              </label>
            ))}
          </div>
        ) : null}

        {selectors.length > 0 ? (
          <div
            className={cn(
              "grid gap-2.5 sm:gap-3",
              dimensionFields.length > 0 && "mt-4",
              selectors.length >= 3
                ? "grid-cols-1 sm:grid-cols-3"
                : selectors.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-1",
            )}
          >
            {selectors.map((selector) => (
              <SelectField
                key={selector.id}
                label={selector.label}
                required
                options={selector.options}
              />
            ))}
          </div>
        ) : null}

        {optionGroups.map((group) => (
          <div key={group.id} className="mt-5">
            <p className="text-[12px] font-medium text-[#5c5c5c]">
              {group.label}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {group.options.map((option) => {
                const isActive = picked[group.id]?.has(option);
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => toggleOption(group.id, option)}
                    className={cn(
                      "h-9 rounded-[3px] px-3.5 text-[13px] font-medium transition",
                      isActive
                        ? "border border-primary bg-primary/10 text-primary"
                        : "border border-transparent bg-[#ededed] text-[#444] hover:bg-[#e4e4e4]",
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
          <p className="mt-6">
            <Link
              href={detail.priceNoteHref || "/contact"}
              className="text-[14px] font-bold uppercase tracking-[0.04em] text-primary"
            >
              {detail.priceNoteLabel}
            </Link>
          </p>
        ) : null}

        <div className="mt-4 flex items-stretch gap-2.5">
          {quantityOptions.length > 0 ? (
            <div className="w-[5.75rem] shrink-0 sm:w-[6.5rem]">
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

          <Link
            href={detail.ctaHref || "/quote"}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2.5 rounded-[3px] bg-primary px-5 text-[13px] font-bold uppercase tracking-[0.04em] text-white transition hover:bg-primary-dark sm:flex-none sm:px-6"
          >
            <span
              className="inline-flex size-5 items-center justify-center rounded-full border-[1.5px] border-white text-[11px] font-bold leading-none"
              aria-hidden
            >
              $
            </span>
            {detail.ctaLabel || "Add to quote"}
          </Link>
        </div>
      </div>
    </div>
  );
}
