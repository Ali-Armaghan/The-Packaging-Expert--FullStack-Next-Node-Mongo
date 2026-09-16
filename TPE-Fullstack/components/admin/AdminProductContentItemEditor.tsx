"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ExternalLinkIcon } from "lucide-react";
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
import type {
  SerializedContentItem,
  SerializedContentSection,
  SerializedContentTab,
} from "@/lib/productContentTab/serialize";
import { slugify } from "@/lib/slug";
import { ImageUploadField } from "./ImageUploadField";
import { RichTextEditor } from "./RichTextEditor";
import { fetchContentTab, parseAdminJson } from "./content-tabs/api";
import { ContentTabsChrome } from "./content-tabs/ContentTabsChrome";

type AdminProductContentItemEditorProps = {
  tabId: string;
  sectionId: string;
  itemId?: string;
};

export function AdminProductContentItemEditor({
  tabId,
  sectionId,
  itemId,
}: AdminProductContentItemEditorProps) {
  const router = useRouter();
  const isNew = !itemId;
  const [tab, setTab] = useState<SerializedContentTab | null>(null);
  const [section, setSection] = useState<SerializedContentSection | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const sectionHref = `/admin/products/content-tabs/${tabId}/sections/${sectionId}`;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await fetchContentTab(tabId);
      const foundSection =
        next.sections.find((row) => row.id === sectionId) ?? null;
      const foundItem = itemId
        ? foundSection?.items.find((row) => row.id === itemId) ?? null
        : null;
      setTab(next);
      setSection(foundSection);
      if (itemId && !foundItem) {
        throw new Error("Item not found");
      }
      if (foundItem) {
        setTitle(foundItem.title);
        setSlug(foundItem.slug);
        setImage(foundItem.image);
        setBody(foundItem.body);
        setIsActive(foundItem.isActive);
        setSlugTouched(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load item");
      setTab(null);
      setSection(null);
    } finally {
      setLoading(false);
    }
  }, [itemId, sectionId, tabId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        title,
        slug: slug || slugify(title),
        image,
        body,
        isActive,
      };
      if (isNew) {
        const res = await fetch(
          `/api/admin/product-content-tabs/${tabId}/sections/${sectionId}/items`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );
        const result = await parseAdminJson<{
          tab: SerializedContentTab;
          item: SerializedContentItem;
        }>(res);
        router.replace(
          `/admin/products/content-tabs/${tabId}/sections/${sectionId}/items/${result.item.id}`,
        );
        return;
      }
      const res = await fetch(
        `/api/admin/product-content-tabs/${tabId}/sections/${sectionId}/items/${itemId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const next = await parseAdminJson<SerializedContentTab>(res);
      const foundSection =
        next.sections.find((row) => row.id === sectionId) ?? null;
      const foundItem =
        foundSection?.items.find((row) => row.id === itemId) ?? null;
      setTab(next);
      setSection(foundSection);
      if (foundItem) {
        setTitle(foundItem.title);
        setSlug(foundItem.slug);
        setImage(foundItem.image);
        setBody(foundItem.body);
        setIsActive(foundItem.isActive);
      }
      setSuccess("Article saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <AgenticLoader label="Loading item" />
      </div>
    );
  }

  if (!tab || !section) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{isNew ? "Section not found" : "Item not found"}</AlertTitle>
        <AlertDescription>
          {error || "This record no longer exists."}
        </AlertDescription>
      </Alert>
    );
  }

  const publicHref = slug ? `/info/${slug}` : null;

  return (
    <div className="space-y-6">
      <ContentTabsChrome
        step={4}
        title={isNew ? "New item" : title || "Edit item"}
        description="Write the article customers see when they click this item on the product page."
        crumbs={[
          { href: "/admin/products/content-tabs", label: "Tabs" },
          { href: `/admin/products/content-tabs/${tabId}`, label: tab.name },
          { href: sectionHref, label: section.title },
          { label: isNew ? "New item" : title || "Item" },
        ]}
        actions={
          <>
            <Button
              nativeButton={false}
              variant="outline"
              render={<Link href={sectionHref} />}
            >
              Back to items
            </Button>
            {publicHref ? (
              <Button
                nativeButton={false}
                variant="outline"
                className="gap-1.5"
                render={
                  <Link href={publicHref} target="_blank" rel="noreferrer" />
                }
              >
                <ExternalLinkIcon className="size-4" />
                View page
              </Button>
            ) : null}
          </>
        }
      />

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
          <CardTitle>{isNew ? "Create item" : "Item article"}</CardTitle>
          <CardDescription>
            Name and image appear on the product card. The article is the public
            page at /info/{slug || "slug"}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={(e) => void handleSubmit(e)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="item-title">Item name</Label>
                <Input
                  id="item-title"
                  required
                  value={title}
                  placeholder="230 GSM Cardstock"
                  onChange={(event) => {
                    const next = event.target.value;
                    setTitle(next);
                    if (!slugTouched) setSlug(slugify(next));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-slug">Article slug</Label>
                <Input
                  id="item-slug"
                  value={slug}
                  placeholder="230-gsm-cardstock"
                  onChange={(event) => {
                    setSlugTouched(true);
                    setSlug(event.target.value);
                  }}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={isActive}
                onCheckedChange={(value) => setIsActive(value === true)}
              />
              Active
            </label>
            <div className="space-y-2">
              <Label>Image</Label>
              <ImageUploadField
                value={image}
                folder="product-info"
                onChange={setImage}
              />
            </div>
            <div className="space-y-2">
              <Label>Article</Label>
              <RichTextEditor
                value={body}
                onChange={setBody}
                placeholder="Write the item article…"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                nativeButton={false}
                variant="outline"
                render={<Link href={sectionHref} />}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving
                  ? "Saving…"
                  : isNew
                    ? "Create item"
                    : "Save article"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
