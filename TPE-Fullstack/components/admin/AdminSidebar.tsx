"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { XIcon } from "lucide-react";
import { type AdminNavItem } from "@/constants/adminNav";
import {
  filterNavByPermissions,
  isSuperAdmin,
} from "@/lib/auth/permissions";
import { cn } from "@/lib/utils";
import { AdminIcon } from "./AdminIcon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
  user: {
    name: string;
    role: string;
    permissions: string[];
  };
};

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "AU"
  );
}

function NavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: AdminNavItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = isActivePath(pathname, item.href);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm ring-1 ring-sidebar-border"
          : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
      )}
      aria-current={active ? "page" : undefined}
    >
      <AdminIcon
        name={item.icon}
        className={cn(
          "h-[18px] w-[18px] shrink-0",
          active
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground",
        )}
      />
      <span>{item.label}</span>
    </Link>
  );
}

export function AdminSidebar({ open, onClose, user }: AdminSidebarProps) {
  const pathname = usePathname();
  const sections = filterNavByPermissions({
    role: user.role,
    permissions: user.permissions,
  });

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-navy/40 backdrop-blur-[2px] transition-opacity lg:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[17.5rem] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-out lg:static lg:z-auto lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Admin sidebar"
      >
        <div className="flex h-14 shrink-0 items-center justify-between px-4 lg:h-16">
          <Link
            href={sections[0]?.items[0]?.href ?? "/admin"}
            onClick={onClose}
            className="flex items-center gap-2.5 font-bold tracking-tight"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs text-primary-foreground">
              PE
            </span>
            <span className="text-sm">
              Packaging <span className="text-primary">Admin</span>
            </span>
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="lg:hidden"
            aria-label="Close sidebar"
          >
            <XIcon />
          </Button>
        </div>

        <Separator />

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {sections.length === 0 ? (
            <p className="px-3 text-sm text-muted-foreground">
              No sidebar access assigned.
            </p>
          ) : (
            sections.map((section, index) => (
              <div key={section.id} className={cn(index > 0 && "mt-6")}>
                {section.title && (
                  <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/80">
                    {section.title}
                  </p>
                )}
                <ul className="space-y-0.5">
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <NavLink
                        item={item}
                        pathname={pathname}
                        onNavigate={onClose}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </nav>

        <Separator />

        <div className="shrink-0 p-3">
          <div className="flex items-center gap-3 rounded-xl bg-secondary/80 px-3 py-2.5">
            <Avatar size="default">
              <AvatarFallback className="bg-background font-semibold text-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <Badge variant="secondary" className="mt-1 capitalize">
                {isSuperAdmin(user.role) ? "Superadmin" : user.role}
              </Badge>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
