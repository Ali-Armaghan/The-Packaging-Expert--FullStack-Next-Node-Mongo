"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import { Trash2Icon, UserPlusIcon } from "lucide-react";
import { adminNavSections } from "@/constants/adminNav";
import { isSuperAdmin } from "@/lib/auth/permissions";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin";
  permissions: string[];
  isActive: boolean;
  createdAt?: string;
};

export function AdminUsersManager() {
  const { data: session } = useSession();
  const actorIsSuper = isSuperAdmin(session?.user?.role);
  const grantablePermissions = useMemo(() => {
    if (actorIsSuper) {
      return new Set(adminNavSections.flatMap((s) => s.items.map((i) => i.id)));
    }
    return new Set(session?.user?.permissions ?? []);
  }, [actorIsSuper, session?.user?.permissions]);

  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "superadmin">("admin");
  const [permissions, setPermissions] = useState<string[]>([]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load users");
      }
      setUsers(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const togglePermission = (id: string, checked: boolean) => {
    if (!grantablePermissions.has(id)) return;
    setPermissions((prev) =>
      checked ? Array.from(new Set([...prev, id])) : prev.filter((p) => p !== id),
    );
  };

  const toggleSection = (sectionItemIds: string[]) => {
    const allowedIds = sectionItemIds.filter((id) =>
      grantablePermissions.has(id),
    );
    if (allowedIds.length === 0) return;

    const allSelected = allowedIds.every((id) => permissions.includes(id));
    setPermissions((prev) => {
      if (allSelected) {
        return prev.filter((id) => !allowedIds.includes(id));
      }
      return Array.from(new Set([...prev, ...allowedIds]));
    });
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("admin");
    setPermissions([]);
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          permissions: role === "superadmin" ? [] : permissions,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create user");
      }

      setSuccess(`User ${data.data.email} created`);
      resetForm();
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete user");
      }
      setSuccess("User deleted");
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="secondary" className="mb-2">
          Access control
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Create admin users and assign sidebar section access (RBAC).
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="border-primary/20 bg-primary-light/60 text-foreground">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlusIcon className="size-4 text-primary" />
            Create user
          </CardTitle>
          <CardDescription>
            Select sidebar sections/items this user can access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="user-name">Name</Label>
                <Input
                  id="user-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Jane Admin"
                  className="h-10 bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-email">Email</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="jane@company.com"
                  className="h-10 bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-password">Password</Label>
                <Input
                  id="user-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Min 8 characters"
                  className="h-10 bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={role}
                  onValueChange={(value) => {
                    if (value === "admin" || value === "superadmin") {
                      setRole(value);
                    }
                  }}
                >
                  <SelectTrigger className="h-10 w-full bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    {actorIsSuper && (
                      <SelectItem value="superadmin">Superadmin</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {role !== "superadmin" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Sidebar access</p>
                  <Badge variant="outline">{permissions.length} selected</Badge>
                </div>

                {adminNavSections.map((section) => {
                  const itemIds = section.items.map((item) => item.id);
                  const grantableIds = itemIds.filter((id) =>
                    grantablePermissions.has(id),
                  );
                  if (grantableIds.length === 0) return null;

                  const allSelected = grantableIds.every((id) =>
                    permissions.includes(id),
                  );

                  return (
                    <div
                      key={section.id}
                      className="rounded-xl border border-border bg-muted/40 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold">
                          {section.title ??
                            (section.id === "main"
                              ? "Main"
                              : section.id === "admin"
                                ? "Admin"
                                : section.id)}
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSection(itemIds)}
                        >
                          {allSelected ? "Clear section" : "Select section"}
                        </Button>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {section.items.map((item) => {
                          const canGrant = grantablePermissions.has(item.id);
                          const checked = permissions.includes(item.id);
                          return (
                            <label
                              key={item.id}
                              className={cn(
                                "flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm",
                                canGrant
                                  ? "cursor-pointer hover:bg-background"
                                  : "cursor-not-allowed opacity-40",
                              )}
                            >
                              <Checkbox
                                checked={checked}
                                disabled={!canGrant}
                                onCheckedChange={(value) =>
                                  togglePermission(item.id, value === true)
                                }
                              />
                              <span>{item.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Alert>
                <AlertTitle>Full access</AlertTitle>
                <AlertDescription>
                  Superadmin automatically has access to every sidebar item.
                </AlertDescription>
              </Alert>
            )}

            <Separator />

            <Button type="submit" disabled={saving} className="h-10 px-5">
              {saving ? (
                <>
                  <AgenticLoader size="sm" tone="onPrimary" label="Creating user" />
                  Creating...
                </>
              ) : (
                "Create user"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All users</CardTitle>
          <CardDescription>
            Active admin accounts and their assigned access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2.5 py-6 text-sm text-muted-foreground">
              <AgenticLoader size="sm" label="Loading users" />
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.role === "superadmin"
                        ? "Full access"
                        : `${user.permissions.length} items`}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => void handleDelete(user.id)}
                      >
                        <Trash2Icon className="size-3.5" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
