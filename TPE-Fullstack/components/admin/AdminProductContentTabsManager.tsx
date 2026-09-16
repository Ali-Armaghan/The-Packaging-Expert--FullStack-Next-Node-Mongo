"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  ChevronRightIcon,
  LayersIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AgenticLoader } from "@/components/ui/AgenticLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SerializedContentTab } from "@/lib/productContentTab/serialize";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { countTabItems, parseAdminJson } from "./content-tabs/api";
import { ContentTabsChrome } from "./content-tabs/ContentTabsChrome";
import { NamePromptDialog } from "./content-tabs/NamePromptDialog";

export function AdminProductContentTabsManager() {
  const router = useRouter();
  const [tabs, setTabs] = useState<SerializedContentTab[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SerializedContentTab | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  const loadTabs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/product-content-tabs");
      setTabs(await parseAdminJson<SerializedContentTab[]>(res));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tabs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTabs();
  }, [loadTabs]);

  const handleCreate = async (name: string) => {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/product-content-tabs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          sortOrder: tabs.length,
          isActive: true,
          sections: [],
        }),
      });
      const tab = await parseAdminJson<SerializedContentTab>(res);
      setCreateOpen(false);
      router.push(`/admin/products/content-tabs/${tab.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create tab");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/product-content-tabs/${deleteTarget.id}`,
        { method: "DELETE" },
      );
      await parseAdminJson(res);
      setDeleteTarget(null);
      await loadTabs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete tab");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ContentTabsChrome
        step={1}
        title="Product information tabs"
        description="Work one level at a time: open a tab, add sections, then write each item article. Products pick items from this library."
        crumbs={[
          { href: "/admin/products", label: "Products" },
          { label: "Information tabs" },
        ]}
        actions={
          <>
            <Button
              nativeButton={false}
              variant="outline"
              render={<Link href="/admin/products" />}
            >
              Back to products
            </Button>
            <Button
              type="button"
              className="gap-1.5"
              onClick={() => setCreateOpen(true)}
            >
              <PlusIcon className="size-4" />
              Add tab
            </Button>
          </>
        }
      />

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Library</CardTitle>
          <CardDescription>
            {tabs.length} tab{tabs.length === 1 ? "" : "s"}. Open a tab to
            manage its sections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <AgenticLoader label="Loading tabs" />
            </div>
          ) : tabs.length === 0 ? (
            <div className="rounded-[3px] border border-dashed border-border px-4 py-10 text-center">
              <LayersIcon className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">No tabs yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Start with a tab like Materials & Stock, then add sections and
                items.
              </p>
              <Button
                type="button"
                className="mt-4 gap-1.5"
                onClick={() => setCreateOpen(true)}
              >
                <PlusIcon className="size-4" />
                Add first tab
              </Button>
            </div>
          ) : (
            <div className="grid gap-3">
              {tabs.map((tab) => {
                const itemCount = countTabItems(tab);
                return (
                  <div
                    key={tab.id}
                    className="group flex cursor-pointer items-start justify-between gap-3 rounded-[3px] border border-border p-4 transition-colors hover:border-primary/40 hover:bg-muted/30"
                    onClick={() =>
                      router.push(`/admin/products/content-tabs/${tab.id}`)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.push(`/admin/products/content-tabs/${tab.id}`);
                      }
                    }}
                    role="link"
                    tabIndex={0}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{tab.name}</h3>
                        <Badge variant={tab.isActive ? "default" : "secondary"}>
                          {tab.isActive ? "Active" : "Hidden"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {tab.sections.length} section
                        {tab.sections.length === 1 ? "" : "s"} · {itemCount}{" "}
                        item{itemCount === 1 ? "" : "s"}
                      </p>
                      {tab.sections.length > 0 ? (
                        <p className="mt-2 truncate text-xs text-muted-foreground">
                          {tab.sections.map((section) => section.title).join(" · ")}
                        </p>
                      ) : (
                        <p className="mt-2 text-xs text-muted-foreground">
                          No sections yet — open to add one.
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`Delete ${tab.name}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          setDeleteTarget(tab);
                        }}
                      >
                        <Trash2Icon className="size-4 text-destructive" />
                      </Button>
                      <ChevronRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <NamePromptDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Add a tab"
        description="A tab is the top-level group on the product page, like Materials & Stock."
        label="Tab name"
        placeholder="Materials & Stock"
        confirmLabel="Create tab"
        loading={creating}
        onSubmit={handleCreate}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        itemLabel={deleteTarget?.name}
        description={
          deleteTarget
            ? `Delete “${deleteTarget.name}” and all of its sections and items?`
            : undefined
        }
        loading={deleting}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
