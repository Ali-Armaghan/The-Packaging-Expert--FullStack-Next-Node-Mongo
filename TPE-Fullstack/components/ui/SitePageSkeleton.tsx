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

/** Full-viewport placeholder so the footer stays pinned while routes load. */
export function SitePageSkeleton() {
  return (
    <div
      className="flex min-h-[calc(100dvh-8.5rem)] flex-col"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="relative min-h-[min(52vh,480px)] overflow-hidden bg-[#1a1f2c]">
        <Bone className="absolute inset-0 rounded-none opacity-40" />
        <Container className="relative z-10 flex min-h-[min(52vh,480px)] items-center py-14">
          <div className="max-w-xl space-y-4">
            <Bone className="h-10 w-[90%] max-w-md bg-white/15" />
            <Bone className="h-10 w-[70%] max-w-sm bg-white/15" />
            <Bone className="mt-2 h-4 w-full max-w-lg bg-white/10" />
            <Bone className="h-4 w-[80%] max-w-md bg-white/10" />
            <div className="flex gap-3 pt-4">
              <Bone className="h-11 w-36 rounded-full bg-white/20" />
              <Bone className="h-11 w-36 rounded-full bg-white/15" />
            </div>
          </div>
        </Container>
      </div>

      <div className="bg-white py-14">
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
      </div>

      <div className="flex-1 bg-muted py-14">
        <Container>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <Bone className="h-8 w-80 max-w-full" />
              <Bone className="h-4 w-full max-w-lg" />
            </div>
            <Bone className="h-11 w-44 rounded-full" />
          </div>
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
                  <Bone className="h-3 w-[80%]" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
}
