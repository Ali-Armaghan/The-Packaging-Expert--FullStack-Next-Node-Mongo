"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
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
import { slugify } from "@/lib/slug";
import type { SerializedContentTab } from "@/lib/productContentTab/serialize";
import { ImageUploadField } from "./ImageUploadField";
import { RichTextEditor } from "./RichTextEditor";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

type ItemForm = {
  id: string;
  title: string;
  slug: string;
  image: string;
  body: string;
  sortOrder: number;
  isActive: boolean;
  slugTouched: boolean;
};

type SectionForm = {
  id: string;
  title: string;
  sortOrder: number;
  isActive: boolean;
  items: ItemForm[];
};

type TabForm = {
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  sections: SectionForm[];
};

const emptyItem = (sortOrder = 0): ItemForm => ({
  id: "",
  title: "",
  slug: "",
  image: "",
  body: "",
  sortOrder,
  isActive: true,
  slugTouched: false,
});

const emptySection = (sortOrder = 0): SectionForm => ({
  id: "",
  title: "",
  sortOrder,
  isActive: true,
  items: [emptyItem(0)],
});

const emptyTab = (): TabForm => ({
  name: "",
  slug: "",
  sortOrder: 0,
  isActive: true,
  sections: [emptySection(0)],
});

export function AdminProductContentTabsManager() {
  const [tabs, setTabs] = useState<SerializedContentTab[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<TabForm>(emptyTab());
  const [slugTouched, setSlugTouched] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadTabs = useCallback(async () => {
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
      setTabs(data.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tabs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTabs();
  }, [loadTabs]);

  const resetForm = () => {
    setForm(emptyTab());
    setEditingId(null);
    setShowForm(false);
    setSlugTouched(false);
  };

  const startCreate = () => {
    setForm({ ...emptyTab(), sortOrder: tabs.length });
    setEditingId(null);
    setShowForm(true);
    setSlugTouched(false);
    setSuccess(null);
    setError(null);
  };

  const startEdit = (tab: SerializedContentTab) => {
    setEditingId(tab.id);
    setForm({
      name: tab.name,
      slug: tab.slug,
      sortOrder: tab.sortOrder,
      isActive: tab.isActive,
      sections:
        tab.sections.length > 0
          ? tab.sections.map((section) => ({
              id: section.id,
              title: section.title,
              sortOrder: section.sortOrder,
              isActive: section.isActive,
              items:
                section.items.length > 0
                  ? section.items.map((item) => ({
                      id: item.id,
                      title: item.title,
                      slug: item.slug,
                      image: item.image,
                      body: item.body,
                      sortOrder: item.sortOrder,
                      isActive: item.isActive,
                      slugTouched: true,
                    }))
                  : [emptyItem(0)],
            }))
          : [emptySection(0)],
    });
    setShowForm(true);
    setSlugTouched(true);
    setSuccess(null);
    setError(null);
  };

  const updateSection = (index: number, patch: Partial<SectionForm>) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, ...patch } : section,
      ),
    }));
  };

  const updateItem = (
    sectionIndex: number,
    itemIndex: number,
    patch: Partial<ItemForm>,
  ) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              items: section.items.map((item, j) =>
                j === itemIndex ? { ...item, ...patch } : item,
              ),
            }
          : section,
      ),
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.name),
        sections: form.sections
          .filter((section) => section.title.trim())
          .map((section, sectionIndex) => ({
            id: section.id,
            title: section.title,
            sortOrder: sectionIndex,
            isActive: section.isActive,
            items: section.items
              .filter((item) => item.title.trim())
              .map((item, itemIndex) => ({
                id: item.id,
                title: item.title,
                slug: item.slug || slugify(item.title),
                image: item.image,
                body: item.body,
                sortOrder: itemIndex,
                isActive: item.isActive,
              })),
          })),
      };

      const res = await fetch(
        editingId
          ? `/api/admin/product-content-tabs/${editingId}`
          : "/api/admin/product-content-tabs",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save tab");
      }

      setSuccess(editingId ? "Tab updated." : "Tab created.");
      resetForm();
      await loadTabs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save tab");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(
        `/api/admin/product-content-tabs/${deleteTarget.id}`,
        { method: "DELETE" },
      );
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete tab");
      }
      if (editingId === deleteTarget.id) resetForm();
      setDeleteTarget(null);
      await loadTabs();
      setSuccess("Tab deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete tab");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Product information tabs
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Tabs contain sections. Sections contain items. Each item has a
            public article page. Products pick which items to show.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            nativeButton={false}
            variant="outline"
            render={<Link href="/admin/products" />}
          >
            Back to products
          </Button>
          <Button type="button" className="gap-1.5" onClick={startCreate}>
            <PlusIcon className="size-4" />
            Add tab
          </Button>
        </div>
      </div>

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

      {showForm ? (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>{editingId ? "Edit tab" : "New tab"}</CardTitle>
              <CardDescription>
                Add sections, then items under each section. Item copy becomes
                the article page.
              </CardDescription>
            </div>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={resetForm}
              aria-label="Close form"
            >
              <XIcon className="size-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={(e) => void handleSubmit(e)}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tab-name">Tab name</Label>
                  <Input
                    id="tab-name"
                    required
                    value={form.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setForm((prev) => ({
                        ...prev,
                        name,
                        slug: slugTouched ? prev.slug : slugify(name),
                      }));
                    }}
                    placeholder="Materials & Stock"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tab-slug">Slug</Label>
                  <Input
                    id="tab-slug"
                    value={form.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setForm((prev) => ({ ...prev, slug: e.target.value }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tab-order">Sort order</Label>
                  <Input
                    id="tab-order"
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        sortOrder: Number(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <label className="flex items-center gap-2 self-end pb-2 text-sm">
                  <Checkbox
                    checked={form.isActive}
                    onCheckedChange={(v) =>
                      setForm((prev) => ({ ...prev, isActive: v === true }))
                    }
                  />
                  Active
                </label>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold">Sections</h3>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        sections: [
                          ...prev.sections,
                          emptySection(prev.sections.length),
                        ],
                      }))
                    }
                  >
                    <PlusIcon className="size-3.5" />
                    Add section
                  </Button>
                </div>

                {form.sections.map((section, sectionIndex) => (
                  <div
                    key={section.id || `section-${sectionIndex}`}
                    className="space-y-4 rounded-[3px] border border-border p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        Section {sectionIndex + 1}
                      </p>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            sections: prev.sections.filter(
                              (_, i) => i !== sectionIndex,
                            ),
                          }))
                        }
                        aria-label="Remove section"
                      >
                        <Trash2Icon className="size-3.5 text-destructive" />
                      </Button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                      <div className="space-y-2">
                        <Label>Section name</Label>
                        <Input
                          required
                          value={section.title}
                          onChange={(e) =>
                            updateSection(sectionIndex, {
                              title: e.target.value,
                            })
                          }
                          placeholder="Paperboard & Cardstock"
                        />
                      </div>
                      <label className="flex items-center gap-2 self-end pb-2 text-sm">
                        <Checkbox
                          checked={section.isActive}
                          onCheckedChange={(v) =>
                            updateSection(sectionIndex, {
                              isActive: v === true,
                            })
                          }
                        />
                        Active
                      </label>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-sm font-medium">Items</h4>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        onClick={() =>
                          updateSection(sectionIndex, {
                            items: [
                              ...section.items,
                              emptyItem(section.items.length),
                            ],
                          })
                        }
                      >
                        <PlusIcon className="size-3.5" />
                        Add item
                      </Button>
                    </div>

                    {section.items.map((item, itemIndex) => (
                      <div
                        key={item.id || `item-${sectionIndex}-${itemIndex}`}
                        className="space-y-3 rounded-[3px] border border-dashed border-border p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs text-muted-foreground">
                            Item {itemIndex + 1}
                          </p>
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            onClick={() =>
                              updateSection(sectionIndex, {
                                items: section.items.filter(
                                  (_, i) => i !== itemIndex,
                                ),
                              })
                            }
                            aria-label="Remove item"
                          >
                            <Trash2Icon className="size-3.5 text-destructive" />
                          </Button>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Item name</Label>
                            <Input
                              required
                              value={item.title}
                              onChange={(e) => {
                                const title = e.target.value;
                                updateItem(sectionIndex, itemIndex, {
                                  title,
                                  slug: item.slugTouched
                                    ? item.slug
                                    : slugify(title),
                                });
                              }}
                              placeholder="230 GSM Cardstock"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Article slug</Label>
                            <Input
                              value={item.slug}
                              onChange={(e) =>
                                updateItem(sectionIndex, itemIndex, {
                                  slug: e.target.value,
                                  slugTouched: true,
                                })
                              }
                              placeholder="230-gsm-cardstock"
                            />
                          </div>
                        </div>
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={item.isActive}
                            onCheckedChange={(v) =>
                              updateItem(sectionIndex, itemIndex, {
                                isActive: v === true,
                              })
                            }
                          />
                          Active
                        </label>
                        <div className="space-y-2">
                          <Label>Image</Label>
                          <ImageUploadField
                            value={item.image}
                            folder="product-info"
                            onChange={(image) =>
                              updateItem(sectionIndex, itemIndex, { image })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Article</Label>
                          <RichTextEditor
                            value={item.body}
                            onChange={(body) =>
                              updateItem(sectionIndex, itemIndex, { body })
                            }
                            placeholder="Write the item article…"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : editingId ? "Update tab" : "Create tab"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Library</CardTitle>
          <CardDescription>
            {tabs.length} tab{tabs.length === 1 ? "" : "s"} · products select
            items from these sections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <AgenticLoader label="Loading tabs" />
            </div>
          ) : tabs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tabs yet. Add Materials & Stock or any custom tab.
            </p>
          ) : (
            <div className="space-y-3">
              {tabs.map((tab) => {
                const itemCount = tab.sections.reduce(
                  (sum, section) => sum + section.items.length,
                  0,
                );
                return (
                  <div
                    key={tab.id}
                    className="rounded-[3px] border border-border p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{tab.name}</h3>
                          <Badge
                            variant={tab.isActive ? "default" : "secondary"}
                          >
                            {tab.isActive ? "Active" : "Hidden"}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {tab.sections.length} section
                          {tab.sections.length === 1 ? "" : "s"} · {itemCount}{" "}
                          item{itemCount === 1 ? "" : "s"}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => startEdit(tab)}
                          aria-label={`Edit ${tab.name}`}
                        >
                          <PencilIcon className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          onClick={() =>
                            setDeleteTarget({ id: tab.id, name: tab.name })
                          }
                          aria-label={`Delete ${tab.name}`}
                        >
                          <Trash2Icon className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    {tab.sections.length > 0 ? (
                      <ul className="mt-3 space-y-2 text-sm">
                        {tab.sections.map((section) => (
                          <li key={section.id}>
                            <span className="font-medium">{section.title}</span>
                            <span className="text-muted-foreground">
                              {" "}
                              —{" "}
                              {section.items.map((item) => item.title).join(", ") ||
                                "no items"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

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
