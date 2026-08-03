import type { ReactNode } from "react";
import type { AdminNavIcon } from "@/constants/adminNav";

type AdminIconProps = {
  name: AdminNavIcon;
  className?: string;
};

function IconShell({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function AdminIcon({ name, className }: AdminIconProps) {
  switch (name) {
    case "dashboard":
      return (
        <IconShell className={className}>
          <rect x="3" y="3" width="7.5" height="7.5" rx="1.2" />
          <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.2" />
          <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.2" />
          <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.2" />
        </IconShell>
      );
    case "products":
      return (
        <IconShell className={className}>
          <path d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16V8z" />
          <path d="M3.3 7.7L12 12l8.7-4.3M12 22V12" />
        </IconShell>
      );
    case "categories":
      return (
        <IconShell className={className}>
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </IconShell>
      );
    case "industries":
      return (
        <IconShell className={className}>
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
          <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
        </IconShell>
      );
    case "blog":
      return (
        <IconShell className={className}>
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h6" />
        </IconShell>
      );
    case "menu":
      return (
        <IconShell className={className}>
          <path d="M4 6h16M4 12h16M4 18h10" />
        </IconShell>
      );
    case "tags":
      return (
        <IconShell className={className}>
          <path d="M4 9V5a1 1 0 011-1h4l10 10-5 5L4 9z" />
          <circle cx="8" cy="8" r="1" fill="currentColor" stroke="none" />
        </IconShell>
      );
    case "authors":
      return (
        <IconShell className={className}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20a7 7 0 0114 0" />
        </IconShell>
      );
    case "media":
      return (
        <IconShell className={className}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="10" r="2" />
          <path d="M3 17l5-4 3 2.5L16 11l5 6" />
        </IconShell>
      );
    case "pages":
      return (
        <IconShell className={className}>
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        </IconShell>
      );
    case "landing":
      return (
        <IconShell className={className}>
          <path d="M3 11l19-9-9 19-2-8-8-2z" />
        </IconShell>
      );
    case "testimonials":
      return (
        <IconShell className={className}>
          <path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4v8z" />
        </IconShell>
      );
    case "content":
      return (
        <IconShell className={className}>
          <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
        </IconShell>
      );
    case "quotes":
      return (
        <IconShell className={className}>
          <path d="M14 2H6a2 2 0 00-2 2v16l4-3h6a2 2 0 002-2V4a2 2 0 00-2-2z" />
          <path d="M8 8h4M8 12h3" />
        </IconShell>
      );
    case "leads":
      return (
        <IconShell className={className}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 19a6 6 0 0112 0" />
          <path d="M19 8v6M16 11h6" />
        </IconShell>
      );
    case "performance":
      return (
        <IconShell className={className}>
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M14 7h7v7" />
        </IconShell>
      );
    case "logs":
      return (
        <IconShell className={className}>
          <path d="M8 6h13M8 12h13M8 18h13" />
          <path d="M3 6h.01M3 12h.01M3 18h.01" />
        </IconShell>
      );
    case "settings":
      return (
        <IconShell className={className}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
        </IconShell>
      );
    case "users":
      return (
        <IconShell className={className}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M3 19a6 6 0 0112 0M14.5 19a4.5 4.5 0 016.5 0" />
        </IconShell>
      );
    case "roles":
      return (
        <IconShell className={className}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
        </IconShell>
      );
    case "catalog":
      return (
        <IconShell className={className}>
          <path d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16V8z" />
          <path d="M3.3 7.7L12 12l8.7-4.3M12 22V12" />
        </IconShell>
      );
    case "style":
      return (
        <IconShell className={className}>
          <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7l3-7z" />
        </IconShell>
      );
    case "analytics":
      return (
        <IconShell className={className}>
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M14 7h7v7" />
        </IconShell>
      );
    case "admin":
      return (
        <IconShell className={className}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
        </IconShell>
      );
    default:
      return (
        <IconShell className={className}>
          <circle cx="12" cy="12" r="8" />
        </IconShell>
      );
  }
}
