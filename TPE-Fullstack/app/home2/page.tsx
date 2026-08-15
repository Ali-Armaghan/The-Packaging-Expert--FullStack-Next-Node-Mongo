import type { Metadata } from "next";
import { Home2Hero } from "@/components/home2/hero/Home2Hero";
import { Home2Catalog } from "@/components/home2/sections/Home2Catalog";
import { Home2Closing } from "@/components/home2/sections/Home2Closing";
import { Home2ExploreTabs } from "@/components/home2/sections/Home2ExploreTabs";
import { Home2Faq } from "@/components/home2/sections/Home2Faq";
import { Home2Industries } from "@/components/home2/sections/Home2Industries";
import { Home2Marquee } from "@/components/home2/sections/Home2Marquee";
import { Home2Pillars } from "@/components/home2/sections/Home2Pillars";
import { Home2Process } from "@/components/home2/sections/Home2Process";
import { Home2Testimonials } from "@/components/home2/sections/Home2Testimonials";
import { Home2Vision } from "@/components/home2/sections/Home2Vision";
import {
  home2Catalog,
  home2Closing,
  home2Explore,
  home2Faq,
  home2Hero,
  home2Industries,
  home2Marquee,
  home2Pillars,
  home2Process,
  home2Testimonials,
  home2Vision,
} from "@/lib/home2/content";

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
      <Home2Marquee content={home2Marquee} />
      <Home2ExploreTabs content={home2Explore} />
      <Home2Catalog content={home2Catalog} />
      <Home2Pillars content={home2Pillars} />
      <Home2Vision content={home2Vision} />
      <Home2Industries content={home2Industries} />
      <Home2Process content={home2Process} />
      <Home2Testimonials content={home2Testimonials} />
      <Home2Faq content={home2Faq} />
      <Home2Closing content={home2Closing} />
    </div>
  );
}
