"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, CheckIcon, ExternalLinkIcon, XIcon } from "lucide-react";
import { blogCategories } from "@/constants/blog";
import { buildSeoChecks, estimateReadingMinutes } from "@/lib/blog/seoScore";
import { slugify } from "@/lib/slug";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { BlogRichTextEditor } from "./BlogRichTextEditor";
import { ImageUploadField } from "./ImageUploadField";

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: { url: string; alt: string };
  category: (typeof blogCategories)[number]["id"];
  categoryLabel: string;
  tags: string[];
  authorName: string;
  status: "draft" | "published";
  featured: boolean;
  featuredSidebar: boolean;
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  canonicalUrl: string;
  ogImage: string;
  ogTitle: string;
  ogDescription: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  focusKeyword: string;
};

function emptyForm(): FormState {
  return {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: { url: "", alt: "" },
    category: "marketing",
    categoryLabel: "Marketing",
    tags: [],
    authorName: "",
    status: "draft",
    featured: false,
    featuredSidebar: false,
    publishedAt: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: [],
    canonicalUrl: "",
    ogImage: "",
    ogTitle: "",
    ogDescription: "",
    robotsIndex: true,
    robotsFollow: true,
    focusKeyword: "",
  };
}

function fromPost(post: SerializedBlogPost): FormState {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    featuredImage: post.featuredImage,
    category: post.category,
    categoryLabel: post.categoryLabel,
    tags: post.tags,
    authorName: post.authorName,
    status: post.status,
    featured: post.featured,
    featuredSidebar: post.featuredSidebar,
    publishedAt: post.publishedAt
      ? post.publishedAt.slice(0, 16)
      : "",
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    seoKeywords: post.seoKeywords,
    canonicalUrl: post.canonicalUrl,
    ogImage: post.ogImage,
    ogTitle: post.ogTitle,
    ogDescription: post.ogDescription,
    robotsIndex: post.robotsIndex,
    robotsFollow: post.robotsFollow,
    focusKeyword: post.focusKeyword,
  };
}

type AdminBlogEditorProps = {
  postId?: string;
};

export function AdminBlogEditor({ postId }: AdminBlogEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm());
  const [loading, setLoading] = useState(Boolean(postId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(Boolean(postId));
  const [tagInput, setTagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  useEffect(() => {
    if (!postId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/blog/${postId}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to load post");
        }
        if (!cancelled) {
          setForm(fromPost(data.data));
          setSlugTouched(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load post");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  const seoTitleLen = (form.seoTitle || form.title).length;
  const seoDescLen = (form.seoDescription || form.excerpt).length;

  const seo = useMemo(
    () =>
      buildSeoChecks({
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        featuredImageAlt: form.featuredImage.alt,
        featuredImageUrl: form.featuredImage.url,
        seoTitle: form.seoTitle,
        seoDescription: form.seoDescription,
        focusKeyword: form.focusKeyword,
      }),
    [form],
  );

  const readingMins = estimateReadingMinutes(form.content);

  const addChip = (
    value: string,
    key: "tags" | "seoKeywords",
    clear: () => void,
  ) => {
    const next = value.trim();
    if (!next) return;
    setForm((prev) => {
      if (prev[key].includes(next)) return prev;
      return { ...prev, [key]: [...prev[key], next] };
    });
    clear();
  };

  const handleSubmit = async (
    event: FormEvent,
    statusOverride?: "draft" | "published",
  ) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (form.featuredImage.url && !form.featuredImage.alt.trim()) {
        throw new Error("Featured image alt text is required for SEO.");
      }

      const status = statusOverride ?? form.status;
      const payload = {
        ...form,
        status,
        slug: form.slug || slugify(form.title),
        publishedAt: form.publishedAt
          ? new Date(form.publishedAt).toISOString()
          : status === "published"
            ? new Date().toISOString()
            : null,
        ogImage: form.ogImage || form.featuredImage.url,
        ogTitle: form.ogTitle || form.seoTitle || form.title,
        ogDescription:
          form.ogDescription || form.seoDescription || form.excerpt,
      };

      const res = await fetch(
        postId ? `/api/admin/blog/${postId}` : "/api/admin/blog",
        {
          method: postId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save post");
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-16 text-sm text-muted-foreground">
        <AgenticLoader size="sm" label="Loading post" />
        Loading post...
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="space-y-6"
    >
      <div className="sticky top-0 z-20 -mx-1 flex flex-wrap items-center justify-between gap-3 border-b border-border/80 bg-background/95 px-1 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="space-y-1">
          <Button
            nativeButton={false}
            render={<Link href="/admin/blog" />}
            variant="ghost"
            size="sm"
            className="-ml-2 gap-1.5"
          >
            <ArrowLeftIcon className="size-3.5" />
            All posts
          </Button>
          <h1 className="text-xl font-semibold tracking-tight">
            {postId ? "Edit post" : "Create post"}
          </h1>
          <p className="text-sm text-muted-foreground">
            SEO score {seo.score}% · ~{readingMins} min read
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.status === "published" && form.slug ? (
            <Button
              nativeButton={false}
              render={<Link href={`/blog/${form.slug}`} target="_blank" />}
              variant="outline"
              className="gap-1.5"
            >
              <ExternalLinkIcon className="size-3.5" />
              View live
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={(e) => void handleSubmit(e, "draft")}
          >
            Save draft
          </Button>
          <Button
            type="button"
            disabled={saving}
            onClick={(e) => void handleSubmit(e, "published")}
          >
            {saving ? (
              <>
                <AgenticLoader size="sm" label="Saving" />
                Saving...
              </>
            ) : (
              "Publish"
            )}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>Core article fields and body.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  required
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      title,
                      slug: slugTouched ? prev.slug : slugify(title),
                    }));
                  }}
                  placeholder="How to design sustainable packaging"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
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
                <Label htmlFor="excerpt">Excerpt / short description</Label>
                <textarea
                  id="excerpt"
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, excerpt: e.target.value }))
                  }
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  placeholder="Shown on cards and used as default meta description."
                />
              </div>
              <div className="space-y-2">
                <Label>Body (HTML rich text)</Label>
                <BlogRichTextEditor
                  value={form.content}
                  onChange={(content) =>
                    setForm((prev) => ({ ...prev, content }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured image</CardTitle>
              <CardDescription>
                Upload to S3 and set alt text for accessibility/SEO.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-[200px_1fr]">
              <ImageUploadField
                value={form.featuredImage.url}
                onChange={(url) =>
                  setForm((prev) => ({
                    ...prev,
                    featuredImage: { ...prev.featuredImage, url },
                  }))
                }
                folder="blog/featured"
                label="Upload cover"
              />
              <div className="space-y-2">
                <Label htmlFor="featured-alt">Image alt text</Label>
                <Input
                  id="featured-alt"
                  value={form.featuredImage.alt}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      featuredImage: {
                        ...prev.featuredImage,
                        alt: e.target.value,
                      },
                    }))
                  }
                  placeholder="Describe the cover image"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle>SEO checklist</CardTitle>
                <Badge
                  variant={seo.score >= 80 ? "secondary" : "outline"}
                  className={cn(
                    seo.score >= 80 && "bg-emerald-100 text-emerald-800",
                    seo.score < 50 && "border-amber-300 text-amber-800",
                  )}
                >
                  {seo.score}/100
                </Badge>
              </div>
              <CardDescription>
                Live checks before you publish.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    seo.score >= 80
                      ? "bg-emerald-500"
                      : seo.score >= 50
                        ? "bg-amber-500"
                        : "bg-rose-500",
                  )}
                  style={{ width: `${seo.score}%` }}
                />
              </div>
              <ul className="max-h-56 space-y-1.5 overflow-y-auto text-sm">
                {seo.checks.map((check) => (
                  <li
                    key={check.id}
                    className="flex items-start gap-2 text-muted-foreground"
                  >
                    {check.ok ? (
                      <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                    ) : (
                      <XIcon className="mt-0.5 size-3.5 shrink-0 text-rose-500" />
                    )}
                    <span className={cn(check.ok && "text-foreground")}>
                      {check.label}
                      {check.hint ? (
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({check.hint})
                        </span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => {
                    if (value == null) return;
                    setForm((prev) => ({
                      ...prev,
                      status: value as "draft" | "published",
                    }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="publishedAt">Publish date</Label>
                <Input
                  id="publishedAt"
                  type="datetime-local"
                  value={form.publishedAt}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      publishedAt: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) => {
                    if (value == null) return;
                    const cat = blogCategories.find((c) => c.id === value);
                    setForm((prev) => ({
                      ...prev,
                      category: value as FormState["category"],
                      categoryLabel: cat?.label ?? prev.categoryLabel,
                    }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {blogCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryLabel">Category label (display)</Label>
                <Input
                  id="categoryLabel"
                  value={form.categoryLabel}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      categoryLabel: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author name</Label>
                <Input
                  id="author"
                  value={form.authorName}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      authorName: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-1.5">
                  {form.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            tags: prev.tags.filter((t) => t !== tag),
                          }))
                        }
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addChip(tagInput, "tags", () => setTagInput(""));
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      addChip(tagInput, "tags", () => setTagInput(""))
                    }
                  >
                    Add
                  </Button>
                </div>
              </div>
              <Separator />
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.featured}
                  onCheckedChange={(v) =>
                    setForm((prev) => ({ ...prev, featured: v === true }))
                  }
                />
                Featured hero
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.featuredSidebar}
                  onCheckedChange={(v) =>
                    setForm((prev) => ({
                      ...prev,
                      featuredSidebar: v === true,
                    }))
                  }
                />
                Featured sidebar
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
              <CardDescription>
                Tools for search & social previews.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="truncate text-sm text-primary">
                  {(form.seoTitle || form.title || "Page title").slice(0, 60)}
                </p>
                <p className="truncate text-xs text-emerald-700">
                  packagingexpert.com/blog/{form.slug || "slug"}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {form.seoDescription ||
                    form.excerpt ||
                    "Meta description preview"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <Label htmlFor="seoTitle">SEO title</Label>
                  <span
                    className={
                      seoTitleLen > 60
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }
                  >
                    {seoTitleLen}/60
                  </span>
                </div>
                <Input
                  id="seoTitle"
                  value={form.seoTitle}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, seoTitle: e.target.value }))
                  }
                  placeholder="Defaults to post title"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <Label htmlFor="seoDescription">SEO description</Label>
                  <span
                    className={
                      seoDescLen > 160
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }
                  >
                    {seoDescLen}/160
                  </span>
                </div>
                <textarea
                  id="seoDescription"
                  rows={3}
                  value={form.seoDescription}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      seoDescription: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  placeholder="Defaults to excerpt"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="focusKeyword">Focus keyword</Label>
                <Input
                  id="focusKeyword"
                  value={form.focusKeyword}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      focusKeyword: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>SEO keywords</Label>
                <div className="flex flex-wrap gap-1.5">
                  {form.seoKeywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="outline"
                      className="gap-1 pr-1"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            seoKeywords: prev.seoKeywords.filter(
                              (k) => k !== keyword,
                            ),
                          }))
                        }
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addChip(keywordInput, "seoKeywords", () =>
                          setKeywordInput(""),
                        );
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      addChip(keywordInput, "seoKeywords", () =>
                        setKeywordInput(""),
                      )
                    }
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="canonical">Canonical URL</Label>
                <Input
                  id="canonical"
                  value={form.canonicalUrl}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      canonicalUrl: e.target.value,
                    }))
                  }
                  placeholder="https://..."
                />
              </div>

              <Separator />
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Open Graph
              </p>
              <div className="space-y-2">
                <Label htmlFor="ogTitle">OG title</Label>
                <Input
                  id="ogTitle"
                  value={form.ogTitle}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, ogTitle: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ogDescription">OG description</Label>
                <textarea
                  id="ogDescription"
                  rows={2}
                  value={form.ogDescription}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      ogDescription: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
              <div className="space-y-2">
                <Label>OG image</Label>
                <ImageUploadField
                  value={form.ogImage}
                  onChange={(ogImage) =>
                    setForm((prev) => ({ ...prev, ogImage }))
                  }
                  folder="blog/og"
                  label="Upload OG image"
                />
              </div>

              <Separator />
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.robotsIndex}
                  onCheckedChange={(v) =>
                    setForm((prev) => ({ ...prev, robotsIndex: v === true }))
                  }
                />
                Allow search indexing
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.robotsFollow}
                  onCheckedChange={(v) =>
                    setForm((prev) => ({ ...prev, robotsFollow: v === true }))
                  }
                />
                Allow following links
              </label>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
