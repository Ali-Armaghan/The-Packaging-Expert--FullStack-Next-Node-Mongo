import type { EliteStatsContent } from "@/types/elitePage";
import { ElitePrimaryBtn } from "./ui";

export function EliteStats({ content }: { content: EliteStatsContent }) {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-black/5 bg-white px-6 py-12 shadow-[0_20px_60px_-40px_rgba(20,24,32,0.35)] sm:px-10">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {content.items.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="bg-gradient-to-b from-primary to-[#1f8f5f] bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <ElitePrimaryBtn href={content.cta.href}>
            {content.cta.label}
          </ElitePrimaryBtn>
        </div>
      </div>
    </section>
  );
}
