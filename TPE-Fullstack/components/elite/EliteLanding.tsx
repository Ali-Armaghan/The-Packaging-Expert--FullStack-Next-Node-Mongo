import { EliteBelowFold } from "@/components/elite/EliteBelowFold";
import { EliteHero } from "@/components/elite/EliteHero";
import { ElitePageShell } from "@/components/elite/ElitePageShell";
import type { EliteHeroContent } from "@/types/elitePage";

/** Server shell: hero SSR + code-split below-fold. */
export function EliteLanding({
  hero,
  slug,
}: {
  hero: EliteHeroContent;
  /** When set, below-fold loads from Group By APIs at /api/group/[slug]/… */
  slug?: string;
}) {
  return (
    <ElitePageShell>
      <EliteHero content={hero} />
      <EliteBelowFold slug={slug} />
    </ElitePageShell>
  );
}
