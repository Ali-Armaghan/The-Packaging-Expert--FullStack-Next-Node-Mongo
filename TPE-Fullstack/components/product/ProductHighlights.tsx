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
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {highlights.map((highlight) => {
        const Icon = ICONS[highlight.icon] ?? BoxIcon;
        return (
          <div key={highlight.title}>
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden />
            </span>
            <h3 className="mt-4 text-base font-semibold text-foreground">
              {highlight.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {highlight.text}
            </p>
          </div>
        );
      })}
    </div>
  );
}
