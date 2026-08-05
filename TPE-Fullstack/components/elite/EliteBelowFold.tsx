"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ELITE_PAGE_DEFAULTS } from "@/lib/elite/defaults";
import type {
  EliteBelowFoldKey,
  ElitePageContent,
} from "@/types/elitePage";
import { EliteSectionSkeleton } from "./EliteSectionSkeleton";

const EliteCatalog = dynamic(
  () =>
    import("./EliteCatalog").then((m) => ({ default: m.EliteCatalog })),
  { loading: () => <EliteSectionSkeleton section="catalog" /> },
);

const EliteWhyUs = dynamic(
  () => import("./EliteWhyUs").then((m) => ({ default: m.EliteWhyUs })),
  { loading: () => <EliteSectionSkeleton section="whyUs" /> },
);

const EliteIndustries = dynamic(
  () =>
    import("./EliteIndustries").then((m) => ({ default: m.EliteIndustries })),
  { loading: () => <EliteSectionSkeleton section="industries" /> },
);

const EliteProcess = dynamic(
  () => import("./EliteProcess").then((m) => ({ default: m.EliteProcess })),
  { loading: () => <EliteSectionSkeleton section="process" /> },
);

const EliteFeatures = dynamic(
  () => import("./EliteFeatures").then((m) => ({ default: m.EliteFeatures })),
  { loading: () => <EliteSectionSkeleton section="features" /> },
);

const EliteStats = dynamic(
  () => import("./EliteStats").then((m) => ({ default: m.EliteStats })),
  { loading: () => <EliteSectionSkeleton section="stats" /> },
);

const EliteTestimonials = dynamic(
  () =>
    import("./EliteTestimonials").then((m) => ({
      default: m.EliteTestimonials,
    })),
  { loading: () => <EliteSectionSkeleton section="testimonials" /> },
);

const EliteFaq = dynamic(
  () => import("./EliteFaq").then((m) => ({ default: m.EliteFaq })),
  { loading: () => <EliteSectionSkeleton section="faq" /> },
);

const ElitePartners = dynamic(
  () => import("./ElitePartners").then((m) => ({ default: m.ElitePartners })),
  { loading: () => <EliteSectionSkeleton section="partners" /> },
);

const BELOW_FOLD_ORDER = [
  "catalog",
  "whyUs",
  "industries",
  "process",
  "features",
  "stats",
  "testimonials",
  "faq",
  "partners",
] as const satisfies readonly EliteBelowFoldKey[];

type SectionMap = Partial<
  Pick<
    ElitePageContent,
    | "catalog"
    | "whyUs"
    | "industries"
    | "process"
    | "features"
    | "stats"
    | "testimonials"
    | "faq"
    | "partners"
  >
>;

async function loadSection<K extends EliteBelowFoldKey>(
  section: K,
): Promise<ElitePageContent[K]> {
  // When CMS is ready, replace with:
  // const res = await fetch(`/api/elite/${section}`, { cache: "no-store" });
  // ...
  return ELITE_PAGE_DEFAULTS[section];
}

/**
 * Code-splits below-fold sections so the hero paints with a small JS payload.
 * Loads section data in parallel (defaults today, `/api/elite/:section` later).
 */
export function EliteBelowFold() {
  const [sections, setSections] = useState<SectionMap>({});
  const [failed, setFailed] = useState<Partial<Record<EliteBelowFoldKey, true>>>(
    {},
  );

  useEffect(() => {
    let cancelled = false;

    BELOW_FOLD_ORDER.forEach((section) => {
      loadSection(section)
        .then((data) => {
          if (cancelled) return;
          setSections((prev) => ({ ...prev, [section]: data }));
        })
        .catch(() => {
          if (cancelled) return;
          setFailed((prev) => ({ ...prev, [section]: true }));
        });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {sections.catalog ? (
        <EliteCatalog content={sections.catalog} />
      ) : failed.catalog ? null : (
        <EliteSectionSkeleton section="catalog" />
      )}

      {sections.whyUs ? (
        <EliteWhyUs content={sections.whyUs} />
      ) : failed.whyUs ? null : (
        <EliteSectionSkeleton section="whyUs" />
      )}

      {sections.industries ? (
        <EliteIndustries content={sections.industries} />
      ) : failed.industries ? null : (
        <EliteSectionSkeleton section="industries" />
      )}

      {sections.process ? (
        <EliteProcess content={sections.process} />
      ) : failed.process ? null : (
        <EliteSectionSkeleton section="process" />
      )}

      {sections.features ? (
        <EliteFeatures content={sections.features} />
      ) : failed.features ? null : (
        <EliteSectionSkeleton section="features" />
      )}

      {sections.stats ? (
        <EliteStats content={sections.stats} />
      ) : failed.stats ? null : (
        <EliteSectionSkeleton section="stats" />
      )}

      {sections.testimonials ? (
        <EliteTestimonials content={sections.testimonials} />
      ) : failed.testimonials ? null : (
        <EliteSectionSkeleton section="testimonials" />
      )}

      {sections.faq ? (
        <EliteFaq content={sections.faq} />
      ) : failed.faq ? null : (
        <EliteSectionSkeleton section="faq" />
      )}

      {sections.partners ? (
        <ElitePartners content={sections.partners} />
      ) : failed.partners ? null : (
        <EliteSectionSkeleton section="partners" />
      )}
    </>
  );
}
