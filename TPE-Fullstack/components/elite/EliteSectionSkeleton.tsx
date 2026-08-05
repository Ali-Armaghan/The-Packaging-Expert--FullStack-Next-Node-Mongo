import type { EliteBelowFoldKey } from "@/types/elitePage";
import { cn } from "@/lib/utils";

const HEIGHT: Record<EliteBelowFoldKey, string> = {
  catalog: "min-h-[520px]",
  whyUs: "min-h-[480px]",
  industries: "min-h-[420px]",
  process: "min-h-[520px]",
  features: "min-h-[640px]",
  stats: "min-h-[220px]",
  testimonials: "min-h-[480px]",
  faq: "min-h-[420px]",
  partners: "min-h-[96px]",
};

export function EliteSectionSkeleton({
  section,
}: {
  section: EliteBelowFoldKey;
}) {
  return (
    <div
      className={cn(
        "mx-4 my-8 animate-pulse rounded-[2rem] bg-black/[0.04] sm:mx-6 lg:mx-8",
        HEIGHT[section],
      )}
      aria-hidden
    />
  );
}
