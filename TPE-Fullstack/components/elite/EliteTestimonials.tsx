import Image from "next/image";
import type { EliteTestimonialsContent } from "@/types/elitePage";
import { ElitePrimaryBtn, EliteSectionEyebrow, EliteStarRow } from "./ui";

export function EliteTestimonials({
  content,
}: {
  content: EliteTestimonialsContent;
}) {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <EliteSectionEyebrow>{content.eyebrow}</EliteSectionEyebrow>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[color:var(--elite-ink)] sm:text-4xl">
            {content.title}
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {content.reviews.map((review) => (
            <article
              key={review.name}
              className="group overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-black/[0.06] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-32px_rgba(20,24,32,0.45)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={review.image}
                  alt=""
                  fill
                  loading="lazy"
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <EliteStarRow />
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  “{review.quote}”
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-black/5 pt-5">
                  <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-primary/20">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      fill
                      loading="lazy"
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[color:var(--elite-ink)]">
                      {review.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{review.role}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-12 text-center">
          <ElitePrimaryBtn href={content.cta.href}>
            {content.cta.label}
          </ElitePrimaryBtn>
        </div>
      </div>
    </section>
  );
}
