"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type AnimationEvent, type CSSProperties } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  FileText,
  LogIn,
  Mail,
  Phone,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { ctaNavItem, mainNavItems, utilityNavItems } from "@/constants/navigation";
import { industriesMegaMenuColumns } from "@/constants/industriesMegaMenu";
import { categoryByStyleGroup } from "@/constants/categoryByStyleMenu";
import { productsMegaMenuGroups } from "@/constants/productsMegaMenu";
import {
  applyLinksToIndustryColumns,
  applyLinksToMegaGroups,
  applyLinksToMegaItems,
  type PublicMenuLinks,
} from "@/lib/menuLinks/apply";

type Home2StudioMenuProps = {
  open: boolean;
  onClose: () => void;
  onExited: () => void;
  menuLinks?: PublicMenuLinks;
};

const CLOSE_MS = 480;

const mainNavDescriptions: Record<string, string> = {
  Industries: "Custom packaging tailored by vertical & market sector",
  Styles: "Rigid boxes, folding cartons, corrugated & mailers",
  Category: "Full catalog of custom box styles, materials & finishes",
  Services: "Structural 3D engineering, prototyping & volume print",
  "Why Packaging Expert": "Sustainable materials, quality assurance & craft",
};

const popularIndustryIds = [
  "cosmetics",
  "ecommerce",
  "apparel",
  "bakery",
  "food",
  "jewelry",
  "electronics",
  "retail",
  "candle",
  "pharma",
];

/**
 * Premium fullscreen studio menu with multi-column layout,
 * refined typography, and full navigation options.
 */
export function Home2StudioMenu({
  open,
  onClose,
  onExited,
  menuLinks,
}: Home2StudioMenuProps) {
  const [closing, setClosing] = useState(false);

  // Dynamic link resolution if provided
  const industryColumns = useMemo(
    () =>
      applyLinksToIndustryColumns(
        industriesMegaMenuColumns,
        menuLinks?.industries ?? {},
      ),
    [menuLinks?.industries],
  );

  const styleItems = useMemo(
    () =>
      applyLinksToMegaItems(
        categoryByStyleGroup.items,
        menuLinks?.styles ?? {},
      ),
    [menuLinks?.styles],
  );

  const productGroups = useMemo(
    () =>
      applyLinksToMegaGroups(
        productsMegaMenuGroups,
        menuLinks?.products ?? {},
      ),
    [menuLinks?.products],
  );

  // Flattened popular industries list
  const popularIndustries = useMemo(() => {
    const all = industryColumns.flat();
    const map = new Map(all.map((item) => [item.id, item]));
    return popularIndustryIds
      .map((id) => map.get(id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [industryColumns]);

  // Featured styles/products
  const featuredProducts = useMemo(() => {
    const list: Array<{ id: string; title: string; href: string }> = [];
    // From products
    productGroups.forEach((g) => {
      g.items.forEach((item) => {
        if (list.length < 6) {
          list.push({ id: item.id, title: item.title, href: item.href });
        }
      });
    });
    // From styles if needed
    styleItems.forEach((item) => {
      if (list.length < 6 && !list.some((p) => p.title === item.title)) {
        list.push({ id: item.id, title: item.title, href: item.href });
      }
    });
    return list;
  }, [productGroups, styleItems]);

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

  const phoneHref = `tel:${siteConfig.contact.phone.replace(/[^+\d]/g, "")}`;

  return (
    <div
      id="home2-studio-menu"
      className={`home2-menu ${closing ? "home2-menu--closing" : "home2-menu--open"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation and studio directory"
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
        <div className="home2-menu__glow-subtle" aria-hidden="true" />

        <div className="home2-menu__inner">
          {/* Header row inside menu */}
          <div className="home2-menu__header-bar">
            <p className="home2-menu__eyebrow">
              <span className="home2-menu__eyebrow-dot" />
              Navigation &amp; Studio Directory
            </p>
            <span className="home2-menu__header-tag">
              Custom Packaging · Print · 3D Prototyping
            </span>
          </div>

          {/* Main 3-Column Content Grid */}
          <div className="home2-menu__grid">
            {/* COLUMN 1: Main Navigation Links */}
            <div className="home2-menu__col home2-menu__col--primary">
              <p className="home2-menu__section-title">
                <span className="home2-menu__section-badge">01</span>
                Explore Catalog &amp; Services
              </p>

              <nav className="home2-menu__primary-nav" aria-label="Main sections">
                {mainNavItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="home2-menu__primary-link"
                    style={{ "--home2-menu-i": index } as CSSProperties}
                    onClick={onClose}
                    tabIndex={closing ? -1 : 0}
                  >
                    <span className="home2-menu__link-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="home2-menu__link-body">
                      <span className="home2-menu__link-label">{item.label}</span>
                      <span className="home2-menu__link-desc">
                        {mainNavDescriptions[item.label] || "Explore our custom options"}
                      </span>
                    </div>
                    <ArrowRight className="home2-menu__link-arrow" aria-hidden="true" />
                  </Link>
                ))}
              </nav>
            </div>

            {/* COLUMN 2: Popular Categories & Industries */}
            <div className="home2-menu__col home2-menu__col--explore">
              {/* Popular Products/Styles */}
              <div className="home2-menu__subgroup">
                <p className="home2-menu__section-title">
                  <span className="home2-menu__section-badge">02</span>
                  Popular Box Categories
                </p>
                <div className="home2-menu__products-list">
                  {featuredProducts.map((prod) => (
                    <Link
                      key={prod.id}
                      href={prod.href}
                      className="home2-menu__product-chip"
                      onClick={onClose}
                      tabIndex={closing ? -1 : 0}
                    >
                      <Box className="home2-menu__chip-icon" aria-hidden="true" />
                      <span className="home2-menu__chip-text">{prod.title}</span>
                      <ArrowUpRight className="home2-menu__chip-arrow" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Popular Industries */}
              <div className="home2-menu__subgroup home2-menu__subgroup--tags">
                <p className="home2-menu__section-title">
                  <span className="home2-menu__section-badge">03</span>
                  Industry Verticals
                </p>
                <div className="home2-menu__industry-pills">
                  {popularIndustries.map((ind) => (
                    <Link
                      key={ind.id}
                      href={ind.href}
                      className="home2-menu__industry-pill"
                      onClick={onClose}
                      tabIndex={closing ? -1 : 0}
                    >
                      {ind.label}
                    </Link>
                  ))}
                  <Link
                    href="/industries"
                    className="home2-menu__industry-pill home2-menu__industry-pill--all"
                    onClick={onClose}
                    tabIndex={closing ? -1 : 0}
                  >
                    View All Industries →
                  </Link>
                </div>
              </div>
            </div>

            {/* COLUMN 3: Account, Resources & Direct Support */}
            <div className="home2-menu__col home2-menu__col--support">
              {/* Account & Resources Links */}
              <div className="home2-menu__subgroup">
                <p className="home2-menu__section-title">
                  <span className="home2-menu__section-badge">04</span>
                  Client Hub &amp; Resources
                </p>
                <nav className="home2-menu__util-nav" aria-label="Account and resources">
                  <Link
                    href="/sign-in"
                    className="home2-menu__util-item"
                    onClick={onClose}
                    tabIndex={closing ? -1 : 0}
                  >
                    <LogIn className="home2-menu__util-icon" aria-hidden="true" />
                    <div className="home2-menu__util-body">
                      <span className="home2-menu__util-title">Sign In</span>
                      <span className="home2-menu__util-sub">Track orders &amp; artwork proofs</span>
                    </div>
                  </Link>
                  <Link
                    href="/sign-up"
                    className="home2-menu__util-item"
                    onClick={onClose}
                    tabIndex={closing ? -1 : 0}
                  >
                    <UserPlus className="home2-menu__util-icon" aria-hidden="true" />
                    <div className="home2-menu__util-body">
                      <span className="home2-menu__util-title">Create Account</span>
                      <span className="home2-menu__util-sub">Instant ordering &amp; volume rates</span>
                    </div>
                  </Link>
                  <Link
                    href="/blog"
                    className="home2-menu__util-item"
                    onClick={onClose}
                    tabIndex={closing ? -1 : 0}
                  >
                    <FileText className="home2-menu__util-icon" aria-hidden="true" />
                    <div className="home2-menu__util-body">
                      <span className="home2-menu__util-title">Packaging Blog</span>
                      <span className="home2-menu__util-sub">Insights, guides &amp; dieline tips</span>
                    </div>
                  </Link>
                  <Link
                    href="/contact"
                    className="home2-menu__util-item"
                    onClick={onClose}
                    tabIndex={closing ? -1 : 0}
                  >
                    <Mail className="home2-menu__util-icon" aria-hidden="true" />
                    <div className="home2-menu__util-body">
                      <span className="home2-menu__util-title">Contact Us</span>
                      <span className="home2-menu__util-sub">Speak with a packaging engineer</span>
                    </div>
                  </Link>
                </nav>
              </div>

              {/* Direct Contact & Quote Card */}
              <div className="home2-menu__contact-card">
                <div className="home2-menu__card-top">
                  <span className="home2-menu__card-badge">
                    <Sparkles className="home2-menu__badge-icon" aria-hidden="true" />
                    Packaging Specialists Available
                  </span>
                </div>

                <div className="home2-menu__card-details">
                  <a
                    href={phoneHref}
                    className="home2-menu__phone-link"
                    onClick={onClose}
                    tabIndex={closing ? -1 : 0}
                  >
                    <Phone className="home2-menu__phone-icon" aria-hidden="true" />
                    <div>
                      <span className="home2-menu__phone-number">
                        {siteConfig.contact.phone}
                      </span>
                      <span className="home2-menu__phone-hours">
                        {siteConfig.contact.phoneLabel} · {siteConfig.contact.hours}
                      </span>
                    </div>
                  </a>
                </div>

                <Link
                  href={ctaNavItem.href}
                  className="home2-menu__cta-btn"
                  onClick={onClose}
                  tabIndex={closing ? -1 : 0}
                >
                  <span>{ctaNavItem.label}</span>
                  <ArrowRight className="home2-menu__cta-arrow" aria-hidden="true" />
                </Link>

                <p className="home2-menu__card-trust">
                  <span>✓ Free 3D Dieline Proof</span>
                  <span>✓ Wholesale Pricing</span>
                </p>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="home2-menu__footer">
            <p className="home2-menu__copyright">
              {siteConfig.name} © {new Date().getFullYear()} — Premium Custom Packaging &amp; Manufacturing
            </p>
            <div className="home2-menu__footer-links">
              {utilityNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="home2-menu__footer-link"
                  onClick={onClose}
                  tabIndex={closing ? -1 : 0}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
