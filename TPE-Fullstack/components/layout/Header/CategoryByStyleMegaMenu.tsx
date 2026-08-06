import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { categoryByStyleGroup } from "@/constants/categoryByStyleMenu";
import type { MegaMenuItem } from "@/constants/productsMegaMenu";
import { cn } from "@/lib/utils";

type CategoryByStyleMegaMenuProps = {
  open: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigate?: () => void;
  items?: MegaMenuItem[];
};

function MegaMenuLink({
  item,
  onNavigate,
}: {
  item: MegaMenuItem;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-[#dce8ef]">
        <Image
          src={item.image}
          alt=""
          fill
          className="object-contain p-1"
          sizes="48px"
        />
      </div>
      <div className="min-w-0 pt-0.5">
        <p className="text-sm font-bold text-foreground group-hover:text-primary">
          {item.title}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </div>
    </Link>
  );
}

export function CategoryByStyleMegaMenu({
  open,
  onMouseEnter,
  onMouseLeave,
  onNavigate,
  items = categoryByStyleGroup.items,
}: CategoryByStyleMegaMenuProps) {
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
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {categoryByStyleGroup.title}
          </p>
          <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:max-w-3xl">
            {items.map((item) => (
              <li key={item.id}>
                <MegaMenuLink item={item} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
}
