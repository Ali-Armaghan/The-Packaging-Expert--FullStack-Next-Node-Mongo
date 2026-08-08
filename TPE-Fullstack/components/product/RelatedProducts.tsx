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
    <div>
      <h2 className="text-center text-[1.35rem] font-bold tracking-[-0.02em] text-foreground sm:text-[1.5rem]">
        {title}
      </h2>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-5">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group flex flex-col items-center text-center"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-[3px] bg-white ring-1 ring-black/[0.06] transition group-hover:ring-primary/35">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 18vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <h3 className="mt-3.5 text-[13.5px] font-semibold leading-snug text-foreground transition group-hover:text-primary">
              {product.name}
            </h3>
            {product.price ? (
              <span className="mt-1 text-[12px] text-muted-foreground">
                {product.price}
              </span>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
