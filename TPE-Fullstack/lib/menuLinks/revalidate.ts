import { revalidatePath, revalidateTag } from "next/cache";
import { menuLinksTag } from "@/lib/menuLinks/cache";
import type { MenuLinkKey } from "@/types/menuLinks";

const IMMEDIATE = { expire: 0 } as const;

const HUB_PATH: Record<MenuLinkKey, string> = {
  industries: "/industries",
  styles: "/style",
  products: "/category",
};

export function revalidateMenuLinks(menuKey: MenuLinkKey) {
  revalidateTag(menuLinksTag(menuKey), IMMEDIATE);
  revalidateTag(menuLinksTag(), IMMEDIATE);
  revalidatePath(HUB_PATH[menuKey]);
  revalidatePath("/", "layout");
}
