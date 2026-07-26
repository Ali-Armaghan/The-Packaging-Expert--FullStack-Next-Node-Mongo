"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ctaNavItem, mainNavItems } from "@/constants/navigation";
import { cn } from "@/lib/utils";

type MegaMenuId = "products" | "industries" | "categoryByStyle";

type PrimaryNavProps = {
  onNavigate?: () => void;
  className?: string;
  vertical?: boolean;
  openMenu?: MegaMenuId | null;
  onMenuEnter?: (menu: MegaMenuId) => void;
  onMenuLeave?: () => void;
};

const megaMenuNavItems: Record<string, MegaMenuId> = {
  Products: "products",
  Industries: "industries",
  Styles: "categoryByStyle",
};

function NavChevron({ open }: { open?: boolean }) {
  return (
    <svg
      className={cn(
        "h-3 w-3 transition-transform duration-200",
        open && "rotate-180",
      )}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function PrimaryNav({
  onNavigate,
  className,
  vertical = false,
  openMenu = null,
  onMenuEnter,
  onMenuLeave,
}: PrimaryNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex items-center",
        vertical ? "flex-col items-stretch gap-1" : "justify-between",
        className,
      )}
      aria-label="Main navigation"
    >
      <ul
        className={cn(
          "flex",
          vertical ? "flex-col gap-1" : "items-center gap-8",
        )}
      >
        {mainNavItems.map(({ label, href }) => {
          const megaMenuId = megaMenuNavItems[label];
          const isMegaMenuItem = Boolean(megaMenuId) && !vertical;
          const isMenuOpen = openMenu === megaMenuId;
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          if (isMegaMenuItem && megaMenuId) {
            return (
              <li
                key={href}
                onMouseEnter={() => onMenuEnter?.(megaMenuId)}
                onMouseLeave={onMenuLeave}
              >
                <Link
                  href={href}
                  className={cn(
                    "inline-flex items-center gap-1 text-[0.9375rem] font-medium tracking-tight text-navy/85 transition-colors hover:text-primary",
                    (isActive || isMenuOpen) && "text-primary",
                  )}
                  aria-expanded={isMenuOpen}
                  aria-haspopup="true"
                >
                  {label}
                  <NavChevron open={isMenuOpen} />
                </Link>
              </li>
            );
          }

          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                className={cn(
                  "text-[0.9375rem] font-medium tracking-tight text-navy/85 transition-colors hover:text-primary",
                  vertical && "block rounded-md px-4 py-3",
                  vertical && isActive && "bg-primary-light text-primary",
                  !vertical && isActive && "text-primary",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      {!vertical && (
        <Link
          href={ctaNavItem.href}
          className="rounded bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          {ctaNavItem.label}
        </Link>
      )}
    </nav>
  );
}

export function NavCTA({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href={ctaNavItem.href}
      onClick={onNavigate}
      className="block rounded bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
    >
      {ctaNavItem.label}
    </Link>
  );
}
