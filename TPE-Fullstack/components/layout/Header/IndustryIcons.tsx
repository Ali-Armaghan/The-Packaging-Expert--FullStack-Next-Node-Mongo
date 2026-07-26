import type { ReactNode } from "react";
import type { IndustryMegaMenuItem } from "@/constants/industriesMegaMenu";

type IndustryIconProps = {
  icon: IndustryMegaMenuItem["icon"];
  className?: string;
};

const iconClass = "h-6 w-6 shrink-0";

function IconShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      className={className ?? iconClass}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function IndustryIcon({ icon, className }: IndustryIconProps) {
  switch (icon) {
    case "apparel":
      return (
        <IconShell className={className}>
          {/* T-shirt */}
          <path d="M4.5 7.5L8 5.5h2l2 2 2-2h2l3.5 2-1.5 3H16v8H8v-8H6L4.5 7.5z" />
          {/* Pants */}
          <path d="M17.5 14.5h2.5l.5 6.5h-2l-.3-3.5-.7 3.5h-2l.5-6.5h2z" />
        </IconShell>
      );

    case "bakery":
      return (
        <IconShell className={className}>
          {/* Loaf */}
          <path d="M3.5 14.5c0-2.2 1.8-4 4-4h2c1.5 0 2.8.8 3.5 2 .7-1.2 2-2 3.5-2h.5c2 0 3.5 1.6 3.5 3.5 0 .8-.3 1.5-.8 2H4.3c-.5-.5-.8-1.2-.8-2z" />
          <path d="M5 16.5h14v1.5H5z" />
          {/* Cake slice */}
          <path d="M14.5 7.5 18 6l2.5 4.5-3.5 1.5z" />
          <path d="M16.2 8.2l1.2-.4" />
        </IconShell>
      );

    case "beer":
      return (
        <IconShell className={className}>
          {/* Can */}
          <rect x="4" y="5" width="6" height="14" rx="1.2" />
          <path d="M5 8h4M5 16h4" />
          {/* Bottle */}
          <path d="M14.5 3.5h3v2.5l1.5 2V19a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 0113 19V8l1.5-2V3.5z" />
          <path d="M14.5 10.5h3" />
        </IconShell>
      );

    case "beverage":
      return (
        <IconShell className={className}>
          <path d="M8 5.5h8l-.8 14H8.8L8 5.5z" />
          <path d="M8.2 8.5h7.6" />
          <path d="M10 3.5h4v2H10z" />
          <path d="M15.5 5.5 18 3.5" />
        </IconShell>
      );

    case "candle":
      return (
        <IconShell className={className}>
          <path d="M12 3.5c.8 1.2.8 2.2 0 3.2-.8-1-.8-2 0-3.2z" />
          <path d="M10 7.5h4v9.5a2 2 0 01-2 2h0a2 2 0 01-2-2V7.5z" />
          <path d="M8 20.5h8" />
          <path d="M9.5 20.5v1h5v-1" />
        </IconShell>
      );

    case "candy":
      return (
        <IconShell className={className}>
          <ellipse cx="12" cy="12" rx="3.5" ry="4.5" />
          <path d="M8.8 9.5 4.5 6.5l1.5 4.5L4.5 15l4.3-2.5" />
          <path d="M15.2 9.5 19.5 6.5 18 11l1.5 4.5-4.3-2.5" />
        </IconShell>
      );

    case "cannabis":
      return (
        <IconShell className={className}>
          <path d="M12 4c1.2 2.2 1.2 4.5 0 6.5-1.2-2-1.2-4.3 0-6.5z" />
          <path d="M12 10.5c2.5-1.2 4.8-.5 6.2 1.5-2.2 1-4.5.8-6.2-1.5z" />
          <path d="M12 10.5c-2.5-1.2-4.8-.5-6.2 1.5 2.2 1 4.5.8 6.2-1.5z" />
          <path d="M12 11c2.2 1.5 3.2 3.8 2.8 6.2-2.2-.8-4-.5-5.3 1.2" />
          <path d="M12 11c-2.2 1.5-3.2 3.8-2.8 6.2 2.2-.8 4-.5 5.3 1.2" />
          <path d="M12 11v9" />
        </IconShell>
      );

    case "chocolate":
      return (
        <IconShell className={className}>
          <rect x="5" y="7" width="14" height="10" rx="1" />
          <path d="M5 12h14M12 7v10M8.5 7v10M15.5 7v10" />
          <path d="M15 4.5 18.5 7l-2 2.5" />
        </IconShell>
      );

    case "coffee":
      return (
        <IconShell className={className}>
          <ellipse cx="9" cy="12" rx="3.2" ry="5" transform="rotate(-25 9 12)" />
          <ellipse cx="15.5" cy="12" rx="3.2" ry="5" transform="rotate(20 15.5 12)" />
          <path d="M7.5 9.5c1 .4 2 .3 2.8-.2M14 9c1 .5 2.1.4 3 0" />
        </IconShell>
      );

    case "cosmetics":
      return (
        <IconShell className={className}>
          <path d="M8 7.5c1.5-2 4-3 6.5-2.5 2 .4 3.5 1.8 4 3.5" />
          <path d="M9 10.5c.8.4 1.8.5 2.8.2" />
          <path d="M8.5 14c1.2 2.5 3.5 4 6 4.2" />
          <path d="M16.5 8.5c1.5 1.2 2.5 3 2.8 5" />
          <circle cx="11" cy="11.5" r="0.8" fill="currentColor" stroke="none" />
        </IconShell>
      );

    case "ecommerce":
      return (
        <IconShell className={className}>
          <rect x="3.5" y="4.5" width="17" height="12" rx="1.5" />
          <path d="M8 20.5h8M12 16.5v4" />
          <path d="M8 10.5h2.5l.8 3h4.2l1.2-2.5H11" />
          <circle cx="11" cy="14.8" r="0.6" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="14.8" r="0.6" fill="currentColor" stroke="none" />
        </IconShell>
      );

    case "electronics":
      return (
        <IconShell className={className}>
          {/* Monitor */}
          <rect x="2.5" y="4" width="10" height="8" rx="1" />
          <path d="M5.5 14h4M7.5 12v2" />
          {/* Tablet */}
          <rect x="13.5" y="5.5" width="5" height="7" rx="0.8" />
          {/* Phone */}
          <rect x="19" y="8" width="2.8" height="5.5" rx="0.5" />
        </IconShell>
      );

    case "food":
      return (
        <IconShell className={className}>
          <path d="M9 4.5v6c0 1.5-.8 2.5-2 2.5S5 12 5 10.5v-6" />
          <path d="M7 13v6.5" />
          <path d="M5 7h4M5 9.5h4" />
          <path d="M15 4.5c2.5 1 4 3.2 4 6 0 2.2-1.3 4-3.5 4.8V20.5" />
          <path d="M15.5 4.5v7" />
        </IconShell>
      );

    case "gift":
      return (
        <IconShell className={className}>
          <rect x="5" y="10" width="14" height="10" rx="1" />
          <path d="M5 14h14M12 10v10" />
          <path d="M12 10c-2-3-4.5-3.5-5.5-2s.5 3 2.5 3.5" />
          <path d="M12 10c2-3 4.5-3.5 5.5-2s-.5 3-2.5 3.5" />
          <path d="M4.5 10h15v-2.5H4.5z" />
        </IconShell>
      );

    case "jewelry":
      return (
        <IconShell className={className}>
          <path d="M12 4.5c2.5 2.8 4 5.5 4 8.2A4 4 0 0112 16.8a4 4 0 01-4-4.1c0-2.7 1.5-5.4 4-8.2z" />
          <circle cx="12" cy="12.5" r="1.8" />
          <path d="M10.5 20h3" />
        </IconShell>
      );

    case "pets":
      return (
        <IconShell className={className}>
          <circle cx="8" cy="8.5" r="1.6" />
          <circle cx="16" cy="8.5" r="1.6" />
          <circle cx="6.5" cy="12.5" r="1.4" />
          <circle cx="17.5" cy="12.5" r="1.4" />
          <path d="M12 11.5c2.2 0 4 1.6 4 3.8 0 1.6-1.2 2.7-2.8 3.2-.6.2-1.2.3-1.2.3s-.6-.1-1.2-.3C9.2 18 8 16.9 8 15.3c0-2.2 1.8-3.8 4-3.8z" />
        </IconShell>
      );

    case "pharma":
      return (
        <IconShell className={className}>
          <rect x="4.5" y="6" width="7" height="13" rx="2" />
          <path d="M4.5 10h7M8 3.5v2.5" />
          <path d="M6.5 13.5h3" />
          <ellipse cx="17" cy="14" rx="2.2" ry="3.2" transform="rotate(-35 17 14)" />
          <path d="M15.5 12.2 18.5 16" />
        </IconShell>
      );

    case "presentation":
      return (
        <IconShell className={className}>
          <path d="M8.5 8.5 12 4.5l3.5 4H8.5z" />
          <path d="M9.5 8.5v4.5h5V8.5" />
          <path d="M8 13h8v1.5H8z" />
          <path d="M10.5 14.5 9 20.5M13.5 14.5 15 20.5" />
          <path d="M8 20.5h8" />
          <path d="M12 4.5V3" />
        </IconShell>
      );

    case "restaurant":
      return (
        <IconShell className={className}>
          <path d="M8 8.5h8l1 11.5H7L8 8.5z" />
          <path d="M9 8.5V7a3 3 0 016 0v1.5" />
          <path d="M10.5 13.5h3M12 13.5v3" />
          <path d="M7.5 8.5c-.8-1-1-2.2-.5-3.2" />
        </IconShell>
      );

    case "retail":
      return (
        <IconShell className={className}>
          <path d="M4 8h16v12H4z" />
          <path d="M4 12h16M4 16h16M9 8v12M15 8v12" />
          <rect x="6" y="9.5" width="2" height="1.5" rx="0.3" />
          <rect x="11" y="13.5" width="2" height="1.5" rx="0.3" />
          <rect x="16" y="17.5" width="2" height="1.5" rx="0.3" />
        </IconShell>
      );

    case "shipping":
      return (
        <IconShell className={className}>
          <path d="M3 14.5h10V8.5H3z" />
          <path d="M13 11.5h4.5l2.5 3v3H13v-6z" />
          <circle cx="7" cy="17.5" r="1.8" />
          <circle cx="16.5" cy="17.5" r="1.8" />
          <path d="M3 11.5h10" />
        </IconShell>
      );

    case "soap":
      return (
        <IconShell className={className}>
          <rect x="5" y="9" width="5" height="11" rx="1.5" />
          <path d="M6.5 9V7.5h2V9" />
          <path d="M7.5 5.5v2" />
          <rect x="12.5" y="12" width="7" height="8" rx="1.5" />
          <path d="M14 12c1-1.5 3-1.5 4 0" />
        </IconShell>
      );

    case "toy":
      return (
        <IconShell className={className}>
          <rect x="4" y="12" width="6" height="6" rx="0.8" />
          <rect x="9" y="7" width="6" height="6" rx="0.8" />
          <rect x="14" y="12" width="6" height="6" rx="0.8" />
          <path d="M12 9l.6 1.2H14l-1 1 .4 1.3L12 11.8l-1.4.7.4-1.3-1-1h1.4z" />
          <path d="M7 14.5h1.5M16.5 14.5 18 16M16.5 16 18 14.5" />
        </IconShell>
      );

    case "tea":
      return (
        <IconShell className={className}>
          <path d="M6.5 10.5h9v5.5a3 3 0 01-3 3h-3a3 3 0 01-3-3v-5.5z" />
          <path d="M15.5 12h2a2 2 0 010 4h-2" />
          <path d="M5.5 20.5h11" />
          <path d="M9 6.5c0 1.5.8 2 1.5 2.5S12 10 12 11" />
          <path d="M12 5.5c0 1.5.8 2 1.5 2.5" />
        </IconShell>
      );

    case "window":
      return (
        <IconShell className={className}>
          <rect x="3.5" y="4.5" width="8" height="12" rx="0.5" />
          <rect x="12.5" y="7.5" width="8" height="12" rx="0.5" />
          <path d="M3.5 10.5h8M7.5 4.5v12" />
          <path d="M12.5 13.5h8M16.5 7.5v12" />
        </IconShell>
      );

    case "wine":
      return (
        <IconShell className={className}>
          <path d="M8 4.5h8l-1.5 7.5a3.5 3.5 0 01-5 0L8 4.5z" />
          <path d="M12 12v6.5" />
          <path d="M9 20.5h6" />
          <path d="M8.5 9h7" />
        </IconShell>
      );

    case "grid":
      return (
        <IconShell className={className}>
          <rect x="4" y="4" width="6" height="6" rx="0.8" />
          <rect x="14" y="4" width="6" height="6" rx="0.8" />
          <rect x="4" y="14" width="6" height="6" rx="0.8" />
          <rect x="14" y="14" width="6" height="6" rx="0.8" />
        </IconShell>
      );

    default:
      return (
        <IconShell className={className}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
        </IconShell>
      );
  }
}
