import { cn } from "@/lib/utils";

type BoxesLoaderProps = {
  className?: string;
};

/** 3D packing-boxes splash loader (brand greens). */
export function BoxesLoader({ className }: BoxesLoaderProps) {
  return (
    <div className={cn("boxes-loader", className)} aria-hidden="true">
      <div className="boxes-loader__ground">
        <div />
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={`boxes-loader__box boxes-loader__box--${i}`}>
          <div />
        </div>
      ))}
    </div>
  );
}
