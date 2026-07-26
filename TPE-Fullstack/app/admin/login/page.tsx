import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheckIcon } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { siteConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Admin Login",
};

function LoginFormFallback() {
  return (
    <div className="space-y-4">
      <div className="h-11 animate-pulse rounded-md bg-muted" />
      <div className="h-11 animate-pulse rounded-md bg-muted" />
      <div className="h-11 animate-pulse rounded-md bg-muted" />
    </div>
  );
}

export default function AdminLoginPage() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Left brand panel */}
      <aside className="relative hidden bg-navy text-white lg:flex lg:flex-col">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(165deg, rgba(52,173,120,0.16) 0%, transparent 42%), linear-gradient(0deg, rgba(15,18,25,0.35), transparent 50%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex h-full flex-col justify-between px-12 py-10 xl:px-16 xl:py-12">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary text-xs font-bold tracking-wide text-white">
              PE
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight">
                {siteConfig.name}
              </p>
              <p className="text-xs text-white/55">Administration Console</p>
            </div>
          </div>

          <div className="max-w-lg">
            <p className="text-sm font-medium tracking-wide text-primary">
              Internal access only
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight xl:text-4xl xl:leading-tight">
              Packaging operations,
              <br />
              managed with control.
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/65">
              Sign in to oversee catalog content, customer quote requests, and
              team permissions from a secure workspace.
            </p>

            <div className="mt-10 space-y-4 border-t border-white/10 pt-8">
              <div className="flex gap-3">
                <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium text-white/90">
                    Role-based access
                  </p>
                  <p className="mt-0.5 text-sm text-white/55">
                    Users only see the modules assigned to them.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium text-white/90">
                    Centralized inquiry handling
                  </p>
                  <p className="mt-0.5 text-sm text-white/55">
                    Quotes and contact leads stay in one place.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/40">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </aside>

      {/* Right form panel */}
      <main className="flex min-h-screen flex-col bg-white">
        <div className="flex items-center justify-between border-b border-border px-5 py-4 lg:hidden">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-white">
              PE
            </span>
            <span className="text-sm font-semibold text-navy">
              {siteConfig.name}
            </span>
          </div>
          <Link
            href="/"
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Website
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[400px]">
            <div className="mb-8 hidden lg:block">
              <p className="text-sm font-medium text-muted-foreground">
                Administration Console
              </p>
            </div>

            <h2 className="text-2xl font-semibold tracking-tight text-navy">
              Sign in
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Enter your credentials to access the admin dashboard.
            </p>

            <div className="mt-8">
              <Suspense fallback={<LoginFormFallback />}>
                <AdminLoginForm />
              </Suspense>
            </div>

            <Separator className="my-8" />

            <div className="flex flex-col gap-2 text-center text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <p>Authorized personnel only.</p>
              <Link
                href="/"
                className="font-medium text-navy/70 hover:text-primary"
              >
                Return to website
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
