"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Trash2Icon } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SerializedQuote } from "@/lib/quotes/serialize";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

const STATUS_OPTIONS = [
  { value: "draft", label: "In progress" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted" },
  { value: "closed", label: "Closed" },
] as const;

type QuoteStatus = (typeof STATUS_OPTIONS)[number]["value"];

function statusLabel(status: string) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.label ?? status;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function formatDims(quote: SerializedQuote) {
  const d = quote.dimensions;
  if (!d || (d.length == null && d.width == null && d.height == null)) {
    return "—";
  }
  const unit = d.unit || "in";
  return `${d.width ?? "—"} × ${d.height ?? "—"} × ${d.length ?? "—"} ${unit}`;
}

function fullName(quote: SerializedQuote) {
  return `${quote.firstName} ${quote.lastName}`.trim() || "—";
}

export function AdminQuotesManager() {
  const [quotes, setQuotes] = useState<SerializedQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "submitted" | "draft">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SerializedQuote | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadQuotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/quotes");
      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        data?: SerializedQuote[];
      };
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load quotes");
      }
      setQuotes(data.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quotes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadQuotes();
  }, [loadQuotes]);

  const visible = useMemo(() => {
    if (filter === "draft") return quotes.filter((q) => q.status === "draft");
    if (filter === "submitted") return quotes.filter((q) => q.status !== "draft");
    return quotes;
  }, [filter, quotes]);

  const selected = quotes.find((q) => q.id === selectedId) ?? null;

  const updateStatus = async (id: string, status: QuoteStatus) => {
    setError(null);
    try {
      const res = await fetch(`/api/admin/quotes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        data?: SerializedQuote;
      };
      if (!res.ok || !data.success || !data.data) {
        throw new Error(data.error || "Failed to update status");
      }
      setQuotes((prev) =>
        prev.map((quote) => (quote.id === id ? data.data! : quote)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/quotes/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete quote");
      }
      setQuotes((prev) => prev.filter((quote) => quote.id !== deleteTarget.id));
      if (selectedId === deleteTarget.id) setSelectedId(null);
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete quote");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle className="text-xl sm:text-2xl">Quotes</CardTitle>
            <CardDescription>
              Homepage stepper submissions — drafts and completed requests.
            </CardDescription>
          </div>
          <Select
            value={filter}
            onValueChange={(value) =>
              setFilter(value as "all" | "submitted" | "draft")
            }
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All quotes</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="draft">In progress</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Couldn’t load quotes</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {loading ? (
            <div className="flex justify-center py-12">
              <AgenticLoader />
            </div>
          ) : visible.length === 0 ? (
            <p className="py-8 text-sm text-muted-foreground">
              No quotes yet. New requests from the homepage form will show up here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Step</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((quote) => (
                    <TableRow
                      key={quote.id}
                      className={
                        selectedId === quote.id ? "bg-muted/50" : "cursor-pointer"
                      }
                      onClick={() =>
                        setSelectedId((id) =>
                          id === quote.id ? null : quote.id,
                        )
                      }
                    >
                      <TableCell>
                        <div className="font-medium">{fullName(quote)}</div>
                        <div className="text-xs text-muted-foreground">
                          {quote.email}
                          {quote.phone ? ` · ${quote.phone}` : ""}
                        </div>
                      </TableCell>
                      <TableCell>{quote.productType || "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            quote.status === "draft" ? "secondary" : "default"
                          }
                        >
                          {statusLabel(quote.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {quote.status === "draft"
                          ? `${quote.currentStep}/4`
                          : "Done"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatDate(quote.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          aria-label="Delete quote"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(quote);
                          }}
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selected ? (
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>{fullName(selected)}</CardTitle>
              <CardDescription>
                {selected.email}
                {selected.phone ? ` · ${selected.phone}` : ""}
              </CardDescription>
            </div>
            <Select
              value={selected.status}
              onValueChange={(value) =>
                void updateStatus(selected.id, value as QuoteStatus)
              }
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
            <Detail label="Product" value={selected.productType} />
            <Detail label="Quantity" value={selected.quantity?.toString()} />
            <Detail label="Dimensions" value={formatDims(selected)} />
            <Detail label="Zip" value={selected.zip} />
            <Detail label="Material" value={selected.material} />
            <Detail label="Color" value={selected.color} />
            <Detail label="Printing" value={selected.printing} />
            <Detail label="Coating" value={selected.coating} />
            <Detail label="Thickness" value={selected.thickness} />
            <Detail label="Add-on" value={selected.addOn} />
            <div className="sm:col-span-2">
              <Detail label="Project details" value={selected.notes} />
            </div>
            <Detail label="Updated" value={formatDate(selected.updatedAt)} />
          </CardContent>
        </Card>
      ) : null}

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        itemLabel={deleteTarget ? fullName(deleteTarget) : undefined}
        description={
          deleteTarget
            ? `Delete the quote from ${fullName(deleteTarget)}? This cannot be undone.`
            : undefined
        }
        loading={deleting}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 whitespace-pre-wrap">{value?.trim() || "—"}</p>
    </div>
  );
}
