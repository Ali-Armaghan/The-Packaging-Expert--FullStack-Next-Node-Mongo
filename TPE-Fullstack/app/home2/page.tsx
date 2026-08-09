import type { Metadata } from "next";
import { Home2Hero } from "@/components/home2/hero/Home2Hero";
import { home2Hero } from "@/lib/home2/content";

export const metadata: Metadata = {
  title: "Custom Packaging That Sells Itself",
  description:
    "Premium custom packaging studio — floating gallery of boxes, mailers, and print-ready finishes.",
};

/**
 * Isolated playground for the new home experience.
 * Global chrome is swapped only on this route via ConditionalHeader.
 */
export default function Home2Page() {
  return (
    <div className="route-enter">
      <Home2Hero content={home2Hero} />
      <section className="bg-background px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-muted-foreground">
            More sections coming next — hero + navbar are live on /home2 only.
          </p>
        </div>
      </section>
    </div>
  );
}
