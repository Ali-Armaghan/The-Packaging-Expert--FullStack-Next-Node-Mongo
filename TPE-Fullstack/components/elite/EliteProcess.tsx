import type { EliteProcessContent } from "@/types/elitePage";
import { ElitePrimaryBtn } from "./ui";

export function EliteProcess({ content }: { content: EliteProcessContent }) {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#12161d] px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-14">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            {content.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
            {content.title}
          </h2>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="relative hidden min-h-[420px] lg:block">
            <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(52,173,120,0.35),transparent_45%),linear-gradient(160deg,#1c2430,#151a22)] ring-1 ring-white/10" />
            <svg
              className="absolute inset-8 h-[calc(100%-4rem)] w-[calc(100%-4rem)]"
              viewBox="0 0 320 420"
              fill="none"
              aria-hidden
            >
              <path
                d="M60 40 C160 40, 160 120, 260 140 C340 160, 280 240, 160 260 C60 278, 40 340, 160 380"
                stroke="rgba(52,173,120,0.7)"
                strokeWidth="3"
                strokeDasharray="8 10"
                strokeLinecap="round"
              />
            </svg>
            {[
              { top: "8%", left: "18%" },
              { top: "32%", left: "72%" },
              { top: "58%", left: "28%" },
              { top: "82%", left: "62%" },
            ].map((pos, i) => (
              <div
                key={i}
                className="absolute flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-lg font-bold text-white shadow-[0_0_0_8px_rgba(52,173,120,0.18)]"
                style={{ top: pos.top, left: pos.left }}
              >
                {i + 1}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {content.steps.map((step) => (
              <div
                key={step.n}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-primary/40 hover:bg-white/[0.06]"
              >
                <p className="text-xs font-bold tracking-[0.2em] text-primary">
                  STEP {step.n}
                </p>
                <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  {step.text}
                </p>
              </div>
            ))}
            <ElitePrimaryBtn href={content.cta.href} className="mt-2">
              {content.cta.label}
            </ElitePrimaryBtn>
          </div>
        </div>
      </div>
    </section>
  );
}
