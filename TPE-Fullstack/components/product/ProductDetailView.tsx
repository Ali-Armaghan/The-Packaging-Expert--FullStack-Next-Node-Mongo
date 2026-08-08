import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProductBanner } from "./ProductBanner";
import { ProductFeatureSections } from "./ProductFeatureSections";
import { ProductGallery } from "./ProductGallery";
import { ProductHighlights } from "./ProductHighlights";
import { ProductPurchasePanel } from "./ProductPurchasePanel";
import { ProductTabs } from "./ProductTabs";
import { RelatedProducts } from "./RelatedProducts";
import type { ProductCardItem, SerializedProduct } from "@/types/product";

type ProductDetailViewProps = {
  product: SerializedProduct;
  related: ProductCardItem[];
};

export function ProductDetailView({
  product,
  related,
}: ProductDetailViewProps) {
  const { detail } = product;
  const images = Array.from(
    new Set([product.image, ...product.images, ...detail.gallery].filter(Boolean)),
  );

  return (
    <div className="route-enter bg-white pb-20">
      <Container className="pt-6">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/products" className="hover:text-primary">
                Products
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="font-medium text-foreground">
              {detail.breadcrumbLabel || product.name}
            </li>
          </ol>
        </nav>
      </Container>

      <Container className="mt-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery name={product.name} images={images} />

          <div>
            <h1 className="text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {detail.summary || product.description}
            </p>

            <ProductPurchasePanel detail={detail} price={product.price} />
          </div>
        </div>
      </Container>

      <Container className="mt-16">
        <ProductTabs tabs={detail.tabs} />
      </Container>

      <Container className="mt-16">
        <ProductHighlights highlights={detail.highlights} />
      </Container>

      <Container className="mt-16">
        <ProductBanner banner={detail.banner} />
      </Container>

      <Container className="mt-20">
        <ProductFeatureSections sections={detail.featureSections} />
      </Container>

      <Container className="mt-20">
        <RelatedProducts
          title={detail.relatedTitle || "Related products"}
          products={related}
        />
      </Container>
    </div>
  );
}
