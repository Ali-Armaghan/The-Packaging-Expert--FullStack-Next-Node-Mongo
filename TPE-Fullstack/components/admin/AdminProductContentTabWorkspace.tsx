"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  ChevronRightIcon,
  FolderIcon,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  SerializedContentSection,
  SerializedContentTab,
} from "@/lib/productContentTab/serialize";
import { slugify } from "@/lib/slug";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { fetchContentTab, parseAdminJson } from "./content-tabs/api";
import { ContentTabsChrome } from "./content-tabs/ContentTabsChrome";
import { NamePromptDialog } from "./content-tabs/NamePromptDialog";

export function AdminProductContentTabWorkspace({ tabId }: { tabId: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<SerializedContentTab | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [slugTouched, setSlugTouched] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SerializedContentSection | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await fetchContentTab(tabId);
      setTab(next);
      setName(next.name);
      setSlug(next.slug);
      setSortOrder(next.sortOrder);
      setIsActive(next.isActive);
      setSlugTouched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tab");
      setTab(null);
    } finally {
      setLoading(false);
    }
  }, [tabId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSaveTab = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/product-content-tabs/${tabId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: slug || slugify(name),
          sortOrder,
          isActive,
        }),
      });
      const next = await parseAdminJson<SerializedContentTab>(res);
      setTab(next);
      setName(next.name);
      setSlug(next.slug);
      setSuccess("Tab details saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save tab");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSection = async (title: string) => {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/product-content-tabs/${tabId}/sections`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, isActive: true }),
        },
      );
      const result = await parseAdminJson<{
        tab: SerializedContentTab;
        section: SerializedContentSection;
      }>(res);
      setCreateOpen(false);
      router.push(
        `/admin/products/content-tabs/${tabId}/sections/${result.section.id}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add section");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSection = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/product-content-tabs/${tabId}/sections/${deleteTarget.id}`,
        { method: "DELETE" },
      );
      const next = await parseAdminJson<SerializedContentTab>(res);
      setTab(next);
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete section");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <AgenticLoader label="Loading tab" />
      </div>
    );
  }

  if (!tab) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Tab not found</AlertTitle>
        <AlertDescription>{error || "This tab no longer exists."}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <ContentTabsChrome
        step={2}
        title={tab.name}
        description="Add sections under this tab. Open a section to add items and write their articles."
        crumbs={[
          { href: "/admin/products/content-tabs", label: "Tabs" },
          { label: tab.name },
        ]}
        actions={
          <>
            <Button
              nativeButton={false}
              variant="outline"
              render={<Link href="/admin/products/content-tabs" />}
            >
              All tabs
            </Button>
            <Button
              type="button"
              className="gap-1.5"
              onClick={() => setCreateOpen(true)}
            >
              <PlusIcon className="size-4" />
              Add section
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
      {success ? (
        <Alert>
          <AlertTitle>Saved</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Tab details</CardTitle>
          <CardDescription>
            This name is what customers see on the product page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => void handleSaveTab(e)}>
            <div className="space-y-2">
              <Label htmlFor="tab-name">Tab name</Label>
              <Input
                id="tab-name"
                required
                value={name}
                onChange={(event) => {
                  const next = event.target.value;
                  setName(next);
                  if (!slugTouched) setSlug(slugify(next));
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tab-slug">Slug</Label>
              <Input
                id="tab-slug"
                value={slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(event.target.value);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tab-order">Sort order</Label>
              <Input
                id="tab-order"
                type="number"
                value={sortOrder}
                onChange={(event) => setSortOrder(Number(event.target.value) || 0)}
              />
            </div>
            <label className="flex items-center gap-2 self-end pb-2 text-sm">
              <Checkbox
                checked={isActive}
                onCheckedChange={(value) => setIsActive(value === true)}
              />
              Active on product pages
            </label>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save tab details"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sections</CardTitle>
          <CardDescription>
            {tab.sections.length} section
            {tab.sections.length === 1 ? "" : "s"} in this tab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tab.sections.length === 0 ? (
            <div className="rounded-[3px] border border-dashed border-border px-4 py-10 text-center">
              <FolderIcon className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">No sections yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add a section such as Paperboard & Cardstock, then add items
                inside it.
              </p>
              <Button
                type="button"
                className="mt-4 gap-1.5"
                onClick={() => setCreateOpen(true)}
              >
                <PlusIcon className="size-4" />
                Add first section
              </Button>
            </div>
          ) : (
            <div className="grid gap-3">
              {tab.sections.map((section) => (
                <div
                  key={section.id}
                  className="group flex cursor-pointer items-start justify-between gap-3 rounded-[3px] border border-border p-4 transition-colors hover:border-primary/40 hover:bg-muted/30"
                  onClick={() =>
                    router.push(
                      `/admin/products/content-tabs/${tabId}/sections/${section.id}`,
                    )
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      router.push(
                        `/admin/products/content-tabs/${tabId}/sections/${section.id}`,
                      );
                    }
                  }}
                  role="link"
                  tabIndex={0}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{section.title}</h3>
                      <Badge variant={section.isActive ? "default" : "secondary"}>
                        {section.isActive ? "Active" : "Hidden"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {section.items.length} item
                      {section.items.length === 1 ? "" : "s"}
                    </p>
                    {section.items.length > 0 ? (
                      <p className="mt-2 truncate text-xs text-muted-foreground">
                        {section.items.map((item) => item.title).join(" · ")}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-muted-foreground">
                        No items yet — open to add one.
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Delete ${section.title}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setDeleteTarget(section);
                      }}
                    >
                      <Trash2Icon className="size-4 text-destructive" />
                    </Button>
                    <ChevronRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <NamePromptDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Add a section"
        description="A section groups items under this tab, like Paperboard & Cardstock."
        label="Section name"
        placeholder="Paperboard & Cardstock"
        confirmLabel="Create section"
        loading={creating}
        onSubmit={handleCreateSection}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        itemLabel={deleteTarget?.title}
        description={
          deleteTarget
            ? `Delete “${deleteTarget.title}” and all items inside it?`
            : undefined
        }
        loading={deleting}
        onConfirm={() => void handleDeleteSection()}
      />
    </div>
  );
}
