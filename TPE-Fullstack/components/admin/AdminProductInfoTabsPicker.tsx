"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import type { SerializedContentTab } from "@/lib/productContentTab/serialize";
import type { ProductContentTabSelection } from "@/types/product";

type AdminProductInfoTabsPickerProps = {
  value: ProductContentTabSelection[];
  onChange: (next: ProductContentTabSelection[]) => void;
};

function allItemIds(tab: SerializedContentTab) {
  return tab.sections
    .filter((section) => section.isActive)
    .flatMap((section) =>
      section.items.filter((item) => item.isActive).map((item) => item.id),
    );
}

function sectionItemIds(tab: SerializedContentTab, sectionId: string) {
  const section = tab.sections.find((entry) => entry.id === sectionId);
  if (!section) return [];
  return section.items.filter((item) => item.isActive).map((item) => item.id);
}

export function AdminProductInfoTabsPicker({
  value,
  onChange,
}: AdminProductInfoTabsPickerProps) {
  const [tabs, setTabs] = useState<SerializedContentTab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/product-content-tabs");
        const data = (await res.json()) as {
          success?: boolean;
          error?: string;
          data?: SerializedContentTab[];
        };
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to load tabs");
        }
        if (!cancelled) setTabs((data.data ?? []).filter((tab) => tab.isActive));
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load tabs");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = new Map(value.map((item) => [item.tabId, item]));

  const setTabItems = (tabId: string, itemIds: string[]) => {
    const unique = Array.from(new Set(itemIds));
    if (unique.length === 0) {
      onChange(value.filter((item) => item.tabId !== tabId));
      return;
    }
    if (selected.has(tabId)) {
      onChange(
        value.map((item) =>
          item.tabId === tabId ? { ...item, itemIds: unique } : item,
        ),
      );
      return;
    }
    onChange([...value, { tabId, itemIds: unique }]);
  };

  const toggleTab = (tab: SerializedContentTab, checked: boolean) => {
    setTabItems(tab.id, checked ? allItemIds(tab) : []);
  };

  const toggleSection = (
    tab: SerializedContentTab,
    sectionId: string,
    checked: boolean,
  ) => {
    const current = selected.get(tab.id)?.itemIds ?? [];
    const ids = sectionItemIds(tab, sectionId);
    if (checked) {
      setTabItems(tab.id, [...current, ...ids]);
      return;
    }
    const remove = new Set(ids);
    setTabItems(
      tab.id,
      current.filter((id) => !remove.has(id)),
    );
  };

  const toggleItem = (
    tab: SerializedContentTab,
    itemId: string,
    checked: boolean,
  ) => {
    const current = selected.get(tab.id)?.itemIds ?? [];
    if (checked) {
      setTabItems(tab.id, [...current, itemId]);
      return;
    }
    setTabItems(
      tab.id,
      current.filter((id) => id !== itemId),
    );
  };

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Loading tab library…</p>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (tabs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No tabs in the library yet.{" "}
        <Link href="/admin/products/content-tabs" className="underline">
          Create tabs, sections, and items
        </Link>{" "}
        first.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {tabs.map((tab) => {
        const pick = selected.get(tab.id);
        const picked = new Set(pick?.itemIds ?? []);
        const tabIds = allItemIds(tab);
        const tabChecked = tabIds.length > 0 && tabIds.every((id) => picked.has(id));
        const activeSections = tab.sections.filter((section) => section.isActive);

        return (
          <div
            key={tab.id}
            className="space-y-3 rounded-[3px] border border-border p-3"
          >
            <label className="flex items-center gap-2 text-sm font-medium">
              <Checkbox
                checked={tabChecked}
                onCheckedChange={(v) => toggleTab(tab, v === true)}
              />
              {tab.name}
            </label>
            {activeSections.map((section) => {
              const ids = sectionItemIds(tab, section.id);
              const sectionChecked =
                ids.length > 0 && ids.every((id) => picked.has(id));
              const items = section.items.filter((item) => item.isActive);
              return (
                <div key={section.id} className="ml-5 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground/90">
                    <Checkbox
                      checked={sectionChecked}
                      onCheckedChange={(v) =>
                        toggleSection(tab, section.id, v === true)
                      }
                    />
                    {section.title}
                  </label>
                  {items.length > 0 ? (
                    <div className="ml-6 grid gap-2 sm:grid-cols-2">
                      {items.map((item) => (
                        <label
                          key={item.id}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <Checkbox
                            checked={picked.has(item.id)}
                            onCheckedChange={(v) =>
                              toggleItem(tab, item.id, v === true)
                            }
                          />
                          {item.title}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="ml-6 text-xs text-muted-foreground">
                      No items in this section.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
