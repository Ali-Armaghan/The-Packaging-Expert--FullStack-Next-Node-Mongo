"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  ChevronRightIcon,
  FileTextIcon,
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
  SerializedContentItem,
  SerializedContentSection,
  SerializedContentTab,
} from "@/lib/productContentTab/serialize";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { fetchContentTab, parseAdminJson } from "./content-tabs/api";
import { ContentTabsChrome } from "./content-tabs/ContentTabsChrome";

export function AdminProductContentSectionWorkspace({
  tabId,
  sectionId,
}: {
  tabId: string;
  sectionId: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<SerializedContentTab | null>(null);
  const [section, setSection] = useState<SerializedContentSection | null>(null);
  const [title, setTitle] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SerializedContentItem | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await fetchContentTab(tabId);
      const found = next.sections.find((row) => row.id === sectionId) ?? null;
      setTab(next);
      setSection(found);
      setTitle(found?.title ?? "");
      setIsActive(found?.isActive ?? true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load section");
      setTab(null);
      setSection(null);
    } finally {
      setLoading(false);
    }
  }, [sectionId, tabId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSaveSection = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(
        `/api/admin/product-content-tabs/${tabId}/sections/${sectionId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, isActive }),
        },
      );
      const next = await parseAdminJson<SerializedContentTab>(res);
      const found = next.sections.find((row) => row.id === sectionId) ?? null;
      setTab(next);
      setSection(found);
      setSuccess("Section saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save section");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/product-content-tabs/${tabId}/sections/${sectionId}/items/${deleteTarget.id}`,
        { method: "DELETE" },
      );
      const next = await parseAdminJson<SerializedContentTab>(res);
      const found = next.sections.find((row) => row.id === sectionId) ?? null;
      setTab(next);
      setSection(found);
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete item");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <AgenticLoader label="Loading section" />
      </div>
    );
  }

  if (!tab || !section) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Section not found</AlertTitle>
        <AlertDescription>
          {error || "This section no longer exists."}
        </AlertDescription>
      </Alert>
    );
  }

  const itemHref = (itemId: string) =>
    `/admin/products/content-tabs/${tabId}/sections/${sectionId}/items/${itemId}`;
  const newItemHref = `/admin/products/content-tabs/${tabId}/sections/${sectionId}/items/new`;

  return (
    <div className="space-y-6">
      <ContentTabsChrome
        step={3}
        title={section.title}
        description="Each item is a card on the product page and has its own article."
        crumbs={[
          { href: "/admin/products/content-tabs", label: "Tabs" },
          { href: `/admin/products/content-tabs/${tabId}`, label: tab.name },
          { label: section.title },
        ]}
        actions={
          <>
            <Button
              nativeButton={false}
              variant="outline"
              render={<Link href={`/admin/products/content-tabs/${tabId}`} />}
            >
              Back to sections
            </Button>
            <Button
              nativeButton={false}
              className="gap-1.5"
              render={<Link href={newItemHref} />}
            >
              <PlusIcon className="size-4" />
              Add item
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
          <CardTitle>Section details</CardTitle>
          <CardDescription>
            This heading appears above the item cards on the product page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-[1fr_auto]" onSubmit={(e) => void handleSaveSection(e)}>
            <div className="space-y-2">
              <Label htmlFor="section-title">Section name</Label>
              <Input
                id="section-title"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 self-end pb-2 text-sm">
              <Checkbox
                checked={isActive}
                onCheckedChange={(value) => setIsActive(value === true)}
              />
              Active
            </label>
            <div>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save section"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
          <CardDescription>
            {section.items.length} item
            {section.items.length === 1 ? "" : "s"}. Open one to edit its
            image and article.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {section.items.length === 0 ? (
            <div className="rounded-[3px] border border-dashed border-border px-4 py-10 text-center">
              <FileTextIcon className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">No items yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add an item such as 230 GSM Cardstock. Customers will see its
                name and image, then open the article.
              </p>
              <Button
                nativeButton={false}
                className="mt-4 gap-1.5"
                render={<Link href={newItemHref} />}
              >
                <PlusIcon className="size-4" />
                Add first item
              </Button>
            </div>
          ) : (
            <div className="grid gap-3">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="group flex cursor-pointer items-center justify-between gap-3 rounded-[3px] border border-border p-3 transition-colors hover:border-primary/40 hover:bg-muted/30"
                  onClick={() => router.push(itemHref(item.id))}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      router.push(itemHref(item.id));
                    }
                  }}
                  role="link"
                  tabIndex={0}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="size-14 shrink-0 overflow-hidden rounded-[3px] border border-border bg-muted">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-muted-foreground">
                          <FileTextIcon className="size-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        <Badge variant={item.isActive ? "default" : "secondary"}>
                          {item.isActive ? "Active" : "Hidden"}
                        </Badge>
                      </div>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        /info/{item.slug || "…"}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Delete ${item.title}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setDeleteTarget(item);
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

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        itemLabel={deleteTarget?.title}
        description={
          deleteTarget
            ? `Delete “${deleteTarget.title}” and its article page?`
            : undefined
        }
        loading={deleting}
        onConfirm={() => void handleDeleteItem()}
      />
    </div>
  );
}
