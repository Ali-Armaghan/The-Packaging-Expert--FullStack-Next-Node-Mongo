import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { expertiseContent } from "@/constants/expertise";

export function Expertise() {
  return (
    <section className="bg-muted py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <h2 className="section-heading">{expertiseContent.title}</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {expertiseContent.description}
            </p>
          </div>

          <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-2xl bg-white shadow-sm lg:order-2">
            <Image
              src={expertiseContent.image}
              alt={expertiseContent.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
