import { Container } from "@/components/ui/Container";

export default function BlogPostLoading() {
  return (
    <div
      className="min-h-[60vh] bg-gradient-to-b from-[#f4faf7] via-white to-white py-10 sm:py-14"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading article"
    >
      <Container className="max-w-3xl space-y-6">
        <div className="h-4 w-28 animate-pulse rounded bg-black/5" />
        <div className="h-3 w-24 animate-pulse rounded bg-primary/20" />
        <div className="h-10 w-full max-w-xl animate-pulse rounded bg-black/5" />
        <div className="h-4 w-48 animate-pulse rounded bg-black/5" />
        <div className="aspect-[16/9] w-full animate-pulse rounded-2xl bg-black/5" />
        <div className="space-y-3 pt-4">
          <div className="h-3 w-full animate-pulse rounded bg-black/5" />
          <div className="h-3 w-[95%] animate-pulse rounded bg-black/5" />
          <div className="h-3 w-[90%] animate-pulse rounded bg-black/5" />
          <div className="h-3 w-[85%] animate-pulse rounded bg-black/5" />
        </div>
      </Container>
    </div>
  );
}
