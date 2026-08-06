import type { Metadata } from "next";
import { MenuHubView } from "@/components/menu-hub/MenuHubView";
import { getStaticMenuHub } from "@/lib/menuHub/content";

export const dynamic = "force-static";

const content = getStaticMenuHub("industries");

export const metadata: Metadata = {
  title: content.hero.title,
  description: content.hero.description,
};

export default function IndustriesHubPage() {
  return <MenuHubView content={content} />;
}
