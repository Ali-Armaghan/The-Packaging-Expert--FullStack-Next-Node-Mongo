"use client";

import { useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import {
  applyLinksToIndustryColumns,
  applyLinksToMegaGroups,
  applyLinksToMegaItems,
  type PublicMenuLinks,
} from "@/lib/menuLinks/apply";
import { categoryByStyleGroup } from "@/constants/categoryByStyleMenu";
import { industriesMegaMenuColumns } from "@/constants/industriesMegaMenu";
import { productsMegaMenuGroups } from "@/constants/productsMegaMenu";
import { CategoryByStyleMegaMenu } from "./CategoryByStyleMegaMenu";
import { IndustriesMegaMenu } from "./IndustriesMegaMenu";
import { PrimaryNav } from "./PrimaryNav";
import { ProductsMegaMenu } from "./ProductsMegaMenu";

type MegaMenuId = "products" | "industries" | "categoryByStyle";

type DesktopNavProps = {
  menuLinks: PublicMenuLinks;
};

export function DesktopNav({ menuLinks }: DesktopNavProps) {
  const [openMenu, setOpenMenu] = useState<MegaMenuId | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMegaMenu = (menu: MegaMenuId) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenMenu(menu);
  };

  const closeMegaMenu = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 120);
  };

  const industryColumns = applyLinksToIndustryColumns(
    industriesMegaMenuColumns,
    menuLinks.industries,
  );
  const styleItems = applyLinksToMegaItems(
    categoryByStyleGroup.items,
    menuLinks.styles,
  );
  const productGroups = applyLinksToMegaGroups(
    productsMegaMenuGroups,
    menuLinks.products,
  );

  return (
    <div className="relative">
      <Container>
        <div className="py-3">
          <PrimaryNav
            openMenu={openMenu}
            onMenuEnter={openMegaMenu}
            onMenuLeave={closeMegaMenu}
          />
        </div>
      </Container>

      <ProductsMegaMenu
        open={openMenu === "products"}
        onMouseEnter={() => openMegaMenu("products")}
        onMouseLeave={closeMegaMenu}
        groups={productGroups}
      />

      <IndustriesMegaMenu
        open={openMenu === "industries"}
        onMouseEnter={() => openMegaMenu("industries")}
        onMouseLeave={closeMegaMenu}
        columns={industryColumns}
      />

      <CategoryByStyleMegaMenu
        open={openMenu === "categoryByStyle"}
        onMouseEnter={() => openMegaMenu("categoryByStyle")}
        onMouseLeave={closeMegaMenu}
        items={styleItems}
      />
    </div>
  );
}
