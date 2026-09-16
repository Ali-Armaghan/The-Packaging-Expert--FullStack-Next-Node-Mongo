"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
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
  const [query, setQuery] = useState("");
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [openReady, setOpenReady] = useState(false);

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
        if (!cancelled) {
          const active = (data.data ?? []).filter((tab) => tab.isActive);
          setTabs(active);
        }
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

  useEffect(() => {
    if (openReady || tabs.length === 0) return;
    const selectedIds = new Set(value.map((item) => item.tabId));
    const initial = tabs
      .filter((tab) => selectedIds.has(tab.id) || selectedIds.size === 0)
      .map((tab) => tab.id);
    setOpenTabs(initial.slice(0, selectedIds.size > 0 ? initial.length : 1));
    setOpenReady(true);
  }, [openReady, tabs, value]);

  const selected = new Map(value.map((item) => [item.tabId, item]));
  const needle = query.trim().toLowerCase();

  const visibleTabs = useMemo(() => {
    if (!needle) return tabs;
    return tabs
      .map((tab) => {
        const tabMatch = tab.name.toLowerCase().includes(needle);
        const sections = tab.sections
          .map((section) => {
            const sectionMatch = section.title.toLowerCase().includes(needle);
            const items = section.items.filter(
              (item) =>
                sectionMatch ||
                tabMatch ||
                item.title.toLowerCase().includes(needle),
            );
            if (!tabMatch && !sectionMatch && items.length === 0) return null;
            return {
              ...section,
              items: tabMatch || sectionMatch ? section.items : items,
            };
          })
          .filter((section): section is NonNullable<typeof section> =>
            Boolean(section),
          );
        if (!tabMatch && sections.length === 0) return null;
        return { ...tab, sections: tabMatch ? tab.sections : sections };
      })
      .filter((tab): tab is NonNullable<typeof tab> => Boolean(tab));
  }, [needle, tabs]);

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

  const toggleOpen = (tabId: string) => {
    setOpenTabs((current) =>
      current.includes(tabId)
        ? current.filter((id) => id !== tabId)
        : [...current, tabId],
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
          Create a tab, then sections and items
        </Link>{" "}
        first.
      </p>
    );
  }

  const selectedCount = value.reduce(
    (sum, entry) => sum + entry.itemIds.length,
    0,
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {selectedCount} item{selectedCount === 1 ? "" : "s"} selected for this
          product.
        </p>
        <Link
          href="/admin/products/content-tabs"
          className="text-xs underline underline-offset-2"
        >
          Open library
        </Link>
      </div>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tabs, sections, or items"
          className="pl-8"
        />
      </div>
      {visibleTabs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No matches for “{query}”.</p>
      ) : (
        visibleTabs.map((tab) => {
          const source = tabs.find((entry) => entry.id === tab.id) ?? tab;
          const pick = selected.get(tab.id);
          const picked = new Set(pick?.itemIds ?? []);
          const tabIds = allItemIds(source);
          const tabChecked =
            tabIds.length > 0 && tabIds.every((id) => picked.has(id));
          const pickedCount = tabIds.filter((id) => picked.has(id)).length;
          const open = openTabs.includes(tab.id) || Boolean(needle);
          const activeSections = tab.sections.filter((section) => section.isActive);

          return (
            <div
              key={tab.id}
              className="rounded-[3px] border border-border"
            >
              <div className="flex items-center gap-2 p-3">
                <Checkbox
                  checked={tabChecked}
                  onCheckedChange={(v) => toggleTab(source, v === true)}
                  aria-label={`Select all items in ${tab.name}`}
                />
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-center justify-between gap-2 text-left text-sm font-medium"
                  onClick={() => toggleOpen(tab.id)}
                >
                  <span className="truncate">{tab.name}</span>
                  <span className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {pickedCount}/{tabIds.length}
                    </Badge>
                    <ChevronDownIcon
                      className={cn(
                        "size-4 text-muted-foreground transition-transform",
                        open ? "rotate-0" : "-rotate-90",
                      )}
                    />
                  </span>
                </button>
              </div>
              {open ? (
                <div className="space-y-3 border-t border-border px-3 py-3">
                  {activeSections.map((section) => {
                    const ids = sectionItemIds(source, section.id);
                    const sectionChecked =
                      ids.length > 0 && ids.every((id) => picked.has(id));
                    const items = section.items.filter((item) => item.isActive);
                    return (
                      <div key={section.id} className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium">
                          <Checkbox
                            checked={sectionChecked}
                            onCheckedChange={(v) =>
                              toggleSection(source, section.id, v === true)
                            }
                          />
                          {section.title}
                        </label>
                        {items.length > 0 ? (
                          <div className="ml-6 grid gap-2 sm:grid-cols-2">
                            {items.map((item) => (
                              <label
                                key={item.id}
                                className="flex items-center gap-2 rounded-[3px] border border-transparent px-1 py-0.5 text-sm text-muted-foreground hover:border-border hover:bg-muted/40"
                              >
                                <Checkbox
                                  checked={picked.has(item.id)}
                                  onCheckedChange={(v) =>
                                    toggleItem(source, item.id, v === true)
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
              ) : null}
            </div>
          );
        })
      )}
    </div>
  );
}
