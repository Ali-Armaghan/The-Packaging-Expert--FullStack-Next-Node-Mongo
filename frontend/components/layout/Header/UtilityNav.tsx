import Link from "next/link";
import { utilityNavItems } from "@/constants/navigation";
import { Container } from "@/components/ui/Container";

export function UtilityNav() {
  return (
    <div className="hidden border-b border-border bg-muted sm:block">
      <Container>
        <nav
          aria-label="Utility navigation"
          className="flex justify-end py-2"
        >
          <ul className="flex items-center gap-0">
            {utilityNavItems.map(({ label, href }, index) => (
              <li key={href} className="flex items-center">
                {index > 0 && (
                  <span
                    className="mx-3 text-muted-foreground/50"
                    aria-hidden
                  >
                    |
                  </span>
                )}
                <Link
                  href={href}
                  className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </div>
  );
}
