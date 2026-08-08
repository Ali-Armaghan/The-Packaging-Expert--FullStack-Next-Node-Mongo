"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { AgenticLoader } from "@/components/ui/AgenticLoader";
import { searchSiteContent, type SearchResultItem } from "@/lib/search";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  className?: string;
};

type SearchStatus = "idle" | "loading" | "results" | "empty";

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

function EmptySearchState({ query }: { query: string }) {
  return (
    <div className="px-4 py-6 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
          <path d="M8.5 11.5h5" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-foreground">
        No results for “{query}”
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
        We couldn&apos;t find matching packaging. Try another keyword, or browse
        products and industries.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/category"
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark"
        >
          Browse products
        </Link>
        <Link
          href="/quote"
          className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
        >
          Request a quote
        </Link>
      </div>
    </div>
  );
}

function SearchResultsList({
  results,
  onSelect,
}: {
  results: SearchResultItem[];
  onSelect: () => void;
}) {
  return (
    <ul className="max-h-80 overflow-y-auto py-2">
      {results.map((item) => (
        <li key={item.id}>
          <Link
            href={item.href}
            onClick={onSelect}
            className="flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-muted"
          >
            <span className="mt-0.5 rounded bg-primary-light px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              {item.type}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-foreground">
                {item.title}
              </span>
              <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                {item.description}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SearchBar({ className }: SearchBarProps) {
  const inputId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState("");

  const isSearching = status === "loading";

  useEffect(() => {
    if (status !== "loading") return;

    const currentQuery = query.trim();
    const timer = window.setTimeout(() => {
      const matched = searchSiteContent(currentQuery);
      setResults(matched);
      setSearchedQuery(currentQuery);
      setStatus(matched.length > 0 ? "results" : "empty");
      setPanelOpen(true);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [status, query]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setPanelOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPanelOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSearching) return;

    const trimmed = query.trim();
    if (!trimmed) {
      setStatus("empty");
      setSearchedQuery("");
      setResults([]);
      setPanelOpen(true);
      return;
    }

    setStatus("loading");
  };

  const handleSelect = () => {
    setPanelOpen(false);
    setStatus("idle");
  };

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <form role="search" onSubmit={handleSubmit}>
        <label htmlFor={inputId} className="sr-only">
          Search
        </label>

        <div
          className={cn(
            "search-field relative flex h-10 w-full items-center rounded border bg-white",
            isSearching
              ? "search-field--loading border-primary"
              : "border-border",
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
            onChange={(e) => {
              setQuery(e.target.value);
              if (status === "empty" || status === "results") {
                setStatus("idle");
                setPanelOpen(false);
              }
            }}
            onFocus={() => {
              if (status === "empty" || status === "results") {
                setPanelOpen(true);
              }
            }}
            placeholder={isSearching ? "Thinking..." : "Search..."}
            readOnly={isSearching}
            autoComplete="off"
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
            {isSearching ? (
              <AgenticLoader size="sm" label="Searching" />
            ) : (
              <SearchIcon />
            )}
          </button>
        </div>
      </form>

      {panelOpen && (status === "empty" || status === "results") && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-xl border border-border bg-white shadow-xl"
          role="listbox"
          aria-label="Search results"
        >
          {status === "empty" ? (
            <EmptySearchState
              query={searchedQuery || "your search"}
            />
          ) : (
            <SearchResultsList results={results} onSelect={handleSelect} />
          )}
        </div>
      )}
    </div>
  );
}
