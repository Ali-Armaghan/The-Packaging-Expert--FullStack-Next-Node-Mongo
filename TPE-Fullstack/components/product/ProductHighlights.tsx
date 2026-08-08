import {
  BoxIcon,
  ClockIcon,
  GlobeIcon,
  LeafIcon,
  ShieldCheckIcon,
  type LucideIcon,
} from "lucide-react";
import type { ProductHighlight, ProductHighlightIcon } from "@/types/product";

const ICONS: Record<ProductHighlightIcon, LucideIcon> = {
  globe: GlobeIcon,
  box: BoxIcon,
  leaf: LeafIcon,
  shield: ShieldCheckIcon,
  clock: ClockIcon,
};

export function ProductHighlights({
  highlights,
}: {
  highlights: ProductHighlight[];
}) {
  if (highlights.length === 0) return null;

  return (
    <div className="grid gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-12">
      {highlights.map((highlight) => {
        const Icon = ICONS[highlight.icon] ?? BoxIcon;
        return (
          <div key={highlight.title} className="flex gap-4">
            <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center text-primary">
              <Icon className="size-[1.35rem] stroke-[1.75]" aria-hidden />
            </span>
            <div className="min-w-0">
              <h3 className="text-[15px] font-bold tracking-[-0.01em] text-foreground">
                {highlight.title}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-[1.65] text-muted-foreground">
                {highlight.text}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
