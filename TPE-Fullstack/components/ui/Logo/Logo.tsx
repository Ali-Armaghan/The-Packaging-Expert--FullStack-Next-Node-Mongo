import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  variant?: "default" | "light";
};

const defaultLogoSrc = "/images/logo/TPE-PNG-LS.png";
const lightLogoSrc = "/images/logo/logo-white.png";

export function Logo({ className, variant = "default" }: LogoProps) {
  const src = variant === "light" ? lightLogoSrc : defaultLogoSrc;

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
        src={src}
        alt={siteConfig.name}
        width={320}
        height={74}
        priority
        fetchPriority="high"
        className={cn(
          "h-11 w-auto object-contain object-left sm:h-12 lg:h-14",
        )}
      />
    </Link>
  );
}
