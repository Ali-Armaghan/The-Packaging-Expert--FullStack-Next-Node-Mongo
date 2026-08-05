"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CopyIcon,
  ExternalLinkIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { blogCategories } from "@/constants/blog";
import type { SerializedBlogPost } from "@/lib/blog/serialize";
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
import { Input } from "@/components/ui/input";
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
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

type ListResponse = {
  items: SerializedBlogPost[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function AdminBlogManager() {
  const [data, setData] = useState<ListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (q) params.set("q", q);
      if (status !== "all") params.set("status", status);
      if (category !== "all") params.set("category", category);

      const res = await fetch(`/api/admin/blog?${params.toString()}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to load posts");
      }
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [page, limit, q, status, category]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setBusyId(deleteTarget.id);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/blog/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to delete");
      }
      setSuccess("Post deleted.");
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setBusyId(null);
      setDeleting(false);
    }
  };

  const togglePublish = async (post: SerializedBlogPost) => {
    setBusyId(post.id);
    setError(null);
    setSuccess(null);
    try {
      const nextStatus = post.status === "published" ? "draft" : "published";
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          publishedAt:
            nextStatus === "published"
              ? post.publishedAt || new Date().toISOString()
              : post.publishedAt,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update status");
      }
      setSuccess(
        nextStatus === "published" ? "Post published." : "Moved to draft.",
      );
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setBusyId(null);
    }
  };

  const duplicatePost = async (post: SerializedBlogPost) => {
    setBusyId(post.id);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${post.title} (Copy)`,
          slug: `${post.slug}-copy-${Date.now().toString(36)}`,
          excerpt: post.excerpt,
          content: post.content,
          featuredImage: post.featuredImage,
          category: post.category,
          categoryLabel: post.categoryLabel,
          tags: post.tags,
          authorName: post.authorName,
          status: "draft",
          featured: false,
          featuredSidebar: false,
          publishedAt: null,
          seoTitle: post.seoTitle,
          seoDescription: post.seoDescription,
          seoKeywords: post.seoKeywords,
          canonicalUrl: "",
          ogImage: post.ogImage,
          ogTitle: post.ogTitle,
          ogDescription: post.ogDescription,
          twitterTitle: post.twitterTitle,
          twitterDescription: post.twitterDescription,
          twitterImage: post.twitterImage,
          twitterCard: post.twitterCard,
          robotsIndex: post.robotsIndex,
          robotsFollow: post.robotsFollow,
          robotsNoArchive: post.robotsNoArchive,
          focusKeyword: post.focusKeyword,
          secondaryKeywords: post.secondaryKeywords,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to duplicate");
      }
      setSuccess("Draft copy created.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to duplicate");
    } finally {
      setBusyId(null);
    }
  };

  const publishedCount =
    data?.items.filter((p) => p.status === "published").length ?? 0;

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
          <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage articles, SEO, and publishing.
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/admin/blog/new" />}
          className="gap-1.5"
        >
          <PlusIcon className="size-4" />
          Add post
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="py-4">
            <CardDescription>Total posts</CardDescription>
            <CardTitle className="text-2xl">{data?.total ?? "—"}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardDescription>On this page published</CardDescription>
            <CardTitle className="text-2xl">{publishedCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardDescription>Page</CardDescription>
            <CardTitle className="text-2xl">
              {data ? `${data.page}/${data.totalPages}` : "—"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="gap-4 space-y-0">
          <div>
            <CardTitle>All posts</CardTitle>
            <CardDescription>
              Search, filter, publish, duplicate, or edit.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <form
              className="flex flex-1 gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setPage(1);
                setQ(searchInput.trim());
              }}
            >
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search title, tags, author..."
              />
              <Button type="submit" variant="outline">
                Search
              </Button>
            </form>
            <Select
              value={status}
              onValueChange={(value) => {
                if (value == null) return;
                setStatus(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={category}
              onValueChange={(value) => {
                if (value == null) return;
                setCategory(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-44">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {blogCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(limit)}
              onValueChange={(value) => {
                if (value == null) return;
                setLimit(Number(value));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="20">20 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2.5 py-10 text-sm text-muted-foreground">
              <AgenticLoader size="sm" label="Loading posts" />
              Loading posts...
            </div>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10">
              <p className="text-sm text-muted-foreground">
                No posts match your filters. Create a new SEO-ready article.
              </p>
              <Button
                nativeButton={false}
                render={<Link href="/admin/blog/new" />}
                className="gap-1.5"
              >
                <PlusIcon className="size-4" />
                Create first post
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Post</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-md border bg-muted">
                            {post.featuredImage.url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={post.featuredImage.url}
                                alt={post.featuredImage.alt || post.title}
                                className="size-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{post.title}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {post.authorName || "No author"} · /{post.slug}
                            </p>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {post.featured && (
                                <Badge variant="secondary">Featured</Badge>
                              )}
                              {post.featuredSidebar && (
                                <Badge variant="outline">Sidebar</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{post.categoryLabel}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            post.status === "published"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-0.5">
                          {post.status === "published" && (
                            <Button
                              nativeButton={false}
                              render={
                                <Link
                                  href={`/blog/${post.slug}`}
                                  target="_blank"
                                />
                              }
                              variant="ghost"
                              size="icon-sm"
                              aria-label="View live"
                            >
                              <ExternalLinkIcon />
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={busyId === post.id}
                            onClick={() => void togglePublish(post)}
                          >
                            {post.status === "published"
                              ? "Unpublish"
                              : "Publish"}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            disabled={busyId === post.id}
                            onClick={() => void duplicatePost(post)}
                            aria-label="Duplicate"
                          >
                            <CopyIcon />
                          </Button>
                          <Button
                            nativeButton={false}
                            render={
                              <Link href={`/admin/blog/${post.id}/edit`} />
                            }
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Edit"
                          >
                            <PencilIcon />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            disabled={busyId === post.id}
                            onClick={() =>
                              setDeleteTarget({
                                id: post.id,
                                title: post.title,
                              })
                            }
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

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  Showing {(data.page - 1) * data.limit + 1}–
                  {Math.min(data.page * data.limit, data.total)} of {data.total}
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page >= data.totalPages}
                    onClick={() =>
                      setPage((p) => Math.min(data.totalPages, p + 1))
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
        title="Delete blog post?"
        itemLabel={deleteTarget?.title}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
