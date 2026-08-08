import Image from "next/image";
import Link from "next/link";
import type { ProductCardItem } from "@/types/product";

type RelatedProductsProps = {
  title: string;
  products: ProductCardItem[];
};

export function RelatedProducts({ title, products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold tracking-[-0.02em] text-foreground sm:text-2xl">
        {title}
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group flex flex-col rounded-xl p-2 transition hover:-translate-y-1"
          >
            <div className="relative aspect-square overflow-hidden rounded-xl bg-[linear-gradient(180deg,#f7f5f1_0%,#efefec_100%)] ring-1 ring-black/5">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-contain p-3 transition duration-500 group-hover:scale-105"
                />
              ) : null}
            </div>
            <h3 className="mt-3 text-center text-sm font-medium text-foreground">
              {product.name}
            </h3>
            {product.price ? (
              <span className="mt-1 text-center text-xs text-muted-foreground">
                {product.price}
              </span>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}
