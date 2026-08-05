"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ExternalLinkIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
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

type Row = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  updatedAt?: string;
};

export function AdminGroupByManager() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/group-by");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load groups");
      }
      setItems(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load groups");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/group-by/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete");
      }
      setDeleteTarget(null);
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Group By</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create full landing pages (elite layout) like Home CMS. Public URL:{" "}
            <code className="rounded bg-muted px-1">/{`{slug}`}</code>
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/admin/group-by/new" />}
          className="gap-1.5"
        >
          <PlusIcon className="size-4" />
          Create group
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
          <CardTitle>All groups</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
              <AgenticLoader size="sm" label="Loading" />
              Loading…
            </div>
          ) : items.length === 0 ? (
            <p className="py-8 text-sm text-muted-foreground">
              No groups yet. Create one and fill every page section.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <code className="text-xs">/{item.slug}</code>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.isActive ? "secondary" : "outline"}>
                        {item.isActive ? "Active" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          nativeButton={false}
                          render={
                            <Link href={`/${item.slug}`} target="_blank" />
                          }
                          size="icon-sm"
                          variant="ghost"
                        >
                          <ExternalLinkIcon className="size-3.5" />
                        </Button>
                        <Button
                          nativeButton={false}
                          render={
                            <Link href={`/admin/group-by/${item.id}/edit`} />
                          }
                          size="icon-sm"
                          variant="ghost"
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
        title="Delete group?"
        description={
          deleteTarget
            ? `Delete “${deleteTarget.name}”? The public /${deleteTarget.slug} page will stop working.`
            : ""
        }
        loading={deleting}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
