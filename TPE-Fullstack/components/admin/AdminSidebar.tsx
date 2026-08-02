"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronsUpDownIcon,
  ChevronRightIcon,
  GalleryVerticalEndIcon,
  LogOutIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";
import {
  filterNavByPermissions,
  isSuperAdmin,
} from "@/lib/auth/permissions";
import {
  getAdminNavSectionLabel,
  type AdminNavItem,
} from "@/constants/adminNav";
import { cn } from "@/lib/utils";
import { AdminIcon } from "./AdminIcon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

type AdminSidebarProps = {
  user: {
    name: string;
    role: string;
    permissions: string[];
  };
};

const menuButtonClass =
  "transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

function isActivePath(pathname: string, href?: string) {
  if (!href) return false;
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function hasActiveChild(pathname: string, item: AdminNavItem): boolean {
  if (isActivePath(pathname, item.href)) return true;
  return item.items?.some((child) => hasActiveChild(pathname, child)) ?? false;
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

function findActiveMenuId(pathname: string, items: AdminNavItem[]) {
  for (const item of items) {
    if (item.items?.length && hasActiveChild(pathname, item)) {
      return item.id;
    }
  }
  return null;
}

function NavLeaf({
  item,
  onNavigate,
}: {
  item: AdminNavItem;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isActivePath(pathname, item.href);

  if (!item.href) return null;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={<Link href={item.href} />}
        isActive={active}
        tooltip={item.label}
        className={menuButtonClass}
        onClick={onNavigate}
      >
        <AdminIcon name={item.icon} />
        <span>{item.label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function NavCollapsible({
  item,
  open,
  onOpenChange,
  onNavigate,
}: {
  item: AdminNavItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const activeBranch = hasActiveChild(pathname, item);
  const children = item.items ?? [];

  return (
    <Collapsible
      open={open}
      onOpenChange={onOpenChange}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <SidebarMenuButton
          render={<CollapsibleTrigger />}
          tooltip={item.label}
          isActive={activeBranch}
          className={menuButtonClass}
        >
          <AdminIcon name={item.icon} />
          <span>{item.label}</span>
          <ChevronRightIcon
            className={cn(
              "ml-auto size-4 shrink-0 transition-transform duration-200",
              open && "rotate-90",
            )}
          />
        </SidebarMenuButton>

        <CollapsibleContent className="overflow-hidden">
          <SidebarMenuSub className="my-1 gap-0.5 py-0">
            {children.map((child) => {
              if (!child.href) return null;
              const active = isActivePath(pathname, child.href);
              return (
                <SidebarMenuSubItem key={child.id}>
                  <SidebarMenuSubButton
                    render={<Link href={child.href} />}
                    isActive={active}
                    className="h-8 transition-colors duration-150"
                    onClick={onNavigate}
                  >
                    <span>{child.label}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const sections = useMemo(
    () =>
      filterNavByPermissions({
        role: user.role,
        permissions: user.permissions,
      }),
    [user.permissions, user.role],
  );

  const platformItems = sections[0]?.items ?? [];
  const activeMenuId = useMemo(
    () => findActiveMenuId(pathname, platformItems),
    [pathname, platformItems],
  );

  const [openMenuId, setOpenMenuId] = useState<string | null>(activeMenuId);

  useEffect(() => {
    if (activeMenuId) setOpenMenuId(activeMenuId);
  }, [activeMenuId]);

  const roleLabel = isSuperAdmin(user.role) ? "Superadmin" : "Admin";

  const closeMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className={cn(
                      menuButtonClass,
                      "data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground",
                    )}
                  />
                }
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEndIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Packaging Expert</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Enterprise
                  </span>
                </div>
                <ChevronsUpDownIcon className="ml-auto size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--anchor-width) min-w-56 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-muted-foreground">
                  Workspace
                </DropdownMenuLabel>
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <GalleryVerticalEndIcon className="size-3.5" />
                  </div>
                  Packaging Expert
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 p-2"
                  onClick={() => signOut({ callbackUrl: "/admin/login" })}
                >
                  <LogOutIcon className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {sections.length === 0 ? (
          <SidebarGroup>
            <SidebarGroupContent>
              <p className="px-2 py-2 text-sm text-muted-foreground">
                No sidebar access assigned.
              </p>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          sections.map((section) => (
            <SidebarGroup key={section.id} className="py-2">
              <SidebarGroupLabel>
                {getAdminNavSectionLabel(section.id, section.title)}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {section.items.map((item) => {
                    if (item.items?.length) {
                      return (
                        <NavCollapsible
                          key={item.id}
                          item={item}
                          open={openMenuId === item.id}
                          onOpenChange={(nextOpen) => {
                            setOpenMenuId(nextOpen ? item.id : null);
                          }}
                          onNavigate={closeMobile}
                        />
                      );
                    }

                    return (
                      <NavLeaf
                        key={item.id}
                        item={item}
                        onNavigate={() => {
                          setOpenMenuId(null);
                          closeMobile();
                        }}
                      />
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className={cn(
                      menuButtonClass,
                      "data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground",
                    )}
                  />
                }
              >
                <Avatar size="default">
                  <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs capitalize text-muted-foreground">
                    {roleLabel}
                  </span>
                </div>
                <ChevronsUpDownIcon className="ml-auto size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--anchor-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar size="default">
                      <AvatarFallback className="rounded-lg">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user.name}</span>
                      <span className="truncate text-xs capitalize text-muted-foreground">
                        {roleLabel}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/admin/login" })}
                >
                  <LogOutIcon />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
