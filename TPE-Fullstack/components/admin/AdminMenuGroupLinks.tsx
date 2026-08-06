"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLinkIcon, Loader2Icon, SaveIcon } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MENU_LINK_LABELS } from "@/lib/menuLinks/catalog";
import type { MenuCatalogItem, MenuLinkKey } from "@/types/menuLinks";

type GroupOption = { id: string; name: string; slug: string };

type AdminMenuGroupLinksProps = {
  menuKey: MenuLinkKey;
  /** Optional note under the title (e.g. industries also has CMS below). */
  description?: string;
};

const NONE = "__none__";

export function AdminMenuGroupLinks({
  menuKey,
  description,
}: AdminMenuGroupLinksProps) {
  const [catalog, setCatalog] = useState<MenuCatalogItem[]>([]);
  const [groups, setGroups] = useState<GroupOption[]>([]);
  const [links, setLinks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/menu-links/${menuKey}`);
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to load menu links");
        }
        if (!cancelled) {
          setCatalog(json.data.catalog ?? []);
          setGroups(json.data.groups ?? []);
          setLinks(json.data.links ?? {});
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [menuKey]);

  const linkedCount = useMemo(
    () => Object.values(links).filter(Boolean).length,
    [links],
  );

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/menu-links/${menuKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ links }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save");
      }
      setLinks(json.data.links ?? {});
      setSuccess("Menu links saved. Public nav will use Group By URLs.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {MENU_LINK_LABELS[menuKey]} menu
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {description ??
              "Link each menu item to a Group By page. Users open that group URL on click."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {linkedCount}/{catalog.length} linked
          </Badge>
          <Button onClick={() => void handleSave()} disabled={saving || loading}>
            {saving ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <SaveIcon className="size-4" />
            )}
            Save links
          </Button>
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

      {loading ? (
        <div className="flex items-center gap-2 py-12 text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" />
          Loading menu…
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Menu items</CardTitle>
            <CardDescription>
              Select a Group By for each row. Leave as “Default URL” to keep the
              original path (e.g. coming soon).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {catalog.length === 0 ? (
              <p className="text-sm text-muted-foreground">No menu items.</p>
            ) : (
              catalog.map((item) => {
                const slug = links[item.id] ?? "";
                const previewHref = slug ? `/${slug}` : item.href;
                return (
                  <div
                    key={item.id}
                    className="grid gap-3 rounded-lg border border-border/70 p-3 sm:grid-cols-[1fr_220px_auto] sm:items-center"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{item.title}</p>
                      {item.description ? (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      ) : null}
                      <p className="mt-1 truncate text-[11px] text-muted-foreground">
                        Opens: {previewHref}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Group By</Label>
                      <Select
                        value={slug || NONE}
                        onValueChange={(value) => {
                          if (value == null) return;
                          const next = value === NONE ? "" : value;
                          setLinks((prev) => {
                            const copy = { ...prev };
                            if (!next) delete copy[item.id];
                            else copy[item.id] = next;
                            return copy;
                          });
                          setSuccess(null);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NONE}>Default URL</SelectItem>
                          {groups.map((group) => (
                            <SelectItem key={group.id} value={group.slug}>
                              {group.name} (/{group.slug})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Link
                      href={previewHref}
                      target="_blank"
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium hover:bg-muted"
                    >
                      <ExternalLinkIcon className="size-3.5" />
                      Preview
                    </Link>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
