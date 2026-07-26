"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  className?: string;
};

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function AgenticLoader() {
  return (
    <span className="search-loader" aria-hidden="true">
      <span className="search-loader__ring search-loader__ring--outer" />
      <span className="search-loader__ring search-loader__ring--inner" />
      <span className="search-loader__dot" />
    </span>
  );
}

export function SearchBar({ className }: SearchBarProps) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isSearching) return;

    const timer = window.setTimeout(() => {
      setIsSearching(false);
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [isSearching]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSearching) return;
    setIsSearching(true);
  };

  return (
    <form
      role="search"
      className={cn("w-full", className)}
      onSubmit={handleSubmit}
    >
      <label htmlFor={inputId} className="sr-only">
        Search
      </label>

      <div
        className={cn(
          "search-field relative flex h-10 w-full items-center rounded border bg-white",
          isSearching ? "search-field--loading border-primary" : "border-border",
        )}
      >
        {isSearching && (
          <span className="search-field__shimmer" aria-hidden="true" />
        )}

        <input
          id={inputId}
          type="text"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isSearching ? "Thinking..." : "Search..."}
          readOnly={isSearching}
          className={cn(
            "relative z-[1] h-full w-full min-w-0 flex-1 rounded bg-transparent py-2 pl-4 pr-11 text-sm text-foreground outline-none placeholder:text-muted-foreground",
            isSearching && "cursor-wait caret-transparent",
          )}
        />

        <button
          type="submit"
          disabled={isSearching}
          className={cn(
            "absolute inset-y-0 right-0 z-[1] flex w-11 items-center justify-center",
            isSearching
              ? "text-primary"
              : "text-muted-foreground hover:text-primary",
          )}
          aria-label={isSearching ? "Searching" : "Search"}
          aria-busy={isSearching}
        >
          {isSearching ? <AgenticLoader /> : <SearchIcon />}
        </button>
      </div>
    </form>
  );
}
