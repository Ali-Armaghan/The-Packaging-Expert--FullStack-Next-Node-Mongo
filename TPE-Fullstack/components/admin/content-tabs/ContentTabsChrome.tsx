"use client";

import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Crumb = {
  href?: string;
  label: string;
};

const STEPS = [
  { n: 1, label: "Tabs" },
  { n: 2, label: "Sections" },
  { n: 3, label: "Items" },
  { n: 4, label: "Article" },
] as const;

type ContentTabsChromeProps = {
  title: string;
  description: string;
  step: 1 | 2 | 3 | 4;
  crumbs: Crumb[];
  actions?: React.ReactNode;
};

export function ContentTabsChrome({
  title,
  description,
  step,
  crumbs,
  actions,
}: ContentTabsChromeProps) {
  return (
    <div className="space-y-4">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
      >
        {crumbs.map((crumb, index) => (
          <span key={`${crumb.label}-${index}`} className="flex items-center gap-1">
            {index > 0 ? (
              <ChevronRightIcon className="size-3.5 shrink-0" />
            ) : null}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-foreground">
                {crumb.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      <ol className="flex flex-wrap gap-2">
        {STEPS.map((entry) => {
          const done = entry.n < step;
          const current = entry.n === step;
          return (
            <li
              key={entry.n}
              className={cn(
                "flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium",
                current
                  ? "border-primary bg-primary/10 text-primary"
                  : done
                    ? "border-border bg-muted/40 text-foreground"
                    : "border-border text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-[11px]",
                  current
                    ? "bg-primary text-primary-foreground"
                    : "bg-background",
                )}
              >
                {entry.n}
              </span>
              {entry.label}
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
