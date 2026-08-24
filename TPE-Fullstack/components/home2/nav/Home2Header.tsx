"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { ctaNavItem } from "@/constants/navigation";
import type { PublicMenuLinks } from "@/lib/menuLinks/apply";
import { Home2NavLinks } from "./Home2NavLinks";
import { Home2StudioMenu } from "./Home2StudioMenu";

type Home2HeaderProps = {
  menuLinks: PublicMenuLinks;
};

/**
 * Premium glass studio header for the home2 experience (/, /products/*).
 * Floating glass pill at top; animates flush + full-width on scroll.
 */
export function Home2Header({ menuLinks }: Home2HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPresent, setMenuPresent] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("home2-route");
    return () => {
      document.documentElement.classList.remove("home2-route");
    };
  }, []);

  useEffect(() => {
    if (!menuPresent) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuPresent]);

  const openMenu = () => {
    setMenuOpen(true);
    setMenuPresent(true);
  };

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const onMenuExited = useCallback(() => {
    setMenuPresent(false);
  }, []);

  return (
    <>
      <header
        id="site-header"
        className={`home2-nav ${scrolled ? "home2-nav--solid" : ""} ${menuPresent ? "home2-nav--menu-open" : ""}`}
      >
        <div className="home2-nav__shell">
          <div className="home2-nav__bar">
            <Link
              href="/"
              className="home2-nav__brand"
              aria-label={`${siteConfig.name} — Home`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo/logo-white.png"
                alt={siteConfig.name}
                width={220}
                height={50}
                className="home2-nav__logo"
              />
            </Link>

            <Home2NavLinks menuLinks={menuLinks} />

            <div className="home2-nav__actions">
              <Link href={ctaNavItem.href} className="home2-nav__cta">
                {ctaNavItem.label}
              </Link>

              <button
                type="button"
                className="home2-nav__toggle"
                aria-expanded={menuOpen}
                aria-controls="home2-studio-menu"
                aria-label={menuPresent ? "Close menu" : "Open menu"}
                onClick={() => (menuOpen ? closeMenu() : openMenu())}
              >
                <span className="home2-nav__toggle-lines" aria-hidden="true">
                  <span />
                  <span />
                </span>
                <span className="home2-nav__toggle-label" aria-hidden="true">
                  <span
                    className={`home2-nav__toggle-word ${menuPresent ? "" : "home2-nav__toggle-word--active"}`}
                  >
                    Menu
                  </span>
                  <span
                    className={`home2-nav__toggle-word ${menuPresent ? "home2-nav__toggle-word--active" : ""}`}
                  >
                    Close
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {menuPresent ? (
        <Home2StudioMenu
          open={menuOpen}
          onClose={closeMenu}
          onExited={onMenuExited}
          menuLinks={menuLinks}
        />
      ) : null}
    </>
  );
}
