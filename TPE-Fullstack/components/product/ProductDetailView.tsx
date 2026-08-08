import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
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
    new Set(
      [product.image, ...product.images, ...detail.gallery].filter(Boolean),
    ),
  );

  return (
    <div className="route-enter bg-white">
      {/* Hero: gallery + configurator */}
      <section className="border-b border-black/[0.06] pb-12 pt-5 sm:pb-16 sm:pt-7">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="transition hover:text-primary"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRightIcon className="size-3.5 opacity-50" />
              </li>
              <li>
                  <Link
                  href="/category"
                  className="transition hover:text-primary"
                >
                  Category
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRightIcon className="size-3.5 opacity-50" />
              </li>
              <li className="font-medium text-foreground">
                {detail.breadcrumbLabel || product.name}
              </li>
            </ol>
          </nav>

          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 xl:gap-16">
            <ProductGallery name={product.name} images={images} />

            <div className="lg:sticky lg:top-28 lg:self-start">
              <ProductPurchasePanel name={product.name} detail={detail} />
            </div>
          </div>
        </Container>
      </section>

      {/* Tabs + highlights */}
      <section className="py-12 sm:py-16">
        <Container>
          <ProductTabs
            tabs={detail.tabs}
            orderProcess={detail.orderProcess}
          />
          <div className="mt-12 border-t border-black/[0.06] pt-12 sm:mt-14 sm:pt-14">
            <ProductHighlights highlights={detail.highlights} />
          </div>
        </Container>
      </section>

      {/* Promo banner — full-bleed grey band */}
      <ProductBanner banner={detail.banner} />

      {/* Alternating feature stories */}
      <section className="py-14 sm:py-20">
        <Container>
          <ProductFeatureSections sections={detail.featureSections} />
        </Container>
      </section>

      {/* Related */}
      <section className="border-t border-black/[0.06] bg-[#fafafa] py-14 sm:py-16">
        <Container>
          <RelatedProducts
            title={detail.relatedTitle || "Related products"}
            products={related}
          />
        </Container>
      </section>
    </div>
  );
}
