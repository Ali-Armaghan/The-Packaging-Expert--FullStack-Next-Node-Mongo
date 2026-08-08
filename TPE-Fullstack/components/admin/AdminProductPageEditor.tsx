"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeftIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AgenticLoader } from "@/components/ui/AgenticLoader";
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
import { getProductDetailDefaults } from "@/lib/product/defaults";
import type {
  ProductDetailContent,
  ProductHighlightIcon,
} from "@/types/product";
import { ImageUploadField } from "./ImageUploadField";

type ProductOption = { id: string; name: string; slug: string };

const HIGHLIGHT_ICONS: ProductHighlightIcon[] = [
  "globe",
  "box",
  "leaf",
  "shield",
  "clock",
];

const textareaClass =
  "w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

/** Comma-separated input <-> string[] so admins can edit option lists inline. */
function ListInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  return (
    <Input
      value={value.join(", ")}
      placeholder={placeholder}
      onChange={(e) =>
        onChange(
          e.target.value
            .split(",")
            .map((part) => part.trim())
            .filter(Boolean),
        )
      }
    />
  );
}

function SectionCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </div>
        {action}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

export function AdminProductPageEditor({ productId }: { productId: string }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [detail, setDetail] = useState<ProductDetailContent | null>(null);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productRes, listRes] = await Promise.all([
        fetch(`/api/admin/products/${productId}`),
        fetch("/api/admin/products"),
      ]);
      const productJson = await productRes.json();
      if (!productRes.ok || !productJson.success) {
        throw new Error(productJson.error || "Failed to load product");
      }
      setName(productJson.data.name);
      setSlug(productJson.data.slug);
      setDetail(
        productJson.data.detail ?? getProductDetailDefaults(productJson.data.name),
      );

      const listJson = await listRes.json();
      if (listRes.ok && listJson.success) {
        setProducts(
          (listJson.data as ProductOption[]).filter((p) => p.id !== productId),
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void load();
  }, [load]);

  const patch = <K extends keyof ProductDetailContent>(
    key: K,
    value: ProductDetailContent[K],
  ) => {
    setSaved(false);
    setDetail((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const save = async () => {
    if (!detail) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ detail }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save page content");
      }
      setDetail(data.data.detail);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-16 text-sm text-muted-foreground">
        <AgenticLoader size="sm" label="Loading" />
        Loading product…
      </div>
    );
  }

  if (!detail) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error ?? "Product not found"}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon className="size-4" />
            Back to products
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            {name} — page content
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything on <code>/products/{slug}</code> is edited here.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/products/${slug}`}
            target="_blank"
            className="inline-flex h-9 items-center rounded-md border border-input px-4 text-sm font-medium transition hover:bg-accent"
          >
            Preview
          </Link>
          <Button type="button" onClick={() => void save()} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {saved ? (
        <Alert>
          <AlertTitle>Saved</AlertTitle>
          <AlertDescription>
            The live product page has been revalidated.
          </AlertDescription>
        </Alert>
      ) : null}

      <SectionCard
        title="Header"
        description="Breadcrumb label, summary copy, and extra gallery images."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Breadcrumb label</Label>
            <Input
              value={detail.breadcrumbLabel}
              onChange={(e) => patch("breadcrumbLabel", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Related section title</Label>
            <Input
              value={detail.relatedTitle}
              onChange={(e) => patch("relatedTitle", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Summary</Label>
          <textarea
            rows={3}
            className={textareaClass}
            value={detail.summary}
            onChange={(e) => patch("summary", e.target.value)}
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Gallery images</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => patch("gallery", [...detail.gallery, ""])}
            >
              <PlusIcon className="size-3.5" />
              Add image
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {detail.gallery.map((image, index) => (
              <div key={index} className="space-y-2">
                <ImageUploadField
                  value={image}
                  folder="products"
                  square
                  onChange={(url) => {
                    const next = [...detail.gallery];
                    next[index] = url;
                    patch("gallery", next);
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="gap-1.5 text-destructive"
                  onClick={() =>
                    patch(
                      "gallery",
                      detail.gallery.filter((_, i) => i !== index),
                    )
                  }
                >
                  <Trash2Icon className="size-3.5" />
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Dropdown selectors"
        description="Rendered above the option chips (quantity, print side, box style…)."
        action={
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() =>
              patch("selectors", [
                ...detail.selectors,
                { id: `selector-${Date.now()}`, label: "", options: [] },
              ])
            }
          >
            <PlusIcon className="size-3.5" />
            Add selector
          </Button>
        }
      >
        {detail.selectors.map((selector, index) => (
          <div
            key={selector.id}
            className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-[1fr_2fr_auto]"
          >
            <Input
              placeholder="Label"
              value={selector.label}
              onChange={(e) => {
                const next = [...detail.selectors];
                next[index] = { ...selector, label: e.target.value };
                patch("selectors", next);
              }}
            />
            <ListInput
              placeholder="Comma separated options"
              value={selector.options}
              onChange={(options) => {
                const next = [...detail.selectors];
                next[index] = { ...selector, options };
                patch("selectors", next);
              }}
            />
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() =>
                patch(
                  "selectors",
                  detail.selectors.filter((_, i) => i !== index),
                )
              }
            >
              <Trash2Icon className="size-3.5 text-destructive" />
            </Button>
          </div>
        ))}
      </SectionCard>

      <SectionCard
        title="Option chips"
        description="Selectable pill groups such as material and finishing."
        action={
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() =>
              patch("optionGroups", [
                ...detail.optionGroups,
                { id: `option-${Date.now()}`, label: "", options: [] },
              ])
            }
          >
            <PlusIcon className="size-3.5" />
            Add group
          </Button>
        }
      >
        {detail.optionGroups.map((group, index) => (
          <div
            key={group.id}
            className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-[1fr_2fr_auto]"
          >
            <Input
              placeholder="Label"
              value={group.label}
              onChange={(e) => {
                const next = [...detail.optionGroups];
                next[index] = { ...group, label: e.target.value };
                patch("optionGroups", next);
              }}
            />
            <ListInput
              placeholder="Comma separated options"
              value={group.options}
              onChange={(options) => {
                const next = [...detail.optionGroups];
                next[index] = { ...group, options };
                patch("optionGroups", next);
              }}
            />
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() =>
                patch(
                  "optionGroups",
                  detail.optionGroups.filter((_, i) => i !== index),
                )
              }
            >
              <Trash2Icon className="size-3.5 text-destructive" />
            </Button>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Call to action">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Button label</Label>
            <Input
              value={detail.ctaLabel}
              onChange={(e) => patch("ctaLabel", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Button link</Label>
            <Input
              value={detail.ctaHref}
              onChange={(e) => patch("ctaHref", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Price note label</Label>
            <Input
              value={detail.priceNoteLabel}
              onChange={(e) => patch("priceNoteLabel", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Price note link</Label>
            <Input
              value={detail.priceNoteHref}
              onChange={(e) => patch("priceNoteHref", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Quantity dropdown options</Label>
          <ListInput
            placeholder="100, 250, 500"
            value={detail.quantityOptions}
            onChange={(options) => patch("quantityOptions", options)}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Tabs"
        description="Details, available options, inspiration, order process…"
        action={
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() =>
              patch("tabs", [
                ...detail.tabs,
                { id: `tab-${Date.now()}`, label: "", body: "" },
              ])
            }
          >
            <PlusIcon className="size-3.5" />
            Add tab
          </Button>
        }
      >
        {detail.tabs.map((tab, index) => (
          <div key={tab.id} className="space-y-3 rounded-lg border border-border p-3">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Tab label"
                value={tab.label}
                onChange={(e) => {
                  const next = [...detail.tabs];
                  next[index] = { ...tab, label: e.target.value };
                  patch("tabs", next);
                }}
              />
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={() =>
                  patch(
                    "tabs",
                    detail.tabs.filter((_, i) => i !== index),
                  )
                }
              >
                <Trash2Icon className="size-3.5 text-destructive" />
              </Button>
            </div>
            <textarea
              rows={4}
              className={textareaClass}
              placeholder="Tab content — one paragraph per line"
              value={tab.body}
              onChange={(e) => {
                const next = [...detail.tabs];
                next[index] = { ...tab, body: e.target.value };
                patch("tabs", next);
              }}
            />
          </div>
        ))}
      </SectionCard>

      <SectionCard
        title="Highlights"
        description="Icon + title + text row below the tabs."
        action={
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() =>
              patch("highlights", [
                ...detail.highlights,
                { icon: "box", title: "", text: "" },
              ])
            }
          >
            <PlusIcon className="size-3.5" />
            Add highlight
          </Button>
        }
      >
        {detail.highlights.map((highlight, index) => (
          <div
            key={index}
            className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-[auto_1fr_2fr_auto]"
          >
            <select
              value={highlight.icon}
              className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
              onChange={(e) => {
                const next = [...detail.highlights];
                next[index] = {
                  ...highlight,
                  icon: e.target.value as ProductHighlightIcon,
                };
                patch("highlights", next);
              }}
            >
              {HIGHLIGHT_ICONS.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
            <Input
              placeholder="Title"
              value={highlight.title}
              onChange={(e) => {
                const next = [...detail.highlights];
                next[index] = { ...highlight, title: e.target.value };
                patch("highlights", next);
              }}
            />
            <Input
              placeholder="Text"
              value={highlight.text}
              onChange={(e) => {
                const next = [...detail.highlights];
                next[index] = { ...highlight, text: e.target.value };
                patch("highlights", next);
              }}
            />
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() =>
                patch(
                  "highlights",
                  detail.highlights.filter((_, i) => i !== index),
                )
              }
            >
              <Trash2Icon className="size-3.5 text-destructive" />
            </Button>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Promo banner">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Eyebrow</Label>
            <Input
              value={detail.banner.eyebrow}
              onChange={(e) =>
                patch("banner", { ...detail.banner, eyebrow: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={detail.banner.title}
              onChange={(e) =>
                patch("banner", { ...detail.banner, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Button label</Label>
            <Input
              value={detail.banner.buttonLabel}
              onChange={(e) =>
                patch("banner", {
                  ...detail.banner,
                  buttonLabel: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Button link</Label>
            <Input
              value={detail.banner.buttonHref}
              onChange={(e) =>
                patch("banner", {
                  ...detail.banner,
                  buttonHref: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <textarea
            rows={3}
            className={textareaClass}
            value={detail.banner.description}
            onChange={(e) =>
              patch("banner", {
                ...detail.banner,
                description: e.target.value,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Banner image</Label>
          <ImageUploadField
            value={detail.banner.image}
            folder="products"
            onChange={(image) => patch("banner", { ...detail.banner, image })}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Feature sections"
        description="Alternating image and copy blocks."
        action={
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() =>
              patch("featureSections", [
                ...detail.featureSections,
                {
                  title: "",
                  description: "",
                  linkLabel: "",
                  linkHref: "",
                  image: "",
                  imageSide:
                    detail.featureSections.length % 2 === 0 ? "left" : "right",
                },
              ])
            }
          >
            <PlusIcon className="size-3.5" />
            Add section
          </Button>
        }
      >
        {detail.featureSections.map((section, index) => {
          const update = (patchValue: Partial<typeof section>) => {
            const next = [...detail.featureSections];
            next[index] = { ...section, ...patchValue };
            patch("featureSections", next);
          };
          return (
            <div
              key={index}
              className="space-y-3 rounded-lg border border-border p-3"
            >
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Title"
                  value={section.title}
                  onChange={(e) => update({ title: e.target.value })}
                />
                <select
                  value={section.imageSide}
                  className="h-9 shrink-0 rounded-md border border-input bg-transparent px-2 text-sm"
                  onChange={(e) =>
                    update({ imageSide: e.target.value as "left" | "right" })
                  }
                >
                  <option value="left">Image left</option>
                  <option value="right">Image right</option>
                </select>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() =>
                    patch(
                      "featureSections",
                      detail.featureSections.filter((_, i) => i !== index),
                    )
                  }
                >
                  <Trash2Icon className="size-3.5 text-destructive" />
                </Button>
              </div>
              <textarea
                rows={3}
                className={textareaClass}
                placeholder="Description"
                value={section.description}
                onChange={(e) => update({ description: e.target.value })}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  placeholder="Link label"
                  value={section.linkLabel}
                  onChange={(e) => update({ linkLabel: e.target.value })}
                />
                <Input
                  placeholder="Link href"
                  value={section.linkHref}
                  onChange={(e) => update({ linkHref: e.target.value })}
                />
              </div>
              <ImageUploadField
                value={section.image}
                folder="products"
                onChange={(image) => update({ image })}
              />
            </div>
          );
        })}
      </SectionCard>

      <SectionCard
        title="Related products"
        description="Leave empty to auto-fill from the same Group By pages."
      >
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground">No other products yet.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {products.map((product) => (
              <label
                key={product.id}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
              >
                <Checkbox
                  checked={detail.relatedProductIds.includes(product.id)}
                  onCheckedChange={() =>
                    patch(
                      "relatedProductIds",
                      detail.relatedProductIds.includes(product.id)
                        ? detail.relatedProductIds.filter(
                            (id) => id !== product.id,
                          )
                        : [...detail.relatedProductIds, product.id],
                    )
                  }
                />
                {product.name}
              </label>
            ))}
          </div>
        )}
      </SectionCard>

      <div className="flex justify-end">
        <Button type="button" onClick={() => void save()} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
