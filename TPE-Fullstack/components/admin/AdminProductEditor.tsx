"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
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
import { slugify } from "@/lib/slug";
import type {
  ProductDetailContent,
  ProductHighlightIcon,
  SerializedProduct,
} from "@/types/product";
import { ImageUploadField } from "./ImageUploadField";

type GroupOption = { id: string; name: string; slug: string; isActive: boolean };
type ProductOption = { id: string; name: string; slug: string };

const HIGHLIGHT_ICONS: ProductHighlightIcon[] = [
  "globe",
  "box",
  "leaf",
  "shield",
  "clock",
];

const textareaClass =
  "w-full rounded-[3px] border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

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
  action?: ReactNode;
  children: ReactNode;
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

type Basics = {
  name: string;
  slug: string;
  description: string;
  price: string;
  image: string;
  groupByIds: string[];
  isActive: boolean;
  sortOrder: number;
};

const emptyBasics = (): Basics => ({
  name: "",
  slug: "",
  description: "",
  price: "",
  image: "",
  groupByIds: [],
  isActive: true,
  sortOrder: 0,
});

type AdminProductEditorProps =
  | { mode: "create" }
  | { mode: "edit"; productId: string };

/** Full product screen: basics + every product-page section (all saved to DB). */
export function AdminProductEditor(props: AdminProductEditorProps) {
  const router = useRouter();
  const isCreate = props.mode === "create";
  const productId = props.mode === "edit" ? props.productId : null;

  const [basics, setBasics] = useState<Basics>(emptyBasics());
  const [detail, setDetail] = useState<ProductDetailContent | null>(
    isCreate ? getProductDetailDefaults() : null,
  );
  const [slugTouched, setSlugTouched] = useState(false);
  const [groups, setGroups] = useState<GroupOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(!isCreate);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const requests: Promise<Response>[] = [
        fetch("/api/admin/group-by"),
        fetch("/api/admin/products?lite=1"),
      ];
      if (productId) {
        requests.unshift(fetch(`/api/admin/products/${productId}`));
      }

      const responses = await Promise.all(requests);
      let offset = 0;

      if (productId) {
        const productRes = responses[0]!;
        const productJson = await productRes.json();
        if (!productRes.ok || !productJson.success) {
          throw new Error(productJson.error || "Failed to load product");
        }
        const data = productJson.data as SerializedProduct;
        setBasics({
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: data.price,
          image: data.image,
          groupByIds: data.groupByIds,
          isActive: data.isActive,
          sortOrder: data.sortOrder,
        });
        setDetail(data.detail ?? getProductDetailDefaults(data.name));
        setSlugTouched(true);
        offset = 1;
      }

      const groupsRes = responses[offset]!;
      const listRes = responses[offset + 1]!;
      const groupsJson = await groupsRes.json();
      const listJson = await listRes.json();

      if (groupsRes.ok && groupsJson.success) {
        setGroups(groupsJson.data as GroupOption[]);
      }
      if (listRes.ok && listJson.success) {
        setProducts(
          (listJson.data as ProductOption[]).filter(
            (p) => !productId || p.id !== productId,
          ),
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

  const patchDetail = <K extends keyof ProductDetailContent>(
    key: K,
    value: ProductDetailContent[K],
  ) => {
    setSaved(false);
    setDetail((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const patchBasics = <K extends keyof Basics>(key: K, value: Basics[K]) => {
    setSaved(false);
    setBasics((prev) => ({ ...prev, [key]: value }));
  };

  const toggleGroup = (id: string) => {
    setSaved(false);
    setBasics((prev) => ({
      ...prev,
      groupByIds: prev.groupByIds.includes(id)
        ? prev.groupByIds.filter((g) => g !== id)
        : [...prev.groupByIds, id],
    }));
  };

  const save = async () => {
    if (!detail) return;
    if (!basics.name.trim()) {
      setError("Name is required");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const nextSlug = slugify(basics.slug || basics.name);
      const payload = {
        ...basics,
        slug: nextSlug,
        detail: {
          ...detail,
          breadcrumbLabel: detail.breadcrumbLabel || basics.name,
        },
      };

      const res = await fetch(
        isCreate ? "/api/admin/products" : `/api/admin/products/${productId}`,
        {
          method: isCreate ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save product");
      }

      const savedProduct = data.data as SerializedProduct;
      if (isCreate) {
        router.replace(`/admin/products/${savedProduct.id}/edit`);
        router.refresh();
        return;
      }

      setBasics({
        name: savedProduct.name,
        slug: savedProduct.slug,
        description: savedProduct.description,
        price: savedProduct.price,
        image: savedProduct.image,
        groupByIds: savedProduct.groupByIds,
        isActive: savedProduct.isActive,
        sortOrder: savedProduct.sortOrder,
      });
      setDetail(savedProduct.detail);
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

  const previewSlug = slugify(basics.slug || basics.name) || "…";

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
            {isCreate ? "Add product" : `${basics.name || "Product"} — edit`}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Public page:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              /products/{previewSlug}
            </code>
            . All sections below are stored in the database.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isCreate && basics.slug ? (
            <Link
              href={`/products/${basics.slug}`}
              target="_blank"
              className="inline-flex h-9 items-center rounded-[3px] border border-input px-4 text-sm font-medium transition hover:bg-accent"
            >
              Preview
            </Link>
          ) : null}
          <Button type="button" onClick={() => void save()} disabled={saving}>
            {saving
              ? "Saving…"
              : isCreate
                ? "Create product"
                : "Save changes"}
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
            Live product page cache has been revalidated.
          </AlertDescription>
        </Alert>
      ) : null}

      <SectionCard
        title="Basics"
        description="Core product fields used in catalogs and the detail page header."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              required
              value={basics.name}
              onChange={(e) => {
                const name = e.target.value;
                setSaved(false);
                setBasics((prev) => ({
                  ...prev,
                  name,
                  slug: slugTouched ? prev.slug : slugify(name),
                }));
                if (!slugTouched) {
                  setDetail((prev) =>
                    prev
                      ? {
                          ...prev,
                          breadcrumbLabel: prev.breadcrumbLabel || name,
                        }
                      : prev,
                  );
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              value={basics.slug}
              onChange={(e) => {
                setSlugTouched(true);
                patchBasics("slug", slugify(e.target.value));
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Price label</Label>
            <Input
              value={basics.price}
              placeholder="From $0.48"
              onChange={(e) => patchBasics("price", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Sort order</Label>
            <Input
              type="number"
              value={basics.sortOrder}
              onChange={(e) =>
                patchBasics("sortOrder", Number(e.target.value) || 0)
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Short description</Label>
          <textarea
            rows={3}
            className={textareaClass}
            value={basics.description}
            onChange={(e) => patchBasics("description", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Primary image</Label>
          <ImageUploadField
            value={basics.image}
            folder="products"
            onChange={(image) => patchBasics("image", image)}
          />
        </div>
        <div className="space-y-2">
          <Label>Group By pages</Label>
          {groups.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No groups yet. Create a Group By first.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {groups.map((g) => (
                <label
                  key={g.id}
                  className="flex items-center gap-2 rounded-[3px] border border-border px-3 py-2 text-sm"
                >
                  <Checkbox
                    checked={basics.groupByIds.includes(g.id)}
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
            checked={basics.isActive}
            onCheckedChange={(v) => patchBasics("isActive", v === true)}
          />
          Active (visible on the public site)
        </label>
      </SectionCard>

      <SectionCard
        title="Page header"
        description="SKU, breadcrumb, summary, and gallery for the product detail page."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>SKU / product code</Label>
            <Input
              value={detail.sku}
              placeholder="F064"
              onChange={(e) => patchDetail("sku", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Breadcrumb label</Label>
            <Input
              value={detail.breadcrumbLabel}
              onChange={(e) => patchDetail("breadcrumbLabel", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Related section title</Label>
            <Input
              value={detail.relatedTitle}
              onChange={(e) => patchDetail("relatedTitle", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Summary (right column)</Label>
          <textarea
            rows={3}
            className={textareaClass}
            value={detail.summary}
            onChange={(e) => patchDetail("summary", e.target.value)}
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
              onClick={() => patchDetail("gallery", [...detail.gallery, ""])}
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
                    patchDetail("gallery", next);
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="gap-1.5 text-destructive"
                  onClick={() =>
                    patchDetail(
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
        title="Dimensions"
        description="Length / Width / Depth inputs above the dropdowns."
      >
        <div className="space-y-3">
          {detail.dimensionFields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-3 rounded-[3px] border border-border p-3 sm:grid-cols-[1fr_auto_auto]"
            >
              <Input
                placeholder="Label e.g. Length (inch)"
                value={field.label}
                onChange={(e) => {
                  const next = [...detail.dimensionFields];
                  next[index] = { ...field, label: e.target.value };
                  patchDetail("dimensionFields", next);
                }}
              />
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={field.required !== false}
                  onCheckedChange={(v) => {
                    const next = [...detail.dimensionFields];
                    next[index] = { ...field, required: v === true };
                    patchDetail("dimensionFields", next);
                  }}
                />
                Required
              </label>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={() =>
                  patchDetail(
                    "dimensionFields",
                    detail.dimensionFields.filter((_, i) => i !== index),
                  )
                }
              >
                <Trash2Icon className="size-3.5 text-destructive" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() =>
              patchDetail("dimensionFields", [
                ...detail.dimensionFields,
                { id: `dim-${Date.now()}`, label: "", required: true },
              ])
            }
          >
            <PlusIcon className="size-3.5" />
            Add dimension field
          </Button>
        </div>
      </SectionCard>

      <SectionCard
        title="Dropdown selectors"
        description="Material / Print / Finishing style dropdowns."
        action={
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() =>
              patchDetail("selectors", [
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
            className="grid gap-3 rounded-[3px] border border-border p-3 sm:grid-cols-[1fr_2fr_auto]"
          >
            <Input
              placeholder="Label"
              value={selector.label}
              onChange={(e) => {
                const next = [...detail.selectors];
                next[index] = { ...selector, label: e.target.value };
                patchDetail("selectors", next);
              }}
            />
            <ListInput
              placeholder="Comma separated options"
              value={selector.options}
              onChange={(options) => {
                const next = [...detail.selectors];
                next[index] = { ...selector, options };
                patchDetail("selectors", next);
              }}
            />
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() =>
                patchDetail(
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
        description="Additional Options / Add-on style chip groups."
        action={
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() =>
              patchDetail("optionGroups", [
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
            className="grid gap-3 rounded-[3px] border border-border p-3 sm:grid-cols-[1fr_2fr_auto]"
          >
            <Input
              placeholder="Label"
              value={group.label}
              onChange={(e) => {
                const next = [...detail.optionGroups];
                next[index] = { ...group, label: e.target.value };
                patchDetail("optionGroups", next);
              }}
            />
            <ListInput
              placeholder="Comma separated options"
              value={group.options}
              onChange={(options) => {
                const next = [...detail.optionGroups];
                next[index] = { ...group, options };
                patchDetail("optionGroups", next);
              }}
            />
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() =>
                patchDetail(
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
              onChange={(e) => patchDetail("ctaLabel", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Button link</Label>
            <Input
              value={detail.ctaHref}
              onChange={(e) => patchDetail("ctaHref", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Price note label</Label>
            <Input
              value={detail.priceNoteLabel}
              onChange={(e) => patchDetail("priceNoteLabel", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Price note link</Label>
            <Input
              value={detail.priceNoteHref}
              onChange={(e) => patchDetail("priceNoteHref", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Quantity dropdown options</Label>
          <ListInput
            placeholder="100, 250, 500, 1000"
            value={detail.quantityOptions}
            onChange={(options) => patchDetail("quantityOptions", options)}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Tabs"
        description="Details, Available Options, Inspiration, Order Process…"
        action={
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() =>
              patchDetail("tabs", [
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
          <div
            key={tab.id}
            className="space-y-3 rounded-[3px] border border-border p-3"
          >
            <div className="flex items-center gap-3">
              <Input
                placeholder="Tab label"
                value={tab.label}
                onChange={(e) => {
                  const next = [...detail.tabs];
                  next[index] = { ...tab, label: e.target.value };
                  patchDetail("tabs", next);
                }}
              />
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={() =>
                  patchDetail(
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
              placeholder="Tab content (leave empty for Order Process cards)"
              value={tab.body}
              onChange={(e) => {
                const next = [...detail.tabs];
                next[index] = { ...tab, body: e.target.value };
                patchDetail("tabs", next);
              }}
            />
          </div>
        ))}
      </SectionCard>

      <SectionCard
        title="Order Process tab"
        description="Rendered when the Order Process tab is selected."
      >
        <div className="space-y-2">
          <Label>Section title</Label>
          <Input
            value={detail.orderProcess?.title ?? ""}
            onChange={(e) =>
              patchDetail("orderProcess", {
                ...(detail.orderProcess ?? {
                  title: "",
                  description: "",
                  steps: [],
                }),
                title: e.target.value,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <textarea
            rows={3}
            className={textareaClass}
            value={detail.orderProcess?.description ?? ""}
            onChange={(e) =>
              patchDetail("orderProcess", {
                ...(detail.orderProcess ?? {
                  title: "",
                  description: "",
                  steps: [],
                }),
                description: e.target.value,
              })
            }
          />
        </div>
        <div className="space-y-3">
          {(detail.orderProcess?.steps ?? []).map((step, index) => {
            const steps = detail.orderProcess?.steps ?? [];
            const updateStep = (patchValue: Partial<typeof step>) => {
              const next = [...steps];
              next[index] = { ...step, ...patchValue };
              patchDetail("orderProcess", {
                ...(detail.orderProcess ?? {
                  title: "",
                  description: "",
                  steps: [],
                }),
                steps: next,
              });
            };
            return (
              <div
                key={index}
                className="grid gap-3 rounded-[3px] border border-border p-3 sm:grid-cols-[auto_1fr_2fr_auto]"
              >
                <select
                  value={step.icon}
                  className="h-9 rounded-[3px] border border-input bg-transparent px-2 text-sm"
                  onChange={(e) =>
                    updateStep({
                      icon: e.target.value as typeof step.icon,
                    })
                  }
                >
                  <option value="customize">customize</option>
                  <option value="quote">quote</option>
                  <option value="consult">consult</option>
                  <option value="shipping">shipping</option>
                </select>
                <Input
                  placeholder="Step title"
                  value={step.title}
                  onChange={(e) => updateStep({ title: e.target.value })}
                />
                <Input
                  placeholder="Step text"
                  value={step.text}
                  onChange={(e) => updateStep({ text: e.target.value })}
                />
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() =>
                    patchDetail("orderProcess", {
                      ...(detail.orderProcess ?? {
                        title: "",
                        description: "",
                        steps: [],
                      }),
                      steps: steps.filter((_, i) => i !== index),
                    })
                  }
                >
                  <Trash2Icon className="size-3.5 text-destructive" />
                </Button>
              </div>
            );
          })}
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() =>
              patchDetail("orderProcess", {
                ...(detail.orderProcess ?? {
                  title: "",
                  description: "",
                  steps: [],
                }),
                steps: [
                  ...(detail.orderProcess?.steps ?? []),
                  { icon: "customize", title: "", text: "" },
                ],
              })
            }
          >
            <PlusIcon className="size-3.5" />
            Add step
          </Button>
        </div>
      </SectionCard>

      <SectionCard
        title="Highlights"
        description="Icon row below the tabs."
        action={
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() =>
              patchDetail("highlights", [
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
            className="grid gap-3 rounded-[3px] border border-border p-3 sm:grid-cols-[auto_1fr_2fr_auto]"
          >
            <select
              value={highlight.icon}
              className="h-9 rounded-[3px] border border-input bg-transparent px-2 text-sm"
              onChange={(e) => {
                const next = [...detail.highlights];
                next[index] = {
                  ...highlight,
                  icon: e.target.value as ProductHighlightIcon,
                };
                patchDetail("highlights", next);
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
                patchDetail("highlights", next);
              }}
            />
            <Input
              placeholder="Text"
              value={highlight.text}
              onChange={(e) => {
                const next = [...detail.highlights];
                next[index] = { ...highlight, text: e.target.value };
                patchDetail("highlights", next);
              }}
            />
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() =>
                patchDetail(
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
                patchDetail("banner", {
                  ...detail.banner,
                  eyebrow: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={detail.banner.title}
              onChange={(e) =>
                patchDetail("banner", {
                  ...detail.banner,
                  title: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Button label</Label>
            <Input
              value={detail.banner.buttonLabel}
              onChange={(e) =>
                patchDetail("banner", {
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
                patchDetail("banner", {
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
              patchDetail("banner", {
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
            onChange={(image) =>
              patchDetail("banner", { ...detail.banner, image })
            }
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
              patchDetail("featureSections", [
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
            patchDetail("featureSections", next);
          };
          return (
            <div
              key={index}
              className="space-y-3 rounded-[3px] border border-border p-3"
            >
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Title"
                  value={section.title}
                  onChange={(e) => update({ title: e.target.value })}
                />
                <select
                  value={section.imageSide}
                  className="h-9 shrink-0 rounded-[3px] border border-input bg-transparent px-2 text-sm"
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
                    patchDetail(
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
                className="flex items-center gap-2 rounded-[3px] border border-border px-3 py-2 text-sm"
              >
                <Checkbox
                  checked={detail.relatedProductIds.includes(product.id)}
                  onCheckedChange={() =>
                    patchDetail(
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
          {saving
            ? "Saving…"
            : isCreate
              ? "Create product"
              : "Save changes"}
        </Button>
      </div>
    </div>
  );
}

/** @deprecated Use AdminProductEditor */
export function AdminProductPageEditor({ productId }: { productId: string }) {
  return <AdminProductEditor mode="edit" productId={productId} />;
}
