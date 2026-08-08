import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-black/[0.06]", className)}
      aria-hidden="true"
    />
  );
}

function PostCardBone() {
  return (
    <div className="space-y-3">
      <Bone className="aspect-[16/10] w-full rounded-xl" />
      <Bone className="h-3 w-20" />
      <Bone className="h-5 w-[90%]" />
      <Bone className="h-4 w-[70%]" />
    </div>
  );
}

/** Content-only skeleton — blog header/footer stay visible from layout. */
export function BlogIndexSkeleton() {
  return (
    <div
      className="bg-gradient-to-b from-[#f4faf7] via-white to-white"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading blog posts"
    >
      <section className="py-8 sm:py-10 lg:py-12">
        <Container>
          <Bone className="h-3 w-16" />
          <Bone className="mt-2 h-9 w-64 max-w-full" />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4">
              <Bone className="aspect-[16/9] w-full rounded-2xl" />
              <Bone className="h-3 w-24" />
              <Bone className="h-7 w-[85%]" />
              <Bone className="h-4 w-full" />
              <Bone className="h-4 w-[75%]" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Bone className="h-20 w-24 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1 space-y-2 pt-1">
                    <Bone className="h-3 w-16" />
                    <Bone className="h-4 w-full" />
                    <Bone className="h-4 w-[70%]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-black/5 py-10 sm:py-12">
        <Container>
          <Bone className="mb-6 h-7 w-40" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <PostCardBone key={i} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
