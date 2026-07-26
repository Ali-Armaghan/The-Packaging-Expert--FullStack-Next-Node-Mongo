import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import {
  industriesMegaMenuColumns,
  inspirationLibraryFeature,
  type IndustryMegaMenuItem,
} from "@/constants/industriesMegaMenu";
import { cn } from "@/lib/utils";

type IndustriesMegaMenuProps = {
  open: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

function IndustryIcon({ icon }: Pick<IndustryMegaMenuItem, "icon">) {
  const className = "h-5 w-5";

  switch (icon) {
    case "apparel":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path strokeLinecap="round" d="M8 6l4-3 4 3v3H8V6z" />
          <path strokeLinecap="round" d="M6 9h12v10H6V9z" />
        </svg>
      );
    case "bakery":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path strokeLinecap="round" d="M4 14h16M6 14V9a6 6 0 1112 0v5" />
        </svg>
      );
    case "beer":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path strokeLinecap="round" d="M8 4h8v14a4 4 0 01-8 0V4z" />
          <path strokeLinecap="round" d="M16 7h2a2 2 0 012 2v5h-4" />
        </svg>
      );
    case "grid":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16V8z" />
          <path strokeLinecap="round" d="M3.3 7.7L12 12l8.7-4.3M12 22V12" />
        </svg>
      );
  }
}

function IndustryLink({ item }: { item: IndustryMegaMenuItem }) {
  return (
    <Link
      href={item.href}
      className="group flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-muted"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-foreground/80 group-hover:text-primary">
        <IndustryIcon icon={item.icon} />
      </span>
      <span className="text-sm font-medium text-foreground group-hover:text-primary">
        {item.label}
      </span>
    </Link>
  );
}

export function IndustriesMegaMenu({
  open,
  onMouseEnter,
  onMouseLeave,
}: IndustriesMegaMenuProps) {
  return (
    <div
      className={cn(
        "absolute inset-x-0 top-full z-50 border-t border-border bg-white shadow-lg transition-all duration-200",
        open
          ? "pointer-events-auto visible translate-y-0 opacity-100"
          : "pointer-events-none invisible -translate-y-1 opacity-0",
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-hidden={!open}
    >
      <Container className="py-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_300px]">
          <div>
            <h3 className="mb-6 text-base font-bold text-foreground">
              Shop by Industries
            </h3>

            <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
              {industriesMegaMenuColumns.map((column, columnIndex) => (
                <ul key={columnIndex} className="space-y-0.5">
                  {column.map((item) => (
                    <li key={item.id}>
                      <IndustryLink item={item} />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          <aside className="rounded-xl bg-muted p-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white">
              <Image
                src={inspirationLibraryFeature.image}
                alt=""
                fill
                className="object-cover"
                sizes="300px"
              />
            </div>

            <h3 className="mt-5 text-base font-bold text-foreground">
              {inspirationLibraryFeature.title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {inspirationLibraryFeature.description}
            </p>
            <Link
              href={inspirationLibraryFeature.href}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark"
            >
              {inspirationLibraryFeature.linkLabel}
              <span aria-hidden="true">→</span>
            </Link>
          </aside>
        </div>
      </Container>
    </div>
  );
}
