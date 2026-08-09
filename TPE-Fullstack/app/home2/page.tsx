import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home 2 — Studio",
  description: "Premium packaging studio layout preview.",
};

/**
 * Isolated playground for the new home experience.
 * Global chrome is swapped only on this route via ConditionalHeader.
 */
export default function Home2Page() {
  return (
    <div className="route-enter">
      <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-[#0a0d12] px-4 pb-16 pt-28 sm:px-6 sm:pb-20 lg:px-8">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse at 70% 35%, rgba(52,173,120,0.28), transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(63,122,168,0.18), transparent 50%)",
          }}
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/40">
            01 — Navbar preview
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            New home starts with the nav.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/55">
            Floating glass header + fullscreen studio menu — only on{" "}
            <span className="text-primary">/home2</span>. Scroll to see it
            solidify; tap Menu for the overlay.
          </p>
        </div>
      </section>
      <section className="bg-background px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-muted-foreground">
            Placeholder content below the fold so you can test scroll behaviour.
            Hero + rest of the page come next — navbar first.
          </p>
        </div>
      </section>
    </div>
  );
}
