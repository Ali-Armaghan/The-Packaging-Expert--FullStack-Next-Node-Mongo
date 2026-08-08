import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import type { PublicMenuLinks } from "@/lib/menuLinks/apply";
import { AnnouncementBar } from "./AnnouncementBar";
import { ContactBlock } from "./ContactBlock";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";
import { SearchBar } from "./SearchBar";
import { UtilityNav } from "./UtilityNav";

type HeaderProps = {
  menuLinks: PublicMenuLinks;
};

export function Header({ menuLinks }: HeaderProps) {
  return (
    <header
      id="site-header"
      className="relative z-40 w-full bg-white shadow-sm"
      style={{ viewTransitionName: "site-header" }}
    >
      <AnnouncementBar />
      <UtilityNav />

      <div className="border-b border-border">
        <Container>
          <div className="flex items-center justify-between gap-4 py-4 lg:py-5">
            <Logo className="shrink-0" />
            <div className="hidden min-w-0 flex-1 justify-center px-6 md:flex">
              <SearchBar className="w-full max-w-lg" />
            </div>
            <ContactBlock />
            <MobileMenu />
          </div>
        </Container>
      </div>

      <div className="hidden border-b border-border lg:block">
        <DesktopNav menuLinks={menuLinks} />
      </div>
    </header>
  );
}
