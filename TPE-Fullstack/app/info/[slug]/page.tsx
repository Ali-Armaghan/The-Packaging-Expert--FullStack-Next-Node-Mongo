import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Home2InfoItemView } from "@/components/home2/info/Home2InfoItemView";
import { sanitizeBlogHtml } from "@/lib/blog/sanitizeHtml";
import {
  getContentItemPage,
  listContentItemSlugsForStaticParams,
} from "@/lib/productContentTab/cache";

export const revalidate = 86400;
export const dynamicParams = true;

type PageProps = {
  params: Promise<{ slug: string }>;
};

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateStaticParams() {
  const slugs = await listContentItemSlugsForStaticParams();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getContentItemPage(slug);
  if (!data) return { title: "Not found" };
  const description =
    stripHtml(data.item.body).slice(0, 160) || data.item.title;
  return {
    title: data.item.title,
    description,
    openGraph: {
      title: data.item.title,
      description,
      images: data.item.image ? [{ url: data.item.image }] : undefined,
    },
  };
}

export default async function ContentItemPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getContentItemPage(slug);
  if (!data) notFound();
  const bodyHtml = await sanitizeBlogHtml(data.item.body);
  return <Home2InfoItemView data={data} bodyHtml={bodyHtml} />;
}
