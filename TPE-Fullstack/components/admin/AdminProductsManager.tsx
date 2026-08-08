"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  LayoutTemplateIcon,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { slugify } from "@/lib/slug";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { ImageUploadField } from "./ImageUploadField";

type GroupOption = { id: string; name: string; slug: string; isActive: boolean };

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  image: string;
  groupByIds: string[];
  isActive: boolean;
  sortOrder: number;
};

const emptyForm = (): Omit<ProductRow, "id"> => ({
  name: "",
  slug: "",
  description: "",
  price: "",
  image: "",
  groupByIds: [],
  isActive: true,
  sortOrder: 0,
});

export function AdminProductsManager() {
  const [items, setItems] = useState<ProductRow[]>([]);
  const [groups, setGroups] = useState<GroupOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [slugTouched, setSlugTouched] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProductRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsRes, groupsRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/group-by"),
      ]);
      const productsJson = await productsRes.json();
      const groupsJson = await groupsRes.json();
      if (!productsRes.ok || !productsJson.success) {
        throw new Error(productsJson.error || "Failed to load products");
      }
      if (groupsRes.ok && groupsJson.success) {
        setGroups(groupsJson.data);
      }
      setItems(productsJson.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
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
    setSlugTouched(false);
  };

  const startEdit = (row: ProductRow) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      slug: row.slug,
      description: row.description,
      price: row.price,
      image: row.image,
      groupByIds: row.groupByIds,
      isActive: row.isActive,
      sortOrder: row.sortOrder,
    });
    setSlugTouched(true);
    setShowForm(true);
  };

  const toggleGroup = (id: string) => {
    setForm((prev) => ({
      ...prev,
      groupByIds: prev.groupByIds.includes(id)
        ? prev.groupByIds.filter((g) => g !== id)
        : [...prev.groupByIds, id],
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.name),
      };
      const res = await fetch(
        editingId ? `/api/admin/products/${editingId}` : "/api/admin/products",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save product");
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete");
      }
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const groupName = (id: string) =>
    groups.find((g) => g.id === id)?.name ?? id;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Link products to Group By pages — they appear in that page&apos;s
            catalog section.
          </p>
        </div>
        <Button
          type="button"
          className="gap-1.5"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <PlusIcon className="size-4" />
          Add product
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {showForm ? (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>{editingId ? "Edit product" : "New product"}</CardTitle>
              <CardDescription>
                Select one or more Group By pages for catalog placement.
              </CardDescription>
            </div>
            <Button type="button" size="icon-sm" variant="ghost" onClick={resetForm}>
              <XIcon className="size-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
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
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input
                    value={form.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setForm((prev) => ({
                        ...prev,
                        slug: slugify(e.target.value),
                      }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price label</Label>
                  <Input
                    value={form.price}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, price: e.target.value }))
                    }
                    placeholder="$0.68"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sort order</Label>
                  <Input
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
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
                <ImageUploadField
                  value={form.image}
                  onChange={(image) => setForm((prev) => ({ ...prev, image }))}
                  folder="products"
                  label="Upload product image"
                />
              </div>
              <div className="space-y-2">
                <Label>Group By</Label>
                {groups.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No groups yet. Create a Group By first.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {groups.map((g) => (
                      <label
                        key={g.id}
                        className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                      >
                        <Checkbox
                          checked={form.groupByIds.includes(g.id)}
                          onCheckedChange={() => toggleGroup(g.id)}
                        />
                        {g.name}
                        <span className="text-xs text-muted-foreground">
                          /{g.slug}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.isActive}
                  onCheckedChange={(v) =>
                    setForm((prev) => ({ ...prev, isActive: v === true }))
                  }
                />
                Active
              </label>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : editingId ? "Update product" : "Create product"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>All products</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
              <AgenticLoader size="sm" label="Loading" />
              Loading…
            </div>
          ) : items.length === 0 ? (
            <p className="py-8 text-sm text-muted-foreground">No products yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Groups</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.price || "—"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.groupByIds.length === 0 ? (
                          <span className="text-xs text-muted-foreground">
                            None
                          </span>
                        ) : (
                          item.groupByIds.map((id) => (
                            <Badge key={id} variant="outline">
                              {groupName(id)}
                            </Badge>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.isActive ? "secondary" : "outline"}>
                        {item.isActive ? "Active" : "Hidden"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/admin/products/${item.id}/edit`}
                          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-input px-3 text-xs font-medium transition hover:bg-accent"
                        >
                          <LayoutTemplateIcon className="size-3.5" />
                          Page content
                        </Link>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => startEdit(item)}
                        >
                          <PencilIcon className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => setDeleteTarget(item)}
                        >
                          <Trash2Icon className="size-3.5 text-destructive" />
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

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete product?"
        description={
          deleteTarget
            ? `Delete “${deleteTarget.name}”? It will disappear from linked group catalogs.`
            : ""
        }
        loading={deleting}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
