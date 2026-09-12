"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileDownIcon, Trash2Icon, XIcon } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  displayValue,
  formatQuoteDate,
  formatQuoteDims,
  quoteFullName,
  quoteOptionLabel,
  quoteRef,
  quoteStatusLabel,
  QUOTE_STATUS_OPTIONS,
  type QuoteStatus,
} from "@/lib/quotes/format";
import { downloadQuotePdf, downloadQuotesListPdf } from "@/lib/quotes/pdf";
import type { SerializedQuote } from "@/lib/quotes/serialize";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

export function AdminQuotesManager() {
  const [quotes, setQuotes] = useState<SerializedQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "submitted" | "draft">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SerializedQuote | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [pdfBusy, setPdfBusy] = useState<string | null>(null);

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

  const downloadOne = async (quote: SerializedQuote) => {
    setPdfBusy(quote.id);
    setError(null);
    try {
      await downloadQuotePdf(quote);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download PDF");
    } finally {
      setPdfBusy(null);
    }
  };

  const downloadList = async () => {
    setPdfBusy("list");
    setError(null);
    try {
      await downloadQuotesListPdf(visible);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download PDF");
    } finally {
      setPdfBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle className="text-xl sm:text-2xl">Quotes</CardTitle>
            <CardDescription>
              Click a row to view the full request. Download one quote or the
              whole list as PDF.
            </CardDescription>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
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
            <Button
              type="button"
              variant="outline"
              disabled={loading || visible.length === 0 || pdfBusy === "list"}
              onClick={() => void downloadList()}
            >
              <FileDownIcon />
              {pdfBusy === "list" ? "Preparing…" : "Download list PDF"}
            </Button>
          </div>
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
                    <TableHead className="w-[5.5rem] text-right">PDF</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((quote) => (
                    <TableRow
                      key={quote.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedId(quote.id)}
                    >
                      <TableCell>
                        <div className="font-medium">{quoteFullName(quote)}</div>
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
                          {quoteStatusLabel(quote.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {quote.status === "draft"
                          ? `${quote.currentStep}/4`
                          : "Done"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatQuoteDate(quote.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          aria-label="Download quote PDF"
                          disabled={pdfBusy === quote.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            void downloadOne(quote);
                          }}
                        >
                          <FileDownIcon className="size-4" />
                        </Button>
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

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      >
        <DialogContent className="relative max-h-[90vh] max-w-2xl gap-0 overflow-hidden p-0">
          {selected ? (
            <>
              <DialogHeader className="border-b border-border/60 px-5 py-4 pr-12">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <DialogTitle className="truncate text-lg">
                      {quoteFullName(selected)}
                    </DialogTitle>
                    <DialogDescription className="mt-1">
                      {quoteRef(selected)}
                      {selected.email ? ` · ${selected.email}` : ""}
                      {selected.phone ? ` · ${selected.phone}` : ""}
                    </DialogDescription>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3"
                    aria-label="Close"
                    onClick={() => setSelectedId(null)}
                  >
                    <XIcon />
                  </Button>
                </div>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
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
                      {QUOTE_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={() => void downloadOne(selected)}
                    disabled={pdfBusy === selected.id}
                  >
                    <FileDownIcon />
                    {pdfBusy === selected.id ? "Preparing…" : "Download PDF"}
                  </Button>
                </div>
              </DialogHeader>

              <div className="grid max-h-[min(70vh,32rem)] gap-0 overflow-y-auto sm:grid-cols-2">
                <section className="border-border/60 p-4 sm:border-r">
                  <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Customer
                  </h3>
                  <dl className="grid grid-cols-[6.5rem_1fr] gap-x-3 gap-y-1.5 text-sm">
                    <Detail label="Name" value={quoteFullName(selected)} />
                    <Detail label="Email" value={selected.email} />
                    <Detail label="Phone" value={selected.phone} />
                    <Detail label="Company" value={selected.company} />
                    <Detail
                      label="Step"
                      value={
                        selected.status === "draft"
                          ? `${selected.currentStep}/4`
                          : "Complete"
                      }
                    />
                    <Detail
                      label="Received"
                      value={formatQuoteDate(selected.createdAt)}
                    />
                  </dl>
                </section>
                <section className="border-t border-border/60 p-4 sm:border-t-0">
                  <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Specifications
                  </h3>
                  <dl className="grid grid-cols-[6.5rem_1fr] gap-x-3 gap-y-1.5 text-sm">
                    <Detail label="Product" value={selected.productType} />
                    <Detail
                      label="Quantity"
                      value={selected.quantity?.toString()}
                    />
                    <Detail label="Size" value={formatQuoteDims(selected)} />
                    <Detail label="Zip" value={selected.zip} />
                    <Detail
                      label="Material"
                      value={quoteOptionLabel("material", selected.material)}
                    />
                    <Detail
                      label="Color"
                      value={quoteOptionLabel("color", selected.color)}
                    />
                    <Detail
                      label="Printing"
                      value={quoteOptionLabel("printing", selected.printing)}
                    />
                    <Detail
                      label="Coating"
                      value={quoteOptionLabel("coating", selected.coating)}
                    />
                    <Detail
                      label="Thickness"
                      value={quoteOptionLabel("thickness", selected.thickness)}
                    />
                    <Detail
                      label="Add-on"
                      value={quoteOptionLabel("addOn", selected.addOn)}
                    />
                  </dl>
                </section>
                <section className="border-t border-border/60 p-4 sm:col-span-2">
                  <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Project details
                  </h3>
                  <p className="whitespace-pre-wrap text-sm">
                    {displayValue(selected.notes)}
                  </p>
                </section>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        itemLabel={deleteTarget ? quoteFullName(deleteTarget) : undefined}
        description={
          deleteTarget
            ? `Delete the quote from ${quoteFullName(deleteTarget)}? This cannot be undone.`
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
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words">{displayValue(value)}</dd>
    </>
  );
}
