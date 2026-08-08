import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  variant?: "default" | "light";
};

const logoSrc = "/images/logo/TPE-PNG-LS.png";

export function Logo({ className, variant = "default" }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group relative block shrink-0 transition-opacity hover:opacity-90",
        className,
      )}
      aria-label={`${siteConfig.name} — Home`}
    >
      <Image
        src={logoSrc}
        alt={siteConfig.name}
        width={320}
        height={74}
        priority
        fetchPriority="high"
        className={cn(
          "h-11 w-auto object-contain object-left sm:h-12 lg:h-14",
          variant === "light" && "brightness-110",
        )}
      />
    </Link>
  );
}
