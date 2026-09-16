import type { SerializedContentTab } from "@/lib/productContentTab/serialize";

export async function parseAdminJson<T>(res: Response): Promise<T> {
  const data = (await res.json()) as {
    success?: boolean;
    error?: string;
    data?: T;
  };
  if (!res.ok || !data.success || data.data === undefined) {
    throw new Error(data.error || "Request failed");
  }
  return data.data;
}

export async function fetchContentTab(tabId: string) {
  const res = await fetch(`/api/admin/product-content-tabs/${tabId}`);
  return parseAdminJson<SerializedContentTab>(res);
}

export function countTabItems(tab: SerializedContentTab) {
  return tab.sections.reduce((sum, section) => sum + section.items.length, 0);
}
