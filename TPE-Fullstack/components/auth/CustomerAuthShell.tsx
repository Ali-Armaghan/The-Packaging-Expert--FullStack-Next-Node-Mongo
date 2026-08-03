import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { siteConfig } from "@/config/site";

type CustomerAuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function CustomerAuthShell({
  title,
  subtitle,
  children,
  footer,
}: CustomerAuthShellProps) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <aside className="relative hidden overflow-hidden bg-navy text-white lg:flex lg:flex-col">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 10% 20%, rgba(52,173,120,0.28), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 80%, rgba(52,173,120,0.12), transparent 50%), linear-gradient(165deg, #1a1f2c 0%, #0f1219 100%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex h-full flex-col justify-between px-12 py-10 xl:px-16 xl:py-12">
          <Link href="/" className="inline-flex w-fit items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-sm font-bold tracking-wide text-white">
              PE
            </span>
            <div>
              <p className="text-base font-semibold tracking-tight">
                {siteConfig.name}
              </p>
              <p className="text-xs text-white/55">Customer portal</p>
            </div>
          </Link>

          <div className="max-w-md animate-in fade-in slide-in-from-bottom-2 duration-700">
            <p className="text-sm font-medium tracking-wide text-primary">
              Your packaging account
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight xl:text-[2.75rem] xl:leading-[1.15]">
              {siteConfig.name}
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-white/65">
              Save quotes, track custom packaging projects, and reorder with
              confidence — all in one place.
            </p>

            <ul className="mt-10 space-y-3 border-t border-white/10 pt-8 text-sm text-white/70">
              <li className="flex gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                Instant quote history and saved designs
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                Faster reorders for repeat packaging runs
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                Dedicated support for your account
              </li>
            </ul>
          </div>

          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>
      </aside>

      <main className="relative flex min-h-screen flex-col bg-[#f7faf8]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 100% 0%, rgba(52,173,120,0.12), transparent 55%), radial-gradient(ellipse 50% 35% at 0% 100%, rgba(26,31,44,0.04), transparent 50%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-1 flex-col px-5 py-8 sm:px-8 lg:px-12 xl:px-16">
          <div className="mb-8 flex items-center justify-between lg:mb-0 lg:justify-end">
            <Link href="/" className="lg:hidden">
              <Logo />
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back to site
            </Link>
          </div>

          <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-6 lg:py-10">
            <div className="animate-in fade-in slide-in-from-bottom-1 duration-500">
              <h2 className="text-2xl font-semibold tracking-tight text-navy sm:text-[1.75rem]">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {subtitle}
              </p>

              <div className="mt-8">{children}</div>

              <div className="mt-8 text-center text-sm text-muted-foreground">
                {footer}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
