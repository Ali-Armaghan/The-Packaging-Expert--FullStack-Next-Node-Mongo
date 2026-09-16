import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ProductContentTab } from "@/models/ProductContentTab";
import type {
  ProductContentTabSelection,
  ProductInfoItemView,
  ProductInfoSectionView,
  ProductInfoTabView,
  ProductOrderProcess,
  ProductTab,
} from "@/types/product";
import { serializeContentTab } from "./serialize";

function fallbackTabs(
  tabs: ProductTab[],
  orderProcess?: ProductOrderProcess,
): ProductInfoTabView[] {
  return tabs
    .map((tab) => {
      const isOrderProcess =
        tab.id === "order-process" ||
        tab.label.toLowerCase().includes("order process");

      const items: ProductInfoItemView[] = [];
      if (isOrderProcess && orderProcess) {
        if (orderProcess.title || orderProcess.description) {
          items.push({
            id: `${tab.id}-intro`,
            title: orderProcess.title || "Order process",
            slug: "",
            image: "",
            href: "",
          });
        }
        for (const [index, step] of (orderProcess.steps ?? []).entries()) {
          items.push({
            id: `${tab.id}-step-${index}`,
            title: step.title,
            slug: "",
            image: "",
            href: "",
          });
        }
      } else if (tab.body.trim()) {
        items.push({
          id: `${tab.id}-body`,
          title: tab.label,
          slug: "",
          image: "",
          href: "",
        });
      }

      if (items.length === 0) return null;
      return {
        id: tab.id,
        label: tab.label,
        sections: [
          {
            id: `${tab.id}-section`,
            title: tab.label,
            items,
          },
        ],
      };
    })
    .filter((tab): tab is ProductInfoTabView => tab !== null);
}

export async function resolveProductInfoTabs(
  contentTabs: ProductContentTabSelection[] | undefined,
  fallback: { tabs: ProductTab[]; orderProcess?: ProductOrderProcess },
): Promise<ProductInfoTabView[]> {
  const selections = (contentTabs ?? []).filter(
    (item) => item.tabId && (item.itemIds?.length || 0) > 0,
  );
  if (selections.length === 0) {
    return fallbackTabs(fallback.tabs, fallback.orderProcess);
  }

  const ids = selections
    .map((item) => item.tabId)
    .filter((id) => mongoose.Types.ObjectId.isValid(id));
  if (ids.length === 0) {
    return fallbackTabs(fallback.tabs, fallback.orderProcess);
  }

  await connectToDatabase();
  const docs = await ProductContentTab.find({ isActive: true })
    .where("_id")
    .in(ids)
    .lean();
  const byId = new Map(docs.map((doc) => [String(doc._id), serializeContentTab(doc)]));

  return selections
    .map((selection) => {
      const tab = byId.get(selection.tabId);
      if (!tab) return null;
      const allow = new Set(selection.itemIds);
      const sections = tab.sections
        .filter((section) => section.isActive)
        .map((section) => {
          const items = section.items
            .filter((item) => item.isActive && allow.has(item.id))
            .map((item) => ({
              id: item.id,
              title: item.title,
              slug: item.slug,
              image: item.image,
              href: item.slug ? `/info/${item.slug}` : "",
            }));
          if (items.length === 0) return null;
          return {
            id: section.id,
            title: section.title,
            items,
          };
        })
        .filter((section): section is ProductInfoSectionView => section !== null);
      if (sections.length === 0) return null;
      return {
        id: tab.id,
        label: tab.name,
        sections,
      };
    })
    .filter((tab): tab is ProductInfoTabView => tab !== null);
}
