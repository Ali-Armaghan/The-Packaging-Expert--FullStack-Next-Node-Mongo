"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLinkIcon, PlusIcon, Trash2Icon } from "lucide-react";
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
import { cn } from "@/lib/utils";
import {
  HOME_SECTIONS,
  type HomePageContent,
  type HomeSectionKey,
} from "@/types/homePage";
import { ImageUploadField } from "./ImageUploadField";

const SECTION_LABELS: Record<HomeSectionKey, string> = {
  hero: "Hero / Banner",
  features: "Features",
  expertise: "Expertise",
  catalog: "Catalog",
  industries: "Industries",
  sustainability: "Sustainability",
  howItWorks: "How It Works",
  testimonials: "Testimonials",
  faq: "FAQ",
  instagram: "Instagram",
};

const fieldClass =
  "w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function AdminHomePageManager() {
  const [content, setContent] = useState<HomePageContent | null>(null);
  const [active, setActive] = useState<HomeSectionKey>("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/home");
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to load home page");
      }
      setContent(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load home page");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const sectionData = useMemo(() => {
    if (!content) return null;
    return content[active];
  }, [content, active]);

  const saveSection = async () => {
    if (!content) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/home/${active}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content[active]),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save section");
      }
      const saved = json.data?.data ?? json.data;
      setContent((prev) =>
        prev ? { ...prev, [active]: saved } : prev,
      );
      setSuccess(`${SECTION_LABELS[active]} saved.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save section");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-16 text-sm text-muted-foreground">
        <AgenticLoader size="sm" label="Loading home page" />
        Loading home page content...
      </div>
    );
  }

  if (!content || !sectionData) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Unable to load</AlertTitle>
        <AlertDescription>{error || "Home page content missing."}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Home Page</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit every homepage section. Each Save calls that section&apos;s API only.
            Header and footer stay separate.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            nativeButton={false}
            render={<Link href="/" target="_blank" />}
            variant="outline"
            className="gap-1.5"
          >
            <ExternalLinkIcon className="size-4" />
            Preview site
          </Button>
          <Button type="button" disabled={saving} onClick={() => void saveSection()}>
            {saving ? (
              <>
                <AgenticLoader size="sm" label="Saving" />
                Saving...
              </>
            ) : (
              `Save ${SECTION_LABELS[active]}`
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
      {success && (
        <Alert>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
        <Card className="h-fit xl:sticky xl:top-24">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Sections</CardTitle>
            <CardDescription>Save updates only the active section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {HOME_SECTIONS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActive(key);
                  setSuccess(null);
                  setError(null);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  active === key
                    ? "bg-primary/10 font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                {SECTION_LABELS[key]}
                {active === key && <Badge variant="secondary">Editing</Badge>}
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{SECTION_LABELS[active]}</CardTitle>
            <CardDescription>
              Changes apply after you click Save for this section.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {active === "hero" && (
              <HeroEditor
                value={content.hero}
                onChange={(v) => setContent((p) => (p ? { ...p, hero: v } : p))}
              />
            )}
            {active === "features" && (
              <FeaturesEditor value={content.features} onChange={(v) => setContent((p) => (p ? { ...p, features: v } : p))} />
            )}
            {active === "expertise" && (
              <ExpertiseEditor value={content.expertise} onChange={(v) => setContent((p) => (p ? { ...p, expertise: v } : p))} />
            )}
            {active === "catalog" && (
              <CatalogEditor value={content.catalog} onChange={(v) => setContent((p) => (p ? { ...p, catalog: v } : p))} />
            )}
            {active === "industries" && (
              <CardsSectionEditor
                titleField
                value={content.industries}
                onChange={(v) => setContent((p) => (p ? { ...p, industries: v } : p))}
                folder="home/industries"
              />
            )}
            {active === "sustainability" && (
              <SustainabilityEditor value={content.sustainability} onChange={(v) => setContent((p) => (p ? { ...p, sustainability: v } : p))} />
            )}
            {active === "howItWorks" && (
              <HowItWorksEditor value={content.howItWorks} onChange={(v) => setContent((p) => (p ? { ...p, howItWorks: v } : p))} />
            )}
            {active === "testimonials" && (
              <TestimonialsEditor value={content.testimonials} onChange={(v) => setContent((p) => (p ? { ...p, testimonials: v } : p))} />
            )}
            {active === "faq" && (
              <FaqEditor value={content.faq} onChange={(v) => setContent((p) => (p ? { ...p, faq: v } : p))} />
            )}
            {active === "instagram" && (
              <InstagramEditor value={content.instagram} onChange={(v) => setContent((p) => (p ? { ...p, instagram: v } : p))} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TextArea({
  id,
  label,
  value,
  onChange,
  rows = 3,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
      />
    </div>
  );
}

function HeroEditor({
  value,
  onChange,
}: {
  value: HomePageContent["hero"];
  onChange: (v: HomePageContent["hero"]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="hero-title">Title</Label>
        <Input id="hero-title" value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} />
      </div>
      <TextArea id="hero-sub" label="Subtitle" value={value.subtitle} onChange={(v) => onChange({ ...value, subtitle: v })} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Primary CTA label</Label>
          <Input value={value.primaryCta.label} onChange={(e) => onChange({ ...value, primaryCta: { ...value.primaryCta, label: e.target.value } })} />
        </div>
        <div className="space-y-2">
          <Label>Primary CTA link</Label>
          <Input value={value.primaryCta.href} onChange={(e) => onChange({ ...value, primaryCta: { ...value.primaryCta, href: e.target.value } })} />
        </div>
        <div className="space-y-2">
          <Label>Secondary CTA label</Label>
          <Input value={value.secondaryCta.label} onChange={(e) => onChange({ ...value, secondaryCta: { ...value.secondaryCta, label: e.target.value } })} />
        </div>
        <div className="space-y-2">
          <Label>Secondary CTA link</Label>
          <Input value={value.secondaryCta.href} onChange={(e) => onChange({ ...value, secondaryCta: { ...value.secondaryCta, href: e.target.value } })} />
        </div>
      </div>
      <ImageUploadField value={value.image} onChange={(image) => onChange({ ...value, image })} folder="home/hero" label="Hero image" />
      <div className="space-y-2">
        <Label>Image alt</Label>
        <Input value={value.imageAlt} onChange={(e) => onChange({ ...value, imageAlt: e.target.value })} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Social proof text</Label>
          <Input value={value.socialProofText} onChange={(e) => onChange({ ...value, socialProofText: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Rating label</Label>
          <Input value={value.ratingLabel} onChange={(e) => onChange({ ...value, ratingLabel: e.target.value })} />
        </div>
      </div>
      <TextArea
        id="hero-logos"
        label="Brand logos (one per line)"
        value={value.brandLogos.join("\n")}
        onChange={(v) =>
          onChange({
            ...value,
            brandLogos: v.split("\n").map((s) => s.trim()).filter(Boolean),
          })
        }
      />
    </div>
  );
}

function FeaturesEditor({
  value,
  onChange,
}: {
  value: HomePageContent["features"];
  onChange: (v: HomePageContent["features"]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} />
      </div>
      <TextArea
        id="feat-highlights"
        label="Highlights (one per line, rotating words)"
        value={value.highlights.join("\n")}
        onChange={(v) =>
          onChange({
            ...value,
            highlights: v.split("\n").map((s) => s.trim()).filter(Boolean),
          })
        }
      />
      <TextArea id="feat-sub" label="Subtitle" value={value.subtitle} onChange={(v) => onChange({ ...value, subtitle: v })} />
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Feature cards</p>
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
                  id: newId("feature"),
                  title: "New feature",
                  description: "",
                  icon: "headset",
                  sortOrder: value.items.length,
                  isActive: true,
                },
              ],
            })
          }
        >
          <PlusIcon className="size-3.5" /> Add
        </Button>
      </div>
      {value.items.map((item, index) => (
        <div key={item.id} className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-4">
          <div className="flex items-center justify-between gap-2">
            <Label>Card {index + 1}</Label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs">
                <Checkbox
                  checked={item.isActive}
                  onCheckedChange={(v) =>
                    onChange({
                      ...value,
                      items: value.items.map((row, i) =>
                        i === index ? { ...row, isActive: v === true } : row,
                      ),
                    })
                  }
                />
                Active
              </label>
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
                <Trash2Icon />
              </Button>
            </div>
          </div>
          <Input
            value={item.title}
            onChange={(e) =>
              onChange({
                ...value,
                items: value.items.map((row, i) =>
                  i === index ? { ...row, title: e.target.value } : row,
                ),
              })
            }
            placeholder="Title"
          />
          <textarea
            className={fieldClass}
            rows={2}
            value={item.description}
            onChange={(e) =>
              onChange({
                ...value,
                items: value.items.map((row, i) =>
                  i === index ? { ...row, description: e.target.value } : row,
                ),
              })
            }
            placeholder="Description"
          />
          <Select
            value={item.icon}
            onValueChange={(icon) => {
              if (!icon) return;
              onChange({
                ...value,
                items: value.items.map((row, i) =>
                  i === index
                    ? {
                        ...row,
                        icon: icon as HomePageContent["features"]["items"][number]["icon"],
                      }
                    : row,
                ),
              });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="headset">Headset</SelectItem>
              <SelectItem value="journey">Journey</SelectItem>
              <SelectItem value="ruler">Ruler</SelectItem>
              <SelectItem value="promise">Promise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}

function ExpertiseEditor({
  value,
  onChange,
}: {
  value: HomePageContent["expertise"];
  onChange: (v: HomePageContent["expertise"]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} />
      </div>
      <TextArea id="exp-desc" label="Description" value={value.description} onChange={(v) => onChange({ ...value, description: v })} rows={5} />
      <ImageUploadField value={value.image} onChange={(image) => onChange({ ...value, image })} folder="home/expertise" label="Section image" />
      <div className="space-y-2">
        <Label>Image alt</Label>
        <Input value={value.imageAlt} onChange={(e) => onChange({ ...value, imageAlt: e.target.value })} />
      </div>
    </div>
  );
}

function CardListEditor({
  cards,
  onChange,
  folder,
}: {
  cards: HomePageContent["catalog"]["cards"];
  onChange: (cards: HomePageContent["catalog"]["cards"]) => void;
  folder: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Cards</p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={() =>
            onChange([
              ...cards,
              {
                id: newId("card"),
                title: "New card",
                description: "",
                image: "",
                href: "/",
                sortOrder: cards.length,
                isActive: true,
              },
            ])
          }
        >
          <PlusIcon className="size-3.5" /> Add card
        </Button>
      </div>
      {cards.map((card, index) => (
        <div key={card.id} className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-4">
          <div className="flex items-center justify-between">
            <Label>Card {index + 1}</Label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs">
                <Checkbox
                  checked={card.isActive}
                  onCheckedChange={(v) =>
                    onChange(
                      cards.map((row, i) =>
                        i === index ? { ...row, isActive: v === true } : row,
                      ),
                    )
                  }
                />
                Active
              </label>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={() => onChange(cards.filter((_, i) => i !== index))}
              >
                <Trash2Icon />
              </Button>
            </div>
          </div>
          <Input
            value={card.title}
            onChange={(e) =>
              onChange(
                cards.map((row, i) =>
                  i === index ? { ...row, title: e.target.value } : row,
                ),
              )
            }
            placeholder="Title"
          />
          <textarea
            className={fieldClass}
            rows={2}
            value={card.description}
            onChange={(e) =>
              onChange(
                cards.map((row, i) =>
                  i === index ? { ...row, description: e.target.value } : row,
                ),
              )
            }
            placeholder="Description"
          />
          <Input
            value={card.href}
            onChange={(e) =>
              onChange(
                cards.map((row, i) =>
                  i === index ? { ...row, href: e.target.value } : row,
                ),
              )
            }
            placeholder="/path"
          />
          <ImageUploadField
            value={card.image}
            onChange={(image) =>
              onChange(
                cards.map((row, i) => (i === index ? { ...row, image } : row)),
              )
            }
            folder={folder}
            label="Card image"
          />
        </div>
      ))}
    </div>
  );
}

function CatalogEditor({
  value,
  onChange,
}: {
  value: HomePageContent["catalog"];
  onChange: (v: HomePageContent["catalog"]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} />
      </div>
      <TextArea id="cat-sub" label="Subtitle" value={value.subtitle} onChange={(v) => onChange({ ...value, subtitle: v })} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Browse CTA label</Label>
          <Input value={value.browseCta.label} onChange={(e) => onChange({ ...value, browseCta: { ...value.browseCta, label: e.target.value } })} />
        </div>
        <div className="space-y-2">
          <Label>Browse CTA link</Label>
          <Input value={value.browseCta.href} onChange={(e) => onChange({ ...value, browseCta: { ...value.browseCta, href: e.target.value } })} />
        </div>
      </div>
      <CardListEditor cards={value.cards} onChange={(cards) => onChange({ ...value, cards })} folder="home/catalog" />
      <div className="space-y-3 rounded-lg border border-dashed border-border p-4">
        <p className="text-sm font-medium">CTA card</p>
        <TextArea
          id="cta-lines"
          label="Title lines (one per line)"
          value={value.ctaCard.titleLines.join("\n")}
          onChange={(v) =>
            onChange({
              ...value,
              ctaCard: {
                ...value.ctaCard,
                titleLines: v.split("\n").map((s) => s.trim()).filter(Boolean),
              },
            })
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            value={value.ctaCard.buttonLabel}
            onChange={(e) =>
              onChange({
                ...value,
                ctaCard: { ...value.ctaCard, buttonLabel: e.target.value },
              })
            }
            placeholder="Button label"
          />
          <Input
            value={value.ctaCard.buttonHref}
            onChange={(e) =>
              onChange({
                ...value,
                ctaCard: { ...value.ctaCard, buttonHref: e.target.value },
              })
            }
            placeholder="Button href"
          />
        </div>
      </div>
    </div>
  );
}

function CardsSectionEditor({
  value,
  onChange,
  folder,
  titleField,
}: {
  value: HomePageContent["industries"];
  onChange: (v: HomePageContent["industries"]) => void;
  folder: string;
  titleField?: boolean;
}) {
  return (
    <div className="space-y-4">
      {titleField && (
        <>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} />
          </div>
          <TextArea id="ind-sub" label="Subtitle" value={value.subtitle} onChange={(v) => onChange({ ...value, subtitle: v })} />
        </>
      )}
      <CardListEditor cards={value.cards} onChange={(cards) => onChange({ ...value, cards })} folder={folder} />
    </div>
  );
}

function SustainabilityEditor({
  value,
  onChange,
}: {
  value: HomePageContent["sustainability"];
  onChange: (v: HomePageContent["sustainability"]) => void;
}) {
  return (
    <CardListEditor
      cards={value.cards}
      onChange={(cards) => onChange({ ...value, cards })}
      folder="home/sustainability"
    />
  );
}

function HowItWorksEditor({
  value,
  onChange,
}: {
  value: HomePageContent["howItWorks"];
  onChange: (v: HomePageContent["howItWorks"]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} />
      </div>
      <p className="text-sm font-medium">Tabs</p>
      {value.tabs.map((tab, index) => (
        <div key={tab.id} className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-4">
          <div className="flex items-center justify-between">
            <Label>Tab {index + 1}</Label>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() =>
                onChange({ ...value, tabs: value.tabs.filter((_, i) => i !== index) })
              }
            >
              <Trash2Icon />
            </Button>
          </div>
          <Input
            value={tab.label}
            onChange={(e) =>
              onChange({
                ...value,
                tabs: value.tabs.map((row, i) =>
                  i === index ? { ...row, label: e.target.value } : row,
                ),
              })
            }
            placeholder="Tab label"
          />
          <ImageUploadField
            value={tab.image}
            onChange={(image) =>
              onChange({
                ...value,
                tabs: value.tabs.map((row, i) =>
                  i === index ? { ...row, image } : row,
                ),
              })
            }
            folder="home/process"
            label="Tab image"
          />
          <TextArea
            id={`steps-${tab.id}`}
            label="Steps (title | description per line)"
            value={tab.steps.map((s) => `${s.title} | ${s.description}`).join("\n")}
            onChange={(v) =>
              onChange({
                ...value,
                tabs: value.tabs.map((row, i) =>
                  i === index
                    ? {
                        ...row,
                        steps: v
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean)
                          .map((line, sIndex) => {
                            const [title, ...rest] = line.split("|");
                            return {
                              id: row.steps[sIndex]?.id || newId("step"),
                              title: (title || "").trim(),
                              description: rest.join("|").trim(),
                              icon: row.steps[sIndex]?.icon || "choose",
                            };
                          }),
                      }
                    : row,
                ),
              })
            }
            rows={5}
          />
        </div>
      ))}
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() =>
          onChange({
            ...value,
            tabs: [
              ...value.tabs,
              {
                id: newId("tab"),
                label: "New tab",
                image: "",
                steps: [],
                sortOrder: value.tabs.length,
                isActive: true,
              },
            ],
          })
        }
      >
        Add tab
      </Button>
      <p className="text-sm font-medium">Benefits</p>
      {value.benefits.map((item, index) => (
        <div key={item.id} className="grid gap-2 rounded-lg border border-border/60 p-3 sm:grid-cols-[1fr_1fr_auto]">
          <Input
            value={item.title}
            onChange={(e) =>
              onChange({
                ...value,
                benefits: value.benefits.map((row, i) =>
                  i === index ? { ...row, title: e.target.value } : row,
                ),
              })
            }
            placeholder="Title"
          />
          <Input
            value={item.description}
            onChange={(e) =>
              onChange({
                ...value,
                benefits: value.benefits.map((row, i) =>
                  i === index ? { ...row, description: e.target.value } : row,
                ),
              })
            }
            placeholder="Description"
          />
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={() =>
              onChange({
                ...value,
                benefits: value.benefits.filter((_, i) => i !== index),
              })
            }
          >
            <Trash2Icon />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() =>
          onChange({
            ...value,
            benefits: [
              ...value.benefits,
              {
                id: newId("benefit"),
                title: "New benefit",
                description: "",
                icon: "minimum",
                sortOrder: value.benefits.length,
                isActive: true,
              },
            ],
          })
        }
      >
        Add benefit
      </Button>
    </div>
  );
}

function TestimonialsEditor({
  value,
  onChange,
}: {
  value: HomePageContent["testimonials"];
  onChange: (v: HomePageContent["testimonials"]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} />
      </div>
      <TextArea id="t-sub" label="Subtitle" value={value.subtitle} onChange={(v) => onChange({ ...value, subtitle: v })} />
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Quotes</p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            onChange({
              ...value,
              items: [
                ...value.items,
                {
                  id: newId("testimonial"),
                  quote: "",
                  name: "",
                  role: "",
                  avatar: "",
                  rating: 5,
                  sortOrder: value.items.length,
                  isActive: true,
                },
              ],
            })
          }
        >
          Add quote
        </Button>
      </div>
      {value.items.map((item, index) => (
        <div key={item.id} className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-4">
          <div className="flex justify-end">
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
              <Trash2Icon />
            </Button>
          </div>
          <TextArea
            id={`quote-${item.id}`}
            label="Quote"
            value={item.quote}
            onChange={(v) =>
              onChange({
                ...value,
                items: value.items.map((row, i) =>
                  i === index ? { ...row, quote: v } : row,
                ),
              })
            }
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              value={item.name}
              onChange={(e) =>
                onChange({
                  ...value,
                  items: value.items.map((row, i) =>
                    i === index ? { ...row, name: e.target.value } : row,
                  ),
                })
              }
              placeholder="Name"
            />
            <Input
              value={item.role}
              onChange={(e) =>
                onChange({
                  ...value,
                  items: value.items.map((row, i) =>
                    i === index ? { ...row, role: e.target.value } : row,
                  ),
                })
              }
              placeholder="Role"
            />
          </div>
          <ImageUploadField
            value={item.avatar}
            onChange={(avatar) =>
              onChange({
                ...value,
                items: value.items.map((row, i) =>
                  i === index ? { ...row, avatar } : row,
                ),
              })
            }
            folder="home/testimonials"
            label="Avatar"
            square
          />
        </div>
      ))}
    </div>
  );
}

function FaqEditor({
  value,
  onChange,
}: {
  value: HomePageContent["faq"];
  onChange: (v: HomePageContent["faq"]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Questions</p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            onChange({
              ...value,
              items: [
                ...value.items,
                {
                  id: newId("faq"),
                  question: "",
                  answer: "",
                  sortOrder: value.items.length,
                  isActive: true,
                },
              ],
            })
          }
        >
          Add FAQ
        </Button>
      </div>
      {value.items.map((item, index) => (
        <div key={item.id} className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-4">
          <div className="flex items-center justify-between">
            <Label>FAQ {index + 1}</Label>
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
              <Trash2Icon />
            </Button>
          </div>
          <Input
            value={item.question}
            onChange={(e) =>
              onChange({
                ...value,
                items: value.items.map((row, i) =>
                  i === index ? { ...row, question: e.target.value } : row,
                ),
              })
            }
            placeholder="Question"
          />
          <textarea
            className={fieldClass}
            rows={3}
            value={item.answer}
            onChange={(e) =>
              onChange({
                ...value,
                items: value.items.map((row, i) =>
                  i === index ? { ...row, answer: e.target.value } : row,
                ),
              })
            }
            placeholder="Answer"
          />
        </div>
      ))}
    </div>
  );
}

function InstagramEditor({
  value,
  onChange,
}: {
  value: HomePageContent["instagram"];
  onChange: (v: HomePageContent["instagram"]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Handle</Label>
          <Input value={value.handle} onChange={(e) => onChange({ ...value, handle: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Profile URL</Label>
          <Input value={value.profileUrl} onChange={(e) => onChange({ ...value, profileUrl: e.target.value })} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Posts</p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            onChange({
              ...value,
              posts: [
                ...value.posts,
                {
                  id: newId("post"),
                  image: "",
                  alt: "",
                  href: value.profileUrl || "/",
                  sortOrder: value.posts.length,
                  isActive: true,
                },
              ],
            })
          }
        >
          Add post
        </Button>
      </div>
      {value.posts.map((post, index) => (
        <div key={post.id} className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-4">
          <div className="flex justify-end">
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() =>
                onChange({
                  ...value,
                  posts: value.posts.filter((_, i) => i !== index),
                })
              }
            >
              <Trash2Icon />
            </Button>
          </div>
          <ImageUploadField
            value={post.image}
            onChange={(image) =>
              onChange({
                ...value,
                posts: value.posts.map((row, i) =>
                  i === index ? { ...row, image } : row,
                ),
              })
            }
            folder="home/instagram"
            label="Post image"
          />
          <Input
            value={post.alt}
            onChange={(e) =>
              onChange({
                ...value,
                posts: value.posts.map((row, i) =>
                  i === index ? { ...row, alt: e.target.value } : row,
                ),
              })
            }
            placeholder="Alt text"
          />
          <Input
            value={post.href}
            onChange={(e) =>
              onChange({
                ...value,
                posts: value.posts.map((row, i) =>
                  i === index ? { ...row, href: e.target.value } : row,
                ),
              })
            }
            placeholder="Link"
          />
        </div>
      ))}
    </div>
  );
}
