import type { ReactNode } from "react";

/** Stable shell — CSS handles entrance; no JS ready-gate (avoids blank flash). */
export function ElitePageShell({ children }: { children: ReactNode }) {
  return (
    <div className="elite-page relative overflow-hidden bg-[#fbfaf8] text-foreground">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(ellipse_80%_60%_at_10%_0%,rgba(52,173,120,0.14),transparent_55%),radial-gradient(ellipse_50%_40%_at_90%_10%,rgba(228,213,195,0.55),transparent_50%)]"
        aria-hidden
      />
      {children}
    </div>
  );
}
