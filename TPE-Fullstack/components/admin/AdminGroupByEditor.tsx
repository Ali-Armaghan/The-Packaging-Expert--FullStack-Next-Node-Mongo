"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AgenticLoader } from "@/components/ui/AgenticLoader";
import type { SerializedGroupBy } from "@/types/groupBy";
import { AdminGroupByForm } from "./AdminGroupByForm";

export function AdminGroupByEditor({ groupId }: { groupId: string }) {
  const [group, setGroup] = useState<SerializedGroupBy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/group-by/${groupId}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load group");
      }
      setGroup(data.data as SerializedGroupBy);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load group");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-16 text-sm text-muted-foreground">
        <AgenticLoader size="sm" label="Loading" />
        Loading group…
      </div>
    );
  }

  if (!group) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Not found</AlertTitle>
        <AlertDescription>{error || "Group not found"}</AlertDescription>
      </Alert>
    );
  }

  return <AdminGroupByForm mode="edit" group={group} />;
}
