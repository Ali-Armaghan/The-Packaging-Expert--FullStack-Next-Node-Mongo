import type { QuoteRequestDocument } from "@/models/QuoteRequest";

type QuoteLean = QuoteRequestDocument & {
  createdAt?: Date;
  updatedAt?: Date;
};

export function serializeQuote(doc: QuoteLean) {
  return {
    id: String(doc._id),
    firstName: doc.firstName,
    lastName: doc.lastName,
    email: doc.email,
    phone: doc.phone ?? "",
    productType: doc.productType ?? "",
    quantity: doc.quantity ?? null,
    dimensions: doc.dimensions
      ? {
          length: doc.dimensions.length ?? null,
          width: doc.dimensions.width ?? null,
          height: doc.dimensions.height ?? null,
          unit: doc.dimensions.unit ?? "in",
        }
      : null,
    zip: doc.zip ?? "",
    material: doc.material ?? "",
    color: doc.color ?? "",
    printing: doc.printing ?? "",
    coating: doc.coating ?? "",
    thickness: doc.thickness ?? "",
    addOn: doc.addOn ?? "",
    notes: doc.notes ?? "",
    currentStep: doc.currentStep ?? 1,
    status: doc.status,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
  };
}

export type SerializedQuote = ReturnType<typeof serializeQuote>;
