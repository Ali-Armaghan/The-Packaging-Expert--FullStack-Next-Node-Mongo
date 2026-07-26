import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import {
  optionLibraryFeature,
  optionLibraryImages,
  productsMegaMenuGroups,
  type MegaMenuItem,
} from "@/constants/productsMegaMenu";
import { cn } from "@/lib/utils";

type ProductsMegaMenuProps = {
  open: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

function MegaMenuLink({ item }: { item: MegaMenuItem }) {
  return (
    <Link
      href={item.href}
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

function MegaMenuGroupColumn({
  group,
  className,
}: {
  group: (typeof productsMegaMenuGroups)[number];
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {group.title}
      </p>
      <ul className="space-y-1">
        {group.items.map((item) => (
          <li key={item.id}>
            <MegaMenuLink item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProductsMegaMenu({
  open,
  onMouseEnter,
  onMouseLeave,
}: ProductsMegaMenuProps) {
  const [productsGroup, othersGroup, bagsGroup] = productsMegaMenuGroups;

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
        <div className="grid grid-cols-[1fr_1fr_280px] gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_300px]">
          <div className="space-y-8">
            <MegaMenuGroupColumn group={productsGroup} />
            <MegaMenuGroupColumn group={othersGroup} />
          </div>

          <MegaMenuGroupColumn group={bagsGroup} />

          <aside className="rounded-xl bg-muted p-5">
            <div className="grid grid-cols-4 gap-1.5">
              {optionLibraryImages.map((image, index) => (
                <div
                  key={image + index}
                  className="relative aspect-square overflow-hidden rounded-sm bg-white"
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="60px"
                  />
                </div>
              ))}
            </div>

            <h3 className="mt-5 text-base font-bold text-foreground">
              {optionLibraryFeature.title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {optionLibraryFeature.description}
            </p>
            <Link
              href={optionLibraryFeature.href}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark"
            >
              {optionLibraryFeature.linkLabel}
              <span aria-hidden="true">→</span>
            </Link>
          </aside>
        </div>
      </Container>
    </div>
  );
}
