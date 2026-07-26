import Link from "next/link";
import { contactChannels } from "@/constants/contact";
import { siteConfig } from "@/config/site";

function ChannelIcon({ icon }: { icon: (typeof contactChannels)[number]["icon"] }) {
  const className = "h-5 w-5";

  switch (icon) {
    case "phone":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.8 19.8 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.35 1.9.66 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.31 1.85.53 2.81.66A2 2 0 0122 16.92z" />
        </svg>
      );
    case "email":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v12H4V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7l8 6 8-6" />
        </svg>
      );
    case "clock":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M12 7v5l3 2" />
        </svg>
      );
  }
}

export function ContactChannels() {
  return (
    <ul className="space-y-4">
      {contactChannels.map((channel) => {
        const content = (
          <>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
              <ChannelIcon icon={channel.icon} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-foreground">
                {channel.title}
              </span>
              <span className="mt-0.5 block text-base font-bold text-primary">
                {channel.value}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {channel.description}
                {channel.detail ? ` · ${channel.detail}` : ""}
              </span>
            </span>
          </>
        );

        return (
          <li key={channel.id}>
            {channel.href ? (
              <a
                href={channel.href}
                className="flex items-start gap-3 rounded-xl border border-border bg-white p-4 transition-colors hover:border-primary/40 hover:bg-primary-light/30"
              >
                {content}
              </a>
            ) : (
              <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-4">
                {content}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function ContactAside() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold text-foreground">Contact details</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Prefer talking to someone directly? Reach {siteConfig.name} through any
          of the channels below.
        </p>
      </div>

      <ContactChannels />

      <div className="rounded-2xl bg-navy px-5 py-6 text-white">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Fastest path
        </p>
        <h3 className="mt-2 text-xl font-bold tracking-tight">
          Ready for a packaging project?
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/75">
          Share your specs and get a custom quote from our specialists.
        </p>
        <Link
          href="/quote"
          className="mt-5 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Request a Quote
        </Link>
      </div>
    </div>
  );
}
