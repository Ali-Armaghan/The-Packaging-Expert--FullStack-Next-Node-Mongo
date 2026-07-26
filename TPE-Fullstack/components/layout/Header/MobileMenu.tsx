"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { utilityNavItems } from "@/constants/navigation";
import { NavCTA, PrimaryNav } from "./PrimaryNav";
import { SearchBar } from "./SearchBar";
import { cn } from "@/lib/utils";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { contact } = siteConfig;
  const phoneHref = `tel:${contact.phone.replace(/[^+\d]/g, "")}`;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const header = document.getElementById("site-header");
    if (!header) return;

    const updateOffset = () => {
      document.documentElement.style.setProperty(
        "--header-offset",
        `${header.getBoundingClientRect().height}px`,
      );
    };

    updateOffset();
    const observer = new ResizeObserver(updateOffset);
    observer.observe(header);
    window.addEventListener("resize", updateOffset);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateOffset);
    };
  }, []);

  const close = () => setIsOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex size-10 items-center justify-center rounded border border-border text-navy transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <span className="relative size-5">
          <span
            className={cn(
              "absolute left-0 block h-0.5 w-5 bg-current transition-all duration-200",
              isOpen ? "top-2 rotate-45" : "top-1",
            )}
          />
          <span
            className={cn(
              "absolute left-0 top-2 block h-0.5 w-5 bg-current transition-all duration-200",
              isOpen && "opacity-0",
            )}
          />
          <span
            className={cn(
              "absolute left-0 block h-0.5 w-5 bg-current transition-all duration-200",
              isOpen ? "top-2 -rotate-45" : "top-3",
            )}
          />
        </span>
      </button>

      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-0 bottom-0 top-[var(--header-offset,120px)] z-40 overflow-y-auto bg-white transition-opacity duration-200",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col gap-6 p-4">
          <div className="border-b border-border pb-4">
            <SearchBar />
          </div>

          <div className="border-b border-border pb-4">
            <p className="text-xs text-muted-foreground">{contact.phoneLabel}</p>
            <Link
              href={phoneHref}
              onClick={close}
              className="text-lg font-bold text-primary"
            >
              {contact.phone}
            </Link>
          </div>

          <PrimaryNav onNavigate={close} vertical />

          <nav aria-label="Utility navigation">
            <ul className="flex flex-col gap-2">
              {utilityNavItems.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={close}
                    className="block px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <NavCTA onNavigate={close} />
        </div>
      </div>
    </div>
  );
}
