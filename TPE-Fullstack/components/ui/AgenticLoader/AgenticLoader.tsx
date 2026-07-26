import { cn } from "@/lib/utils";

type AgenticLoaderSize = "sm" | "md" | "lg";

type AgenticLoaderProps = {
  size?: AgenticLoaderSize;
  className?: string;
  label?: string;
};

const sizeClass: Record<AgenticLoaderSize, string> = {
  sm: "agentic-loader--sm",
  md: "agentic-loader--md",
  lg: "agentic-loader--lg",
};

export function AgenticLoader({
  size = "sm",
  className,
  label,
}: AgenticLoaderProps) {
  return (
    <span
      className={cn("agentic-loader", sizeClass[size], className)}
      role="status"
      aria-label={label ?? "Loading"}
    >
      <span className="agentic-loader__orbit agentic-loader__orbit--outer" />
      <span className="agentic-loader__orbit agentic-loader__orbit--mid" />
      <span className="agentic-loader__orbit agentic-loader__orbit--inner" />
      <span className="agentic-loader__core" />
      <span className="sr-only">{label ?? "Loading"}</span>
    </span>
  );
}
