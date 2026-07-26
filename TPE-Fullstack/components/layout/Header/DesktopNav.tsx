"use client";

import { useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { CategoryByStyleMegaMenu } from "./CategoryByStyleMegaMenu";
import { IndustriesMegaMenu } from "./IndustriesMegaMenu";
import { PrimaryNav } from "./PrimaryNav";
import { ProductsMegaMenu } from "./ProductsMegaMenu";

type MegaMenuId = "products" | "industries" | "categoryByStyle";

export function DesktopNav() {
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
      />

      <IndustriesMegaMenu
        open={openMenu === "industries"}
        onMouseEnter={() => openMegaMenu("industries")}
        onMouseLeave={closeMegaMenu}
      />

      <CategoryByStyleMegaMenu
        open={openMenu === "categoryByStyle"}
        onMouseEnter={() => openMegaMenu("categoryByStyle")}
        onMouseLeave={closeMegaMenu}
      />
    </div>
  );
}
