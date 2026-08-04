import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import type { HomeSectionKey } from "@/types/homePage";

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-black/[0.06]", className)}
      aria-hidden="true"
    />
  );
}

type HomeSectionSkeletonProps = {
  section: Exclude<HomeSectionKey, "hero">;
};

export function HomeSectionSkeleton({ section }: HomeSectionSkeletonProps) {
  if (section === "features") {
    return (
      <section className="bg-white py-14 sm:py-16 lg:py-20" aria-hidden="true">
        <Container>
          <Bone className="h-8 w-72 max-w-full" />
          <Bone className="mt-3 h-4 w-full max-w-xl" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-[#f3f4f6] p-6">
                <Bone className="mb-5 h-8 w-8 rounded-md" />
                <Bone className="h-5 w-[75%]" />
                <Bone className="mt-3 h-3 w-full" />
                <Bone className="mt-2 h-3 w-[85%]" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (section === "expertise") {
    return (
      <section className="bg-muted py-14 sm:py-16 lg:py-20" aria-hidden="true">
        <Container>
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <Bone className="h-8 w-64 max-w-full" />
              <Bone className="h-4 w-full" />
              <Bone className="h-4 w-[90%]" />
              <Bone className="h-4 w-[80%]" />
            </div>
            <Bone className="aspect-[4/3] w-full rounded-2xl" />
          </div>
        </Container>
      </section>
    );
  }

  if (section === "catalog" || section === "industries") {
    return (
      <section
        className={cn(
          "py-14 sm:py-16 lg:py-20",
          section === "catalog" ? "bg-muted" : "bg-white",
        )}
        aria-hidden="true"
      >
        <Container>
          <Bone className="h-8 w-80 max-w-full" />
          <Bone className="mt-3 h-4 w-full max-w-lg" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-border/60 bg-white"
              >
                <Bone className="aspect-[4/3] w-full rounded-none" />
                <div className="space-y-2 p-5">
                  <Bone className="h-5 w-[65%]" />
                  <Bone className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (section === "sustainability") {
    return (
      <section className="bg-muted py-14 sm:py-16 lg:py-20" aria-hidden="true">
        <Container>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Bone key={i} className="aspect-[16/9] w-full rounded-2xl" />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (section === "howItWorks") {
    return (
      <section className="bg-white py-14 sm:py-16 lg:py-20" aria-hidden="true">
        <Container>
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <Bone className="mx-auto h-14 w-14 rounded-full" />
            <Bone className="mx-auto h-8 w-80 max-w-full" />
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-primary-light/40 p-5">
                <Bone className="mb-4 h-6 w-6" />
                <Bone className="h-5 w-[70%]" />
                <Bone className="mt-3 h-3 w-full" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (section === "testimonials") {
    return (
      <section className="bg-white py-14 sm:py-16 lg:py-20" aria-hidden="true">
        <Container>
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <Bone className="mx-auto h-8 w-72 max-w-full" />
            <Bone className="mx-auto h-4 w-full max-w-md" />
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/60 p-6"
              >
                <Bone className="h-4 w-24" />
                <Bone className="mt-4 h-3 w-full" />
                <Bone className="mt-2 h-3 w-[90%]" />
                <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-5">
                  <Bone className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Bone className="h-3 w-24" />
                    <Bone className="h-3 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (section === "faq") {
    return (
      <section className="bg-muted py-14 sm:py-16 lg:py-20" aria-hidden="true">
        <Container>
          <Bone className="mx-auto h-8 w-64 max-w-full" />
          <div className="mx-auto mt-10 max-w-3xl space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Bone key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  // instagram
  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20" aria-hidden="true">
      <Container>
        <div className="mx-auto max-w-sm space-y-3 text-center">
          <Bone className="mx-auto h-8 w-56" />
          <Bone className="mx-auto h-5 w-40" />
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Bone key={i} className="aspect-square w-full rounded-xl" />
          ))}
        </div>
      </Container>
    </section>
  );
}
