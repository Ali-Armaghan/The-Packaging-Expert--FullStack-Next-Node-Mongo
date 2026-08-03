"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ExternalLinkIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import type { SerializedNavMenuItem } from "@/lib/nav/serialize";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ChildForm = {
  label: string;
  href: string;
  sortOrder: number;
  isActive: boolean;
};

type FormState = {
  label: string;
  href: string;
  sortOrder: number;
  isActive: boolean;
  children: ChildForm[];
};

const emptyForm = (): FormState => ({
  label: "",
  href: "",
  sortOrder: 0,
  isActive: true,
  children: [],
});

export function AdminBlogMenuManager() {
  const [items, setItems] = useState<SerializedNavMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/blog-menu?location=blog-header");
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to load menu");
      }
      setItems(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load menu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
    setShowForm(false);
  };

  const startCreate = () => {
    setForm({
      ...emptyForm(),
      sortOrder: items.length,
    });
    setEditingId(null);
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  const startEdit = (item: SerializedNavMenuItem) => {
    setEditingId(item.id);
    setForm({
      label: item.label,
      href: item.href,
      sortOrder: item.sortOrder,
      isActive: item.isActive,
      children: item.children.map((child) => ({
        label: child.label,
        href: child.href,
        sortOrder: child.sortOrder,
        isActive: child.isActive,
      })),
    });
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        location: "blog-header",
        label: form.label.trim(),
        href: form.href.trim(),
        sortOrder: form.sortOrder,
        isActive: form.isActive,
        children: form.children
          .filter((c) => c.label.trim() && c.href.trim())
          .map((child, index) => ({
            label: child.label.trim(),
            href: child.href.trim(),
            sortOrder: index,
            isActive: child.isActive,
          })),
      };

      const res = await fetch(
        editingId
          ? `/api/admin/blog-menu/${editingId}`
          : "/api/admin/blog-menu",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save menu item");
      }

      setSuccess(editingId ? "Menu item updated." : "Menu item created.");
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this menu item and its dropdown links?")) {
      return;
    }
    setBusyId(id);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/blog-menu/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to delete");
      }
      setSuccess("Menu item deleted.");
      if (editingId === id) resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setBusyId(null);
    }
  };

  const moveItem = async (id: string, direction: "up" | "down") => {
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return;
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= items.length) return;

    const next = [...items];
    const temp = next[index]!;
    next[index] = next[swapWith]!;
    next[swapWith] = temp;
    setItems(next);
    setBusyId(id);

    try {
      const res = await fetch("/api/admin/blog-menu", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: next.map((item) => item.id) }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to reorder");
      }
      setItems(json.data);
      setSuccess("Menu order updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reorder");
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const toggleActive = async (item: SerializedNavMenuItem) => {
    setBusyId(item.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/blog-menu/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setBusyId(null);
    }
  };

  const addChild = () => {
    setForm((prev) => ({
      ...prev,
      children: [
        ...prev.children,
        {
          label: "",
          href: "",
          sortOrder: prev.children.length,
          isActive: true,
        },
      ],
    }));
  };

  const updateChild = (index: number, patch: Partial<ChildForm>) => {
    setForm((prev) => ({
      ...prev,
      children: prev.children.map((child, i) =>
        i === index ? { ...child, ...patch } : child,
      ),
    }));
  };

  const removeChild = (index: number) => {
    setForm((prev) => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Blog menu</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage blog header links and dropdowns shown on{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">/blog</code>.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            nativeButton={false}
            render={<Link href="/blog" target="_blank" />}
            variant="outline"
            className="gap-1.5"
          >
            <ExternalLinkIcon className="size-4" />
            Preview blog
          </Button>
          <Button type="button" onClick={startCreate} className="gap-1.5">
            <PlusIcon className="size-4" />
            Add menu item
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle>
                {editingId ? "Edit menu item" : "New menu item"}
              </CardTitle>
              <CardDescription>
                Top-level link. Add children for a hover dropdown.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={resetForm}
              aria-label="Close form"
            >
              <XIcon />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="menu-label">Label</Label>
                  <Input
                    id="menu-label"
                    required
                    value={form.label}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, label: e.target.value }))
                    }
                    placeholder="Packaging Tips"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="menu-href">Link URL</Label>
                  <Input
                    id="menu-href"
                    required
                    value={form.href}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, href: e.target.value }))
                    }
                    placeholder="/blog/packaging-tips"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="menu-sort">Sort order</Label>
                  <Input
                    id="menu-sort"
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
                  Visible on frontend
                </label>
              </div>

              <div className="space-y-3 rounded-lg border border-border p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">Dropdown children</p>
                    <p className="text-xs text-muted-foreground">
                      Optional. Leave empty for a simple top-level link.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addChild}
                    className="gap-1"
                  >
                    <PlusIcon className="size-3.5" />
                    Add link
                  </Button>
                </div>

                {form.children.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No dropdown links yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {form.children.map((child, index) => (
                      <div
                        key={index}
                        className="grid gap-2 rounded-md border border-dashed border-border p-3 sm:grid-cols-[1fr_1fr_auto_auto]"
                      >
                        <Input
                          value={child.label}
                          onChange={(e) =>
                            updateChild(index, { label: e.target.value })
                          }
                          placeholder="Child label"
                          required
                        />
                        <Input
                          value={child.href}
                          onChange={(e) =>
                            updateChild(index, { href: e.target.value })
                          }
                          placeholder="/blog?category=tips"
                          required
                        />
                        <label className="flex items-center gap-2 text-xs">
                          <Checkbox
                            checked={child.isActive}
                            onCheckedChange={(v) =>
                              updateChild(index, { isActive: v === true })
                            }
                          />
                          Active
                        </label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeChild(index)}
                          aria-label="Remove child"
                        >
                          <Trash2Icon />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <AgenticLoader size="sm" label="Saving" />
                      Saving...
                    </>
                  ) : editingId ? (
                    "Update item"
                  ) : (
                    "Create item"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Header navigation</CardTitle>
          <CardDescription>
            Order matches left-to-right on the blog header. Inactive items stay
            hidden on the site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2.5 py-10 text-sm text-muted-foreground">
              <AgenticLoader size="sm" label="Loading menu" />
              Loading menu...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-sm text-muted-foreground">
              No menu items yet. Add your first top-level link.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Order</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Dropdown</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex gap-0.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          disabled={index === 0 || busyId === item.id}
                          onClick={() => void moveItem(item.id, "up")}
                          aria-label="Move up"
                        >
                          <ArrowUpIcon />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          disabled={
                            index === items.length - 1 || busyId === item.id
                          }
                          onClick={() => void moveItem(item.id, "down")}
                          aria-label="Move down"
                        >
                          <ArrowDownIcon />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{item.label}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.href}
                      </p>
                    </TableCell>
                    <TableCell>
                      {item.children.length ? (
                        <div className="flex flex-wrap gap-1">
                          {item.children.map((child) => (
                            <Badge
                              key={child.id}
                              variant={child.isActive ? "secondary" : "outline"}
                            >
                              {child.label}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          None
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={item.isActive ? "secondary" : "outline"}
                      >
                        {item.isActive ? "Visible" : "Hidden"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={busyId === item.id}
                          onClick={() => void toggleActive(item)}
                        >
                          {item.isActive ? "Hide" : "Show"}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          disabled={busyId === item.id}
                          onClick={() => void handleDelete(item.id)}
                          aria-label="Delete"
                        >
                          <Trash2Icon />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
