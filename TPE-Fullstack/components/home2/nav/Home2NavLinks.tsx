"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { categoryByStyleGroup } from "@/constants/categoryByStyleMenu";
import { industriesMegaMenuColumns } from "@/constants/industriesMegaMenu";
import { mainNavItems } from "@/constants/navigation";
import { productsMegaMenuGroups } from "@/constants/productsMegaMenu";
import {
  applyLinksToIndustryColumns,
  applyLinksToMegaGroups,
  applyLinksToMegaItems,
  type PublicMenuLinks,
} from "@/lib/menuLinks/apply";

type MegaId = "industries" | "styles" | "category";

const megaByLabel: Record<string, MegaId> = {
  Industries: "industries",
  Styles: "styles",
  Category: "category",
};

type Home2NavLinksProps = {
  menuLinks: PublicMenuLinks;
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`home2-dd__chevron ${open ? "home2-dd__chevron--open" : ""}`}
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

/**
 * Top-bar links with dark glass hover dropdowns.
 * Options match the old site mega menus; layout is scoped to /home2 only.
 */
export function Home2NavLinks({ menuLinks }: Home2NavLinksProps) {
  const [openMenu, setOpenMenu] = useState<MegaId | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const industryColumns = useMemo(
    () =>
      applyLinksToIndustryColumns(
        industriesMegaMenuColumns,
        menuLinks.industries,
      ),
    [menuLinks.industries],
  );

  const styleItems = useMemo(
    () => applyLinksToMegaItems(categoryByStyleGroup.items, menuLinks.styles),
    [menuLinks.styles],
  );

  const productGroups = useMemo(
    () => applyLinksToMegaGroups(productsMegaMenuGroups, menuLinks.products),
    [menuLinks.products],
  );

  const open = (id: MegaId) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpenMenu(id);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };

  const closeNow = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpenMenu(null);
  };

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  return (
    <nav className="home2-nav__links" aria-label="Primary">
      {mainNavItems.map(({ label, href }) => {
        const megaId = megaByLabel[label];
        const isOpen = openMenu === megaId;

        if (!megaId) {
          return (
            <Link key={href} href={href} className="home2-nav__link">
              <span>{label}</span>
            </Link>
          );
        }

        return (
          <div
            key={href}
            className={`home2-dd ${isOpen ? "home2-dd--open" : ""}`}
            onMouseEnter={() => open(megaId)}
            onMouseLeave={scheduleClose}
          >
            <Link
              href={href}
              className="home2-nav__link home2-dd__trigger"
              aria-expanded={isOpen}
              aria-haspopup="true"
              onClick={closeNow}
            >
              <span>{label}</span>
              <Chevron open={isOpen} />
            </Link>

            <div
              className={`home2-dd__panel home2-dd__panel--${megaId}`}
              role="menu"
              aria-hidden={!isOpen}
              onMouseEnter={() => open(megaId)}
              onMouseLeave={scheduleClose}
            >
              {megaId === "industries" ? (
                <div className="home2-dd__cols">
                  {industryColumns.map((column, colIndex) => (
                    <ul key={colIndex} className="home2-dd__list">
                      {column.map((item) => (
                        <li key={item.id}>
                          <Link
                            href={item.href}
                            className="home2-dd__item"
                            role="menuitem"
                            onClick={closeNow}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              ) : null}

              {megaId === "styles" ? (
                <ul className="home2-dd__cards">
                  {styleItems.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className="home2-dd__card"
                        role="menuitem"
                        onClick={closeNow}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt=""
                          className="home2-dd__card-img"
                          width={72}
                          height={72}
                        />
                        <span className="home2-dd__card-copy">
                          <span className="home2-dd__card-title">
                            {item.title}
                          </span>
                          <span className="home2-dd__card-desc">
                            {item.description}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}

              {megaId === "category" ? (
                <div className="home2-dd__groups">
                  {productGroups.map((group) => (
                    <div key={group.title} className="home2-dd__group">
                      <p className="home2-dd__group-title">{group.title}</p>
                      <ul className="home2-dd__list">
                        {group.items.map((item) => (
                          <li key={item.id}>
                            <Link
                              href={item.href}
                              className="home2-dd__item home2-dd__item--rich"
                              role="menuitem"
                              onClick={closeNow}
                            >
                              <span className="home2-dd__item-title">
                                {item.title}
                              </span>
                              <span className="home2-dd__item-desc">
                                {item.description}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="home2-dd__footer">
                <Link
                  href={href}
                  className="home2-dd__view-all"
                  onClick={closeNow}
                >
                  View all {label.toLowerCase()}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
