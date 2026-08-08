"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import {
  blogHeaderNavItems as fallbackNavItems,
  blogHeaderSocialLinks,
  type BlogHeaderNavItem,
} from "@/constants/blogHeader";
import { cn } from "@/lib/utils";

function SocialIcon({
  icon,
}: {
  icon: (typeof blogHeaderSocialLinks)[number]["icon"];
}) {
  const className = "h-4 w-4";

  switch (icon) {
    case "instagram":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case "facebook":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.062 2.062 0 114.127 0 2.062 2.062 0 01-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "pinterest":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.247 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
        </svg>
      );
    case "twitter":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
        </svg>
      );
  }
}

function NavChevron() {
  return (
    <svg
      className="h-3 w-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}

function BlogNavDropdown({ item }: { item: BlogHeaderNavItem }) {
  const [open, setOpen] = useState(false);

  if (!item.children?.length) {
    return (
      <Link
        href={item.href}
        className="text-sm font-medium text-foreground transition-colors hover:text-[#1b4332]"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={item.href}
        className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-[#1b4332]"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <NavChevron />
      </Link>

      <div
        className={cn(
          "absolute top-full left-0 z-50 mt-2 min-w-[200px] rounded-md border border-border bg-white py-2 shadow-lg transition-all duration-150",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0",
        )}
      >
        {item.children.map((child) => (
          <Link
            key={`${child.label}-${child.href}`}
            href={child.href}
            className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted hover:text-[#1b4332]"
          >
            {child.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function BlogSearchBar() {
  const [query, setQuery] = useState("");

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex w-full max-w-[280px] items-stretch"
    >
      <label htmlFor="blog-search" className="sr-only">
        Search blog
      </label>
      <input
        id="blog-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type To Start Searchin..."
        className="h-10 min-w-0 flex-1 rounded-l-md border border-r-0 border-border bg-white px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#1b4332] focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Search"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-r-md bg-[#1a1f2c] text-white transition-colors hover:bg-[#1b4332]"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="M20 20l-3-3" />
        </svg>
      </button>
    </form>
  );
}

type BlogHeaderProps = {
  navItems?: BlogHeaderNavItem[];
};

export function BlogHeader({ navItems }: BlogHeaderProps) {
  const items =
    navItems && navItems.length > 0 ? navItems : fallbackNavItems;

  return (
    <header
      id="site-header"
      className="relative z-40 w-full bg-white"
      style={{ viewTransitionName: "site-header" }}
    >
      <Container>
        <div className="flex items-center justify-between gap-4 py-4 sm:py-5">
          <Logo className="shrink-0" />

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden items-center gap-2 sm:flex">
              {blogHeaderSocialLinks.map((social) => (
                <Link
                  key={social.icon}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1f2c] text-white transition-colors hover:bg-[#1b4332]"
                >
                  <SocialIcon icon={social.icon} />
                </Link>
              ))}
            </div>

            <Link
              href="/quote"
              className="hidden rounded-md bg-[#1b4332] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#153427] sm:inline-block sm:text-sm"
            >
              Get Your Custom Quote
            </Link>
          </div>
        </div>
      </Container>

      <div className="border-t border-border/70">
        <Container className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="shrink-0 text-[1.75rem] font-bold leading-none tracking-tight text-[#1b4332] sm:text-[2rem]">
            Blog
          </h1>

          <nav
            aria-label="Blog navigation"
            className="hidden flex-wrap items-center gap-x-6 gap-y-2 lg:flex lg:flex-1 lg:justify-center"
          >
            {items.map((item) => (
              <BlogNavDropdown key={`${item.label}-${item.href}`} item={item} />
            ))}
          </nav>

          <div className="w-full lg:w-auto lg:shrink-0">
            <BlogSearchBar />
          </div>
        </Container>
      </div>

      <div className="border-b border-border/70" />
    </header>
  );
}
