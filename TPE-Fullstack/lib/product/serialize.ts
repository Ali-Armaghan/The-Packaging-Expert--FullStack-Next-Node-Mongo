export function serializeProduct(doc: {
  _id: { toString(): string };
  name: string;
  slug: string;
  description?: string | null;
  price?: string | null;
  image?: string | null;
  images?: string[] | null;
  groupByIds?: { toString(): string }[] | null;
  isActive?: boolean | null;
  sortOrder?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    description: doc.description ?? "",
    price: doc.price ?? "",
    image: doc.image || doc.images?.[0] || "",
    groupByIds: (doc.groupByIds ?? []).map((id) => String(id)),
    isActive: doc.isActive ?? true,
    sortOrder: doc.sortOrder ?? 0,
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  };
}
