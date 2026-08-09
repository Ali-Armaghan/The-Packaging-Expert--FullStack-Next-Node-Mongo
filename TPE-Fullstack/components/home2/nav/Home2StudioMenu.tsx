"use client";

import Link from "next/link";
import { useEffect, useState, type AnimationEvent, type CSSProperties } from "react";
import { ctaNavItem, utilityNavItems } from "@/constants/navigation";

type Home2StudioMenuProps = {
  open: boolean;
  onClose: () => void;
  onExited: () => void;
};

const CLOSE_MS = 520;

/** Links that are NOT in the top bar — shown as the menu's main list. */
const menuLinks = utilityNavItems.map((item, index) => ({
  ...item,
  index: String(index + 1).padStart(2, "0"),
}));

/**
 * Fullscreen studio menu with enter + exit animations.
 * Stays mounted while closing so the conceal animation can finish.
 */
export function Home2StudioMenu({ open, onClose, onExited }: Home2StudioMenuProps) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setClosing(false);
      return;
    }
    setClosing(true);
    const timeout = window.setTimeout(onExited, CLOSE_MS);
    return () => window.clearTimeout(timeout);
  }, [open, onExited]);

  useEffect(() => {
    if (!open || closing) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closing, onClose]);

  const onPanelAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (
      closing &&
      event.target === event.currentTarget &&
      event.animationName === "home2-menu-conceal"
    ) {
      onExited();
    }
  };

  return (
    <div
      id="home2-studio-menu"
      className={`home2-menu ${closing ? "home2-menu--closing" : "home2-menu--open"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Account and support menu"
      aria-hidden={closing}
    >
      <div
        className="home2-menu__veil"
        onClick={closing ? undefined : onClose}
      />

      <div
        className="home2-menu__panel"
        onAnimationEnd={onPanelAnimationEnd}
      >
        <div className="home2-menu__grain" aria-hidden="true" />
        <div className="home2-menu__glow" aria-hidden="true" />

        <div className="home2-menu__inner">
          <p className="home2-menu__eyebrow">
            <span className="home2-menu__eyebrow-dot" />
            Account & support
          </p>

          <nav className="home2-menu__nav" aria-label="Account and support">
            {menuLinks.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="home2-menu__link"
                style={{ "--home2-menu-i": index } as CSSProperties}
                onClick={onClose}
                tabIndex={closing ? -1 : 0}
              >
                <span className="home2-menu__index">{item.index}</span>
                <span className="home2-menu__label">{item.label}</span>
                <span className="home2-menu__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </nav>

          <div className="home2-menu__footer">
            <Link
              href={ctaNavItem.href}
              className="home2-menu__utility-link"
              onClick={onClose}
              tabIndex={closing ? -1 : 0}
            >
              {ctaNavItem.label}
            </Link>
            <p className="home2-menu__note">Custom boxes · Print · Logistics</p>
          </div>
        </div>
      </div>
    </div>
  );
}
