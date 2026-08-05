import Link from "next/link";
import { cn } from "@/lib/utils";

export function ElitePrimaryBtn({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-primary px-8 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(52,173,120,0.7)] transition duration-300 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_16px_36px_-14px_rgba(52,173,120,0.75)]",
        className,
      )}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 translate-y-full bg-white/15 transition duration-300 group-hover:translate-y-0" />
    </Link>
  );
}

export function EliteOutlineBtn({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-full border border-primary/40 bg-white/70 px-8 text-sm font-semibold text-primary backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary-light",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function EliteSectionEyebrow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
      <span className="h-px w-6 bg-primary/70" aria-hidden />
      {children}
    </p>
  );
}

export function EliteStarRow() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="h-4 w-4 fill-primary"
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}
