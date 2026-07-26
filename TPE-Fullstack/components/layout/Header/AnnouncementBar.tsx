import Link from "next/link";
import { siteConfig } from "@/config/site";

export function AnnouncementBar() {
  const { announcement } = siteConfig;

  return (
    <div className="bg-navy-dark text-center text-sm text-white">
      <p className="px-4 py-2.5">
        {announcement.text}{" "}
        <Link
          href={announcement.linkHref}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          {announcement.linkText}
        </Link>
      </p>
    </div>
  );
}
