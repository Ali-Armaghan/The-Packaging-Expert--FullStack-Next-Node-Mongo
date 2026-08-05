"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GroupByContent } from "@/types/groupBy";
import { ImageUploadField } from "./ImageUploadField";

const fieldClass =
  "w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
      />
    </div>
  );
}

export function GroupHeroEditor({
  value,
  onChange,
}: {
  value: GroupByContent["hero"];
  onChange: (v: GroupByContent["hero"]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Eyebrow</Label>
          <Input
            value={value.eyebrow}
            onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Brand</Label>
          <Input
            value={value.brand}
            onChange={(e) => onChange({ ...value, brand: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Headline</Label>
        <Input
          value={value.headline}
          onChange={(e) => onChange({ ...value, headline: e.target.value })}
        />
      </div>
      <TextArea
        label="Description"
        value={value.description}
        onChange={(description) => onChange({ ...value, description })}
      />
      <ImageUploadField
        value={value.image}
        onChange={(image) => onChange({ ...value, image })}
        folder="group-by/hero"
        label="Hero image"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Primary CTA label</Label>
          <Input
            value={value.primaryCta.label}
            onChange={(e) =>
              onChange({
                ...value,
                primaryCta: { ...value.primaryCta, label: e.target.value },
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Primary CTA link</Label>
          <Input
            value={value.primaryCta.href}
            onChange={(e) =>
              onChange({
                ...value,
                primaryCta: { ...value.primaryCta, href: e.target.value },
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Secondary CTA label</Label>
          <Input
            value={value.secondaryCta.label}
            onChange={(e) =>
              onChange({
                ...value,
                secondaryCta: { ...value.secondaryCta, label: e.target.value },
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Secondary CTA link</Label>
          <Input
            value={value.secondaryCta.href}
            onChange={(e) =>
              onChange({
                ...value,
                secondaryCta: { ...value.secondaryCta, href: e.target.value },
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

export function GroupCatalogEditor({
  value,
  onChange,
}: {
  value: GroupByContent["catalog"];
  onChange: (v: GroupByContent["catalog"]) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
        Product cards come from Products linked to this group. Here you only set
        catalog section copy and tabs.
      </p>
      <div className="space-y-2">
        <Label>Eyebrow</Label>
        <Input
          value={value.eyebrow}
          onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </div>
      <TextArea
        label="Description"
        value={value.description}
        onChange={(description) => onChange({ ...value, description })}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>View all label</Label>
          <Input
            value={value.viewAllLabel}
            onChange={(e) =>
              onChange({ ...value, viewAllLabel: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>View all link</Label>
          <Input
            value={value.viewAllHref}
            onChange={(e) =>
              onChange({ ...value, viewAllHref: e.target.value })
            }
          />
        </div>
      </div>
      <TextArea
        label="Tabs (one per line)"
        value={value.tabs.join("\n")}
        onChange={(v) =>
          onChange({
            ...value,
            tabs: v
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
          })
        }
      />
    </div>
  );
}

export function GroupWhyUsEditor({
  value,
  onChange,
}: {
  value: GroupByContent["whyUs"];
  onChange: (v: GroupByContent["whyUs"]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Eyebrow</Label>
        <Input
          value={value.eyebrow}
          onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </div>
      <ImageUploadField
        value={value.image}
        onChange={(image) => onChange({ ...value, image })}
        folder="group-by/why-us"
        label="Why us image"
      />
      <div className="space-y-2">
        <Label>Image alt</Label>
        <Input
          value={value.imageAlt ?? ""}
          onChange={(e) => onChange({ ...value, imageAlt: e.target.value })}
        />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Items</Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1"
            onClick={() =>
              onChange({
                ...value,
                items: [
                  ...value.items,
                  { title: "New benefit", text: "", icon: "palette" },
                ],
              })
            }
          >
            <PlusIcon className="size-3.5" />
            Add item
          </Button>
        </div>
        {value.items.map((item, index) => (
          <div
            key={index}
            className="space-y-3 rounded-xl border border-border p-4"
          >
            <div className="flex justify-between gap-2">
              <p className="text-xs font-semibold text-muted-foreground">
                Item {index + 1}
              </p>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={() =>
                  onChange({
                    ...value,
                    items: value.items.filter((_, i) => i !== index),
                  })
                }
              >
                <Trash2Icon className="size-3.5 text-destructive" />
              </Button>
            </div>
            <Input
              value={item.title}
              onChange={(e) => {
                const items = [...value.items];
                items[index] = { ...item, title: e.target.value };
                onChange({ ...value, items });
              }}
              placeholder="Title"
            />
            <textarea
              rows={2}
              value={item.text}
              onChange={(e) => {
                const items = [...value.items];
                items[index] = { ...item, text: e.target.value };
                onChange({ ...value, items });
              }}
              className={fieldClass}
              placeholder="Text"
            />
            <Select
              value={item.icon}
              onValueChange={(icon) => {
                const items = [...value.items];
                items[index] = {
                  ...item,
                  icon: icon as "palette" | "clock" | "shield",
                };
                onChange({ ...value, items });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="palette">Palette</SelectItem>
                <SelectItem value="clock">Clock</SelectItem>
                <SelectItem value="shield">Shield</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GroupIndustriesEditor({
  value,
  onChange,
}: {
  value: GroupByContent["industries"];
  onChange: (v: GroupByContent["industries"]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Eyebrow</Label>
        <Input
          value={value.eyebrow}
          onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={() =>
            onChange({
              ...value,
              items: [
                ...value.items,
                {
                  title: "New industry",
                  subtitle: "",
                  image: "",
                  href: "/industries",
                  tone: "bg-[#1a1f2c]/55",
                },
              ],
            })
          }
        >
          <PlusIcon className="size-3.5" />
          Add industry
        </Button>
      </div>
      {value.items.map((item, index) => (
        <div key={index} className="space-y-3 rounded-xl border border-border p-4">
          <div className="flex justify-between">
            <p className="text-xs font-semibold text-muted-foreground">
              Card {index + 1}
            </p>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() =>
                onChange({
                  ...value,
                  items: value.items.filter((_, i) => i !== index),
                })
              }
            >
              <Trash2Icon className="size-3.5 text-destructive" />
            </Button>
          </div>
          <Input
            value={item.title}
            onChange={(e) => {
              const items = [...value.items];
              items[index] = { ...item, title: e.target.value };
              onChange({ ...value, items });
            }}
            placeholder="Title"
          />
          <Input
            value={item.subtitle}
            onChange={(e) => {
              const items = [...value.items];
              items[index] = { ...item, subtitle: e.target.value };
              onChange({ ...value, items });
            }}
            placeholder="Subtitle"
          />
          <Input
            value={item.href}
            onChange={(e) => {
              const items = [...value.items];
              items[index] = { ...item, href: e.target.value };
              onChange({ ...value, items });
            }}
            placeholder="Link"
          />
          <ImageUploadField
            value={item.image}
            onChange={(image) => {
              const items = [...value.items];
              items[index] = { ...item, image };
              onChange({ ...value, items });
            }}
            folder="group-by/industries"
            label="Image"
          />
        </div>
      ))}
    </div>
  );
}

export function GroupProcessEditor({
  value,
  onChange,
}: {
  value: GroupByContent["process"];
  onChange: (v: GroupByContent["process"]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Eyebrow</Label>
        <Input
          value={value.eyebrow}
          onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>CTA label</Label>
          <Input
            value={value.cta.label}
            onChange={(e) =>
              onChange({
                ...value,
                cta: { ...value.cta, label: e.target.value },
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>CTA link</Label>
          <Input
            value={value.cta.href}
            onChange={(e) =>
              onChange({
                ...value,
                cta: { ...value.cta, href: e.target.value },
              })
            }
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={() =>
            onChange({
              ...value,
              steps: [
                ...value.steps,
                {
                  n: String(value.steps.length + 1).padStart(2, "0"),
                  title: "New step",
                  text: "",
                },
              ],
            })
          }
        >
          <PlusIcon className="size-3.5" />
          Add step
        </Button>
      </div>
      {value.steps.map((step, index) => (
        <div key={index} className="space-y-3 rounded-xl border border-border p-4">
          <div className="flex justify-between">
            <p className="text-xs font-semibold text-muted-foreground">
              Step {step.n}
            </p>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() =>
                onChange({
                  ...value,
                  steps: value.steps.filter((_, i) => i !== index),
                })
              }
            >
              <Trash2Icon className="size-3.5 text-destructive" />
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-[80px_1fr]">
            <Input
              value={step.n}
              onChange={(e) => {
                const steps = [...value.steps];
                steps[index] = { ...step, n: e.target.value };
                onChange({ ...value, steps });
              }}
              placeholder="01"
            />
            <Input
              value={step.title}
              onChange={(e) => {
                const steps = [...value.steps];
                steps[index] = { ...step, title: e.target.value };
                onChange({ ...value, steps });
              }}
              placeholder="Title"
            />
          </div>
          <textarea
            rows={2}
            value={step.text}
            onChange={(e) => {
              const steps = [...value.steps];
              steps[index] = { ...step, text: e.target.value };
              onChange({ ...value, steps });
            }}
            className={fieldClass}
          />
        </div>
      ))}
    </div>
  );
}

export function GroupFeaturesEditor({
  value,
  onChange,
}: {
  value: GroupByContent["features"];
  onChange: (v: GroupByContent["features"]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={() =>
            onChange({
              ...value,
              blocks: [
                ...value.blocks,
                {
                  eyebrow: "Feature",
                  title: "New block",
                  description: "",
                  image: "",
                  imageAlt: "",
                  bullets: [],
                  cta: { label: "Learn more", href: "/quote", variant: "primary" },
                  imageSide: "right",
                },
              ],
            })
          }
        >
          <PlusIcon className="size-3.5" />
          Add block
        </Button>
      </div>
      {value.blocks.map((block, index) => (
        <div key={index} className="space-y-3 rounded-xl border border-border p-4">
          <div className="flex justify-between">
            <p className="text-xs font-semibold text-muted-foreground">
              Block {index + 1}
            </p>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() =>
                onChange({
                  ...value,
                  blocks: value.blocks.filter((_, i) => i !== index),
                })
              }
            >
              <Trash2Icon className="size-3.5 text-destructive" />
            </Button>
          </div>
          <Input
            value={block.eyebrow}
            onChange={(e) => {
              const blocks = [...value.blocks];
              blocks[index] = { ...block, eyebrow: e.target.value };
              onChange({ ...value, blocks });
            }}
            placeholder="Eyebrow"
          />
          <Input
            value={block.title}
            onChange={(e) => {
              const blocks = [...value.blocks];
              blocks[index] = { ...block, title: e.target.value };
              onChange({ ...value, blocks });
            }}
            placeholder="Title"
          />
          <textarea
            rows={3}
            value={block.description}
            onChange={(e) => {
              const blocks = [...value.blocks];
              blocks[index] = { ...block, description: e.target.value };
              onChange({ ...value, blocks });
            }}
            className={fieldClass}
          />
          <TextArea
            label="Bullets (one per line)"
            value={(block.bullets ?? []).join("\n")}
            onChange={(v) => {
              const blocks = [...value.blocks];
              blocks[index] = {
                ...block,
                bullets: v
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
              };
              onChange({ ...value, blocks });
            }}
          />
          <ImageUploadField
            value={block.image}
            onChange={(image) => {
              const blocks = [...value.blocks];
              blocks[index] = { ...block, image };
              onChange({ ...value, blocks });
            }}
            folder="group-by/features"
            label="Image"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              value={block.cta.label}
              onChange={(e) => {
                const blocks = [...value.blocks];
                blocks[index] = {
                  ...block,
                  cta: { ...block.cta, label: e.target.value },
                };
                onChange({ ...value, blocks });
              }}
              placeholder="CTA label"
            />
            <Input
              value={block.cta.href}
              onChange={(e) => {
                const blocks = [...value.blocks];
                blocks[index] = {
                  ...block,
                  cta: { ...block.cta, href: e.target.value },
                };
                onChange({ ...value, blocks });
              }}
              placeholder="CTA href"
            />
          </div>
          <Select
            value={block.imageSide}
            onValueChange={(imageSide) => {
              const blocks = [...value.blocks];
              blocks[index] = {
                ...block,
                imageSide: imageSide as "left" | "right",
              };
              onChange({ ...value, blocks });
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Image left</SelectItem>
              <SelectItem value="right">Image right</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}

export function GroupStatsEditor({
  value,
  onChange,
}: {
  value: GroupByContent["stats"];
  onChange: (v: GroupByContent["stats"]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>CTA label</Label>
          <Input
            value={value.cta.label}
            onChange={(e) =>
              onChange({
                ...value,
                cta: { ...value.cta, label: e.target.value },
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>CTA link</Label>
          <Input
            value={value.cta.href}
            onChange={(e) =>
              onChange({
                ...value,
                cta: { ...value.cta, href: e.target.value },
              })
            }
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={() =>
            onChange({
              ...value,
              items: [...value.items, { value: "0%", label: "New stat" }],
            })
          }
        >
          <PlusIcon className="size-3.5" />
          Add stat
        </Button>
      </div>
      {value.items.map((item, index) => (
        <div
          key={index}
          className="grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-[1fr_1fr_auto]"
        >
          <Input
            value={item.value}
            onChange={(e) => {
              const items = [...value.items];
              items[index] = { ...item, value: e.target.value };
              onChange({ ...value, items });
            }}
            placeholder="40%"
          />
          <Input
            value={item.label}
            onChange={(e) => {
              const items = [...value.items];
              items[index] = { ...item, label: e.target.value };
              onChange({ ...value, items });
            }}
            placeholder="Label"
          />
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={() =>
              onChange({
                ...value,
                items: value.items.filter((_, i) => i !== index),
              })
            }
          >
            <Trash2Icon className="size-3.5 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}

export function GroupTestimonialsEditor({
  value,
  onChange,
}: {
  value: GroupByContent["testimonials"];
  onChange: (v: GroupByContent["testimonials"]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Eyebrow</Label>
        <Input
          value={value.eyebrow}
          onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>CTA label</Label>
          <Input
            value={value.cta.label}
            onChange={(e) =>
              onChange({
                ...value,
                cta: { ...value.cta, label: e.target.value },
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>CTA link</Label>
          <Input
            value={value.cta.href}
            onChange={(e) =>
              onChange({
                ...value,
                cta: { ...value.cta, href: e.target.value },
              })
            }
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={() =>
            onChange({
              ...value,
              reviews: [
                ...value.reviews,
                {
                  image: "",
                  quote: "",
                  name: "Customer",
                  role: "",
                  avatar: "",
                },
              ],
            })
          }
        >
          <PlusIcon className="size-3.5" />
          Add review
        </Button>
      </div>
      {value.reviews.map((review, index) => (
        <div key={index} className="space-y-3 rounded-xl border border-border p-4">
          <div className="flex justify-between">
            <p className="text-xs font-semibold text-muted-foreground">
              Review {index + 1}
            </p>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() =>
                onChange({
                  ...value,
                  reviews: value.reviews.filter((_, i) => i !== index),
                })
              }
            >
              <Trash2Icon className="size-3.5 text-destructive" />
            </Button>
          </div>
          <textarea
            rows={3}
            value={review.quote}
            onChange={(e) => {
              const reviews = [...value.reviews];
              reviews[index] = { ...review, quote: e.target.value };
              onChange({ ...value, reviews });
            }}
            className={fieldClass}
            placeholder="Quote"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              value={review.name}
              onChange={(e) => {
                const reviews = [...value.reviews];
                reviews[index] = { ...review, name: e.target.value };
                onChange({ ...value, reviews });
              }}
              placeholder="Name"
            />
            <Input
              value={review.role}
              onChange={(e) => {
                const reviews = [...value.reviews];
                reviews[index] = { ...review, role: e.target.value };
                onChange({ ...value, reviews });
              }}
              placeholder="Role"
            />
          </div>
          <ImageUploadField
            value={review.image}
            onChange={(image) => {
              const reviews = [...value.reviews];
              reviews[index] = { ...review, image };
              onChange({ ...value, reviews });
            }}
            folder="group-by/reviews"
            label="Review image"
          />
          <ImageUploadField
            value={review.avatar}
            onChange={(avatar) => {
              const reviews = [...value.reviews];
              reviews[index] = { ...review, avatar };
              onChange({ ...value, reviews });
            }}
            folder="group-by/avatars"
            label="Avatar"
          />
        </div>
      ))}
    </div>
  );
}

export function GroupFaqEditor({
  value,
  onChange,
}: {
  value: GroupByContent["faq"];
  onChange: (v: GroupByContent["faq"]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Eyebrow</Label>
        <Input
          value={value.eyebrow}
          onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Contact link</Label>
        <Input
          value={value.contactHref}
          onChange={(e) =>
            onChange({ ...value, contactHref: e.target.value })
          }
        />
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={() =>
            onChange({
              ...value,
              items: [...value.items, { q: "New question?", a: "" }],
            })
          }
        >
          <PlusIcon className="size-3.5" />
          Add FAQ
        </Button>
      </div>
      {value.items.map((item, index) => (
        <div key={index} className="space-y-3 rounded-xl border border-border p-4">
          <div className="flex justify-between">
            <p className="text-xs font-semibold text-muted-foreground">
              FAQ {index + 1}
            </p>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() =>
                onChange({
                  ...value,
                  items: value.items.filter((_, i) => i !== index),
                })
              }
            >
              <Trash2Icon className="size-3.5 text-destructive" />
            </Button>
          </div>
          <Input
            value={item.q}
            onChange={(e) => {
              const items = [...value.items];
              items[index] = { ...item, q: e.target.value };
              onChange({ ...value, items });
            }}
            placeholder="Question"
          />
          <textarea
            rows={3}
            value={item.a}
            onChange={(e) => {
              const items = [...value.items];
              items[index] = { ...item, a: e.target.value };
              onChange({ ...value, items });
            }}
            className={fieldClass}
            placeholder="Answer"
          />
        </div>
      ))}
    </div>
  );
}

export function GroupPartnersEditor({
  value,
  onChange,
}: {
  value: GroupByContent["partners"];
  onChange: (v: GroupByContent["partners"]) => void;
}) {
  return (
    <TextArea
      label="Brand names (one per line)"
      value={value.brands.join("\n")}
      onChange={(v) =>
        onChange({
          brands: v
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
        })
      }
      rows={8}
    />
  );
}
