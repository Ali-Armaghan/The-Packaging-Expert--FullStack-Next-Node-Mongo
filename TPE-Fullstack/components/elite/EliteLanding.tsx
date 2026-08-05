import { EliteBelowFold } from "@/components/elite/EliteBelowFold";
import { EliteHero } from "@/components/elite/EliteHero";
import { ElitePageShell } from "@/components/elite/ElitePageShell";
import type { EliteHeroContent } from "@/types/elitePage";

/** Server shell: hero SSR + code-split below-fold. */
export function EliteLanding({ hero }: { hero: EliteHeroContent }) {
  return (
    <ElitePageShell>
      <EliteHero content={hero} />
      <EliteBelowFold />
    </ElitePageShell>
  );
}
