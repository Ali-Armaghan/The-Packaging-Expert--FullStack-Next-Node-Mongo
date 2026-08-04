import { SitePageSkeleton } from "@/components/ui/SitePageSkeleton";

/** Shown only while the hero (first paint) is resolving. */
export default function Loading() {
  return <SitePageSkeleton />;
}
