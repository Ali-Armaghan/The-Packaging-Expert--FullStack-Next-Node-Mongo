import { home2Quote } from "@/lib/home2/content";
import type { SerializedQuote } from "@/lib/quotes/serialize";

export const QUOTE_STATUS_OPTIONS = [
  { value: "draft", label: "In progress" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted" },
  { value: "closed", label: "Closed" },
] as const;

export type QuoteStatus = (typeof QUOTE_STATUS_OPTIONS)[number]["value"];

const OPTION_LOOKUPS = {
  material: home2Quote.materials,
  color: home2Quote.colors,
  printing: home2Quote.printing,
  coating: home2Quote.coatings,
  thickness: home2Quote.thicknesses,
  addOn: home2Quote.addOns,
} as const;

export function quoteStatusLabel(status: string) {
  return QUOTE_STATUS_OPTIONS.find((item) => item.value === status)?.label ?? status;
}

export function quoteFullName(quote: SerializedQuote) {
  return `${quote.firstName} ${quote.lastName}`.trim() || "—";
}

export function quoteRef(quote: SerializedQuote) {
  return `Q-${quote.id.slice(-6).toUpperCase()}`;
}

export function formatQuoteDate(value: string | null, compact = false) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  if (compact) {
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return date.toLocaleString();
}

export function formatQuoteDims(quote: SerializedQuote) {
  const d = quote.dimensions;
  if (!d || (d.length == null && d.width == null && d.height == null)) {
    return "—";
  }
  const unit = d.unit || "in";
  return `${d.width ?? "—"} × ${d.height ?? "—"} × ${d.length ?? "—"} ${unit}`;
}

export function quoteOptionLabel(
  kind: keyof typeof OPTION_LOOKUPS,
  value?: string | null,
) {
  const trimmed = value?.trim();
  if (!trimmed) return "—";
  return OPTION_LOOKUPS[kind].find((item) => item.value === trimmed)?.label ?? trimmed;
}

export function displayValue(value?: string | number | null) {
  if (value == null) return "—";
  const text = String(value).trim();
  return text || "—";
}
