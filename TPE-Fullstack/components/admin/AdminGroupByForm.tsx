"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeftIcon, ExternalLinkIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { getGroupByContentDefaults } from "@/lib/groupBy/defaults";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";
import type { GroupByContent, SerializedGroupBy } from "@/types/groupBy";
import type { EliteSectionKey } from "@/types/elitePage";
import {
  GroupCatalogEditor,
  GroupFaqEditor,
  GroupFeaturesEditor,
  GroupHeroEditor,
  GroupIndustriesEditor,
  GroupPartnersEditor,
  GroupProcessEditor,
  GroupStatsEditor,
  GroupTestimonialsEditor,
  GroupWhyUsEditor,
} from "./AdminGroupBySectionEditors";

const SECTION_LABELS: Record<EliteSectionKey, string> = {
  hero: "Hero / Banner",
  catalog: "Catalog",
  whyUs: "Why Us",
  industries: "Industries",
  process: "Process",
  features: "Features",
  stats: "Stats",
  testimonials: "Testimonials",
  faq: "FAQ",
  partners: "Partners",
};

const SECTIONS = Object.keys(SECTION_LABELS) as EliteSectionKey[];

type AdminGroupByFormProps =
  | { mode: "create" }
  | { mode: "edit"; group: SerializedGroupBy };

export function AdminGroupByForm(props: AdminGroupByFormProps) {
  const router = useRouter();
  const isEdit = props.mode === "edit";
  const initial = isEdit ? props.group : null;

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);
  const [content, setContent] = useState<GroupByContent>(
    () => initial?.content ?? getGroupByContentDefaults(""),
  );
  const [active, setActive] = useState<EliteSectionKey>("hero");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const publicSlug = slug || slugify(name);

  const sectionData = useMemo(() => content[active], [content, active]);

  const updateSection = <K extends EliteSectionKey>(
    key: K,
    value: GroupByContent[K],
  ) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const saveMeta = async () => {
    if (props.mode !== "edit") return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/group-by/${props.group.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: slugify(slug || name),
          isActive,
          sortOrder,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save settings");
      }
      setSlug(data.data.slug);
      setSuccess("Group settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const saveActiveSection = async () => {
    if (props.mode !== "edit") return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(
        `/api/admin/group-by/${props.group.id}/${active}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(content[active]),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save section");
      }
      if (data.data?.group?.content) {
        setContent(data.data.group.content);
      }
      setSuccess(`${SECTION_LABELS[active]} saved.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save section");
    } finally {
      setSaving(false);
    }
  };

  const createGroup = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const nextSlug = slugify(slug || name);
      if (!name.trim() || !nextSlug) {
        throw new Error("Name and slug are required");
      }

      // Keep brand in sync with group name if still default-ish
      const payloadContent: GroupByContent = {
        ...content,
        hero: {
          ...content.hero,
          brand: content.hero.brand || name,
        },
      };

      const res = await fetch("/api/admin/group-by", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: nextSlug,
          isActive,
          sortOrder,
          content: payloadContent,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create group");
      }
      router.push(`/admin/group-by/${data.data.id}/edit`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create group");
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Button
            nativeButton={false}
            render={<Link href="/admin/group-by" />}
            variant="ghost"
            size="sm"
            className="-ml-2 gap-1.5"
          >
            <ArrowLeftIcon className="size-3.5" />
            All groups
          </Button>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {isEdit ? `Edit · ${name || "Group"}` : "Create Group By page"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Same elite page structure as Home CMS — fill every section
            {isEdit
              ? ". Save settings or the active section."
              : ", then create the public page."}
          </p>
          {publicSlug ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Public URL:{" "}
              <span className="font-medium text-foreground">/{publicSlug}</span>
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {isEdit && publicSlug ? (
            <Button
              nativeButton={false}
              render={<Link href={`/${publicSlug}`} target="_blank" />}
              variant="outline"
              className="gap-1.5"
            >
              <ExternalLinkIcon className="size-3.5" />
              View live
            </Button>
          ) : null}
          {isEdit ? (
            <>
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => void saveMeta()}
              >
                Save settings
              </Button>
              <Button
                type="button"
                disabled={saving}
                onClick={() => void saveActiveSection()}
              >
                {saving
                  ? "Saving…"
                  : `Save ${SECTION_LABELS[active]}`}
              </Button>
            </>
          ) : (
            <Button
              type="button"
              disabled={saving}
              onClick={() => void createGroup()}
            >
              {saving ? "Creating…" : "Create group page"}
            </Button>
          )}
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {success ? (
        <Alert>
          <AlertTitle>Saved</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Group settings</CardTitle>
          <CardDescription>Name, slug, and visibility.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                required
                value={name}
                onChange={(e) => {
                  const next = e.target.value;
                  setName(next);
                  if (!slugTouched) setSlug(slugify(next));
                  setContent((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      brand:
                        !prev.hero.brand || prev.hero.brand === name
                          ? next
                          : prev.hero.brand,
                    },
                  }));
                }}
                placeholder="Mailer Boxes"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug (URL)</Label>
              <Input
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="mailer-boxes"
              />
            </div>
            <div className="space-y-2">
              <Label>Sort order</Label>
              <Input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={isActive}
              onCheckedChange={(v) => setIsActive(v === true)}
            />
            Active (public at /{publicSlug || "slug"})
          </label>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {SECTIONS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setActive(key);
              setSuccess(null);
            }}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition",
              active === key
                ? "bg-primary text-white ring-primary"
                : "bg-muted text-muted-foreground ring-transparent hover:text-foreground",
            )}
          >
            {SECTION_LABELS[key]}
            {active === key ? (
              <Badge variant="secondary" className="text-[10px]">
                Editing
              </Badge>
            ) : null}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{SECTION_LABELS[active]}</CardTitle>
          <CardDescription>
            {isEdit
              ? "Edit this section, then click Save for this section only."
              : "Fill all sections below, then Create group page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {active === "hero" && (
            <GroupHeroEditor
              value={content.hero}
              onChange={(v) => updateSection("hero", v)}
            />
          )}
          {active === "catalog" && (
            <GroupCatalogEditor
              value={content.catalog}
              onChange={(v) => updateSection("catalog", v)}
            />
          )}
          {active === "whyUs" && (
            <GroupWhyUsEditor
              value={content.whyUs}
              onChange={(v) => updateSection("whyUs", v)}
            />
          )}
          {active === "industries" && (
            <GroupIndustriesEditor
              value={content.industries}
              onChange={(v) => updateSection("industries", v)}
            />
          )}
          {active === "process" && (
            <GroupProcessEditor
              value={content.process}
              onChange={(v) => updateSection("process", v)}
            />
          )}
          {active === "features" && (
            <GroupFeaturesEditor
              value={content.features}
              onChange={(v) => updateSection("features", v)}
            />
          )}
          {active === "stats" && (
            <GroupStatsEditor
              value={content.stats}
              onChange={(v) => updateSection("stats", v)}
            />
          )}
          {active === "testimonials" && (
            <GroupTestimonialsEditor
              value={content.testimonials}
              onChange={(v) => updateSection("testimonials", v)}
            />
          )}
          {active === "faq" && (
            <GroupFaqEditor
              value={content.faq}
              onChange={(v) => updateSection("faq", v)}
            />
          )}
          {active === "partners" && (
            <GroupPartnersEditor
              value={content.partners}
              onChange={(v) => updateSection("partners", v)}
            />
          )}
          {!sectionData ? null : null}
        </CardContent>
      </Card>

      {!isEdit ? (
        <div className="flex justify-end">
          <Button
            type="button"
            disabled={saving}
            onClick={() => void createGroup()}
          >
            {saving ? "Creating…" : "Create group page"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
