import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import {
  industriesMegaMenuColumns,
  inspirationLibraryFeature,
  type IndustryMegaMenuItem,
} from "@/constants/industriesMegaMenu";
import { cn } from "@/lib/utils";
import { IndustryIcon } from "./IndustryIcons";

type IndustriesMegaMenuProps = {
  open: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigate?: () => void;
  columns?: IndustryMegaMenuItem[][];
};

function IndustryLink({
  item,
  onNavigate,
}: {
  item: IndustryMegaMenuItem;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className="group flex items-center gap-3 rounded-md px-1.5 py-2.5 transition-colors hover:bg-muted"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center text-foreground transition-colors group-hover:text-primary">
        <IndustryIcon icon={item.icon} className="h-6 w-6" />
      </span>
      <span className="text-[0.9375rem] font-medium text-foreground transition-colors group-hover:text-primary">
        {item.label}
      </span>
    </Link>
  );
}

export function IndustriesMegaMenu({
  open,
  onMouseEnter,
  onMouseLeave,
  onNavigate,
  columns = industriesMegaMenuColumns,
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
            <h3 className="mb-5 text-lg font-bold tracking-tight text-foreground">
              Shop by Industries
            </h3>

            <div className="grid grid-cols-1 gap-x-10 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
              {columns.map((column, columnIndex) => (
                <ul key={columnIndex} className="space-y-0.5">
                  {column.map((item) => (
                    <li key={item.id}>
                      <IndustryLink item={item} onNavigate={onNavigate} />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          <aside className="rounded-[3px] bg-muted p-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] bg-white">
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
              onClick={onNavigate}
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
