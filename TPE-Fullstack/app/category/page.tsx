import type { Metadata } from "next";
import { MenuHubView } from "@/components/menu-hub/MenuHubView";
import { applyLinksToHubContent } from "@/lib/menuLinks/apply";
import { getCachedMenuGroupLinks } from "@/lib/menuLinks/cache";
import { getStaticMenuHub } from "@/lib/menuHub/content";

export const revalidate = 86400;

const base = getStaticMenuHub("products");

export const metadata: Metadata = {
  title: base.hero.title,
  description: base.hero.description,
};

export default async function CategoryHubPage() {
  let links = {};
  try {
    links = await getCachedMenuGroupLinks("products");
  } catch {
    links = {};
  }
  const content = applyLinksToHubContent(base, links);
  return <MenuHubView content={content} />;
}
