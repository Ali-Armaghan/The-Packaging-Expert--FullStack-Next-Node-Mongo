import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import {
  getProductPage,
  listProductSlugsForStaticParams,
} from "@/lib/product/cache";

export const revalidate = 86400;
export const dynamicParams = true;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await listProductSlugsForStaticParams();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductPage(slug);
  if (!data) return { title: "Product not found" };

  const { product } = data;
  const description = product.detail.summary || product.description;
  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.image ? [{ url: product.image }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getProductPage(slug);
  if (!data) notFound();

  return (
    <ProductDetailView product={data.product} related={data.related} />
  );
}
