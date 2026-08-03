"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LogOutIcon } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { PageLoader } from "@/components/ui/AgenticLoader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

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
  const { data: session, status } = useSession();
  const pageTitle = title ?? getPageTitle(pathname);
  const isLoginPage = pathname.startsWith("/admin/login");

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (status === "loading") {
    return <PageLoader overlay label="Loading admin" />;
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AdminSidebar
          user={{
            name: session?.user?.name ?? "Admin",
            role: session?.user?.role ?? "admin",
            permissions: session?.user?.permissions ?? [],
          }}
        />

        <SidebarInset className="bg-[#fbfcfb]">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/50 bg-background/80 px-4 backdrop-blur-sm transition-[width,height] duration-200 ease-out group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 h-4 bg-border/60"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium tracking-tight text-foreground/90">
                  {pageTitle}
                </p>
              </div>
            </div>

            <div className="ml-auto">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground hover:text-foreground"
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
              >
                <LogOutIcon className="size-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>
          </header>

          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-5 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
