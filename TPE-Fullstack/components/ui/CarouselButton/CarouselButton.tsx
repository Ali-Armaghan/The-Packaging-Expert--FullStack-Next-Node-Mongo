import { cn } from "@/lib/utils";

type CarouselButtonProps = {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
  label?: string;
};

export function CarouselButton({
  direction,
  onClick,
  disabled,
  label,
}: CarouselButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={
        label ??
        (direction === "prev" ? "Previous slide" : "Next slide")
      }
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        {direction === "prev" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
        )}
      </svg>
    </button>
  );
}

export function carouselTrackClassName(className?: string) {
  return cn(
    "carousel-track flex snap-x snap-mandatory gap-6",
    className,
  );
}
