"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  className?: string;
};

export function SearchBar({ className }: SearchBarProps) {
  const [query, setQuery] = useState("");

  return (
    <form
      role="search"
      className={cn("w-full", className)}
      onSubmit={(e) => e.preventDefault()}
    >
      <label htmlFor="site-search" className="sr-only">
        Search
      </label>
      <input
        id="site-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="h-10 w-full rounded border border-border bg-white px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </form>
  );
}
