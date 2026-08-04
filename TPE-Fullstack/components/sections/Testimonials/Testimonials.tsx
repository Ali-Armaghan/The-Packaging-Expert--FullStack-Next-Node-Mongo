import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { getActiveSectionItems } from "@/lib/home/items";
import { cn } from "@/lib/utils";
import type { HomeTestimonialsContent } from "@/types/homePage";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={cn("h-4 w-4", i < rating ? "fill-primary" : "fill-border")}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

type TestimonialsProps = {
  content: HomeTestimonialsContent;
};

export function Testimonials({ content }: TestimonialsProps) {
  const items = getActiveSectionItems(content.items);

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-heading">{content.title}</h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {content.subtitle}
          </p>
        </div>

        <div className="mt-10 grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((testimonial) => (
            <article
              key={testimonial.id}
              className="flex h-full flex-col rounded-2xl border border-border/60 bg-white p-6 shadow-sm"
            >
              <StarRating rating={testimonial.rating} />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <footer className="mt-6 flex items-center gap-3 border-t border-border/60 pt-5">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                  {testimonial.avatar ? (
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
