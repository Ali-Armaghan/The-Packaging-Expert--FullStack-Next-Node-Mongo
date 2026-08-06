export const MENU_HUB_KEYS = ["industries", "styles", "products"] as const;
export type MenuHubKey = (typeof MENU_HUB_KEYS)[number];

export type MenuHubCta = {
  label: string;
  href: string;
};

export type MenuHubItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
  icon: string;
};

export type MenuHubSection = {
  id: string;
  title: string;
  description: string;
  items: MenuHubItem[];
};

export type MenuHubHighlight = {
  id: string;
  title: string;
  description: string;
  image: string;
};

/** Static page content for Industries / Styles / Products hubs. */
export type MenuHubContent = {
  hubKey: MenuHubKey;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    primaryCta: MenuHubCta;
    secondaryCta: MenuHubCta;
  };
  intro: {
    title: string;
    body: string;
    image: string;
    imageAlt: string;
  };
  highlights: MenuHubHighlight[];
  sections: MenuHubSection[];
  ctaBand: {
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
    image: string;
  };
};
