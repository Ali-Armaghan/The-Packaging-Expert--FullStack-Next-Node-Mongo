"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AgenticLoader } from "@/components/ui/AgenticLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

type GroupOption = { id: string; name: string; slug: string };

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  price: string;
  image: string;
  groupByIds: string[];
  isActive: boolean;
  sortOrder: number;
};

export function AdminProductsManager() {
  const [items, setItems] = useState<ProductRow[]>([]);
  const [groups, setGroups] = useState<GroupOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsRes, groupsRes] = await Promise.all([
        fetch("/api/admin/products?lite=1"),
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
            Add a product and fill every section of the public detail page. All
            content is stored in the database and served from cache.
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/admin/products/new" />}
          className="gap-1.5"
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
            <div className="py-10 text-center">
              <p className="text-sm text-muted-foreground">No products yet.</p>
              <Link
                href="/admin/products/new"
                className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-[3px] bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"
              >
                <PlusIcon className="size-4" />
                Add your first product
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
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
                    <TableCell className="text-muted-foreground">
                      /products/{item.slug}
                    </TableCell>
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
                          className="inline-flex size-8 items-center justify-center rounded-[3px] hover:bg-accent"
                          aria-label={`Edit ${item.name}`}
                        >
                          <PencilIcon className="size-3.5" />
                        </Link>
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
            ? `Delete “${deleteTarget.name}”? It will disappear from linked group catalogs and the public product page.`
            : ""
        }
        loading={deleting}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
