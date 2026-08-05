import type { Metadata } from "next";
import { EliteLanding } from "@/components/elite/EliteLanding";
import { getEliteSection } from "@/lib/elite/queries";

export const metadata: Metadata = {
  title: "Elite Packaging Layout",
  description:
    "Custom packaging landing layout — shop box styles, process, reviews, and FAQs.",
};

export default async function ElitePage() {
  // Only hero blocks first paint — below-fold loads in parallel chunks.
  const hero = await getEliteSection("hero");

  return <EliteLanding hero={hero} />;
}
