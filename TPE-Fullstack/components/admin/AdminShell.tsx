"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LogOutIcon, MenuIcon } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type AdminShellProps = {
  children: ReactNode;
  title?: string;
};

function getPageTitle(pathname: string) {
  if (pathname === "/admin") return "Dashboard";
  if (pathname.startsWith("/admin/unauthorized")) return "Unauthorized";
  const segment = pathname.replace("/admin/", "").split("/")[0] ?? "";
  if (!segment) return "Admin";
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function AdminShell({ children, title }: AdminShellProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pageTitle = title ?? getPageTitle(pathname);
  const isLoginPage = pathname.startsWith("/admin/login");

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-muted/40 text-foreground">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={{
          name: session?.user?.name ?? "Admin",
          role: session?.user?.role ?? "admin",
          permissions: session?.user?.permissions ?? [],
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur-md">
          <div className="flex h-14 items-center gap-3 px-4 lg:h-16 lg:px-6">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              aria-expanded={sidebarOpen}
            >
              <MenuIcon />
            </Button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold tracking-tight sm:text-base">
                {pageTitle}
              </p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Packing Expert admin panel
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
            >
              <LogOutIcon className="size-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
          <Separator />
        </header>

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          {children}
        </main>
      </div>
    </div>
  );
}
