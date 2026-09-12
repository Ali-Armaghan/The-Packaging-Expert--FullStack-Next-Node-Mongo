import type { QuoteRequestInput, QuoteUpdateInput } from "@/lib/validations/quote";
import type { QuoteRequestDocument } from "@/models/QuoteRequest";
import type { HydratedDocument } from "mongoose";

type QuotePayload = Partial<QuoteRequestInput> & Partial<QuoteUpdateInput>;

function hasOwn<T extends object>(payload: T, key: keyof T) {
  return Object.prototype.hasOwnProperty.call(payload, key);
}

export function applyQuotePayload(
  doc: HydratedDocument<QuoteRequestDocument>,
  payload: QuotePayload,
) {
  if (payload.firstName !== undefined) doc.firstName = payload.firstName;
  if (payload.lastName !== undefined) doc.lastName = payload.lastName;
  if (payload.email !== undefined) doc.email = payload.email;
  if (payload.phone !== undefined) doc.phone = payload.phone;
  if (payload.company !== undefined) doc.company = payload.company;
  if (payload.productType !== undefined) doc.productType = payload.productType;
  if (payload.industry !== undefined) doc.industry = payload.industry;
  if (payload.quantity !== undefined) doc.quantity = payload.quantity;
  if (payload.zip !== undefined) doc.zip = payload.zip;
  if (payload.material !== undefined) doc.material = payload.material;
  if (payload.color !== undefined) doc.color = payload.color;
  if (payload.printing !== undefined) doc.printing = payload.printing;
  if (payload.coating !== undefined) doc.coating = payload.coating;
  if (payload.thickness !== undefined) doc.thickness = payload.thickness;
  if (payload.addOn !== undefined) doc.addOn = payload.addOn;
  if (payload.notes !== undefined) doc.notes = payload.notes;
  if (payload.step !== undefined) doc.currentStep = payload.step;

  const touchesDimensions =
    hasOwn(payload, "length") ||
    hasOwn(payload, "width") ||
    hasOwn(payload, "height") ||
    hasOwn(payload, "unit");

  if (touchesDimensions) {
    doc.dimensions = {
      length: payload.length ?? doc.dimensions?.length,
      width: payload.width ?? doc.dimensions?.width,
      height: payload.height ?? doc.dimensions?.height,
      unit: payload.unit ?? doc.dimensions?.unit ?? "in",
    };
  }
}
