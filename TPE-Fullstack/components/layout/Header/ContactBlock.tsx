import Link from "next/link";
import { siteConfig } from "@/config/site";

export function ContactBlock() {
  const { contact } = siteConfig;
  const phoneHref = `tel:${contact.phone.replace(/[^+\d]/g, "")}`;

  return (
    <div className="hidden items-center gap-4 lg:flex">
      <div className="text-right">
        <p className="text-xs text-muted-foreground">{contact.phoneLabel}</p>
        <Link
          href={phoneHref}
          className="text-lg font-bold text-primary hover:text-primary-dark"
        >
          {contact.phone}
        </Link>
        <p className="text-[11px] leading-tight text-muted-foreground">
          {contact.phoneSubtext}
          <br />
          {contact.hours}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <HeaderBadgeIcon label="Cart" count={0} />
        <HeaderBadgeIcon label="Favorites" count={0} />
      </div>
    </div>
  );
}

function HeaderBadgeIcon({
  label,
  count,
}: {
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      aria-label={`${label} (${count} items)`}
      className="relative flex size-9 items-center justify-center rounded-full border border-primary/30 text-primary transition-colors hover:bg-primary-light"
    >
      {label === "Cart" ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      )}
      <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
        {count}
      </span>
    </button>
  );
}
