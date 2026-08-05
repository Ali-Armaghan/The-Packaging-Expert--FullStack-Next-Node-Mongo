import type { ElitePartnersContent } from "@/types/elitePage";

export function ElitePartners({ content }: { content: ElitePartnersContent }) {
  return (
    <section className="border-t border-black/5 bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-5">
        {content.brands.map((brand) => (
          <span
            key={brand}
            className="text-xs font-bold tracking-[0.2em] text-[color:var(--elite-ink)]/35 transition hover:text-[color:var(--elite-ink)]/70 sm:text-sm"
          >
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
}
