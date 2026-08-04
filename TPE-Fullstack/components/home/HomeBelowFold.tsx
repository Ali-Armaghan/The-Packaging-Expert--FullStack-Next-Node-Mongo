"use client";

import { useEffect, useState } from "react";
import { Catalog } from "@/components/sections/Catalog";
import { Expertise } from "@/components/sections/Expertise";
import { FAQ } from "@/components/sections/FAQ";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Industries } from "@/components/sections/Industries";
import { InstagramFeed } from "@/components/sections/InstagramFeed";
import { Sustainability } from "@/components/sections/Sustainability";
import { Testimonials } from "@/components/sections/Testimonials";
import { HomeSectionSkeleton } from "@/components/home/HomeSectionSkeleton";
import type {
  HomeCatalogContent,
  HomeExpertiseContent,
  HomeFaqContent,
  HomeFeaturesContent,
  HomeHowItWorksContent,
  HomeIndustriesContent,
  HomeInstagramContent,
  HomePageContent,
  HomeSectionKey,
  HomeSustainabilityContent,
  HomeTestimonialsContent,
} from "@/types/homePage";

const BELOW_FOLD_SECTIONS = [
  "features",
  "expertise",
  "catalog",
  "industries",
  "sustainability",
  "howItWorks",
  "testimonials",
  "faq",
  "instagram",
] as const satisfies readonly Exclude<HomeSectionKey, "hero">[];

type BelowFoldSection = (typeof BELOW_FOLD_SECTIONS)[number];

type SectionMap = {
  features?: HomeFeaturesContent;
  expertise?: HomeExpertiseContent;
  catalog?: HomeCatalogContent;
  industries?: HomeIndustriesContent;
  sustainability?: HomeSustainabilityContent;
  howItWorks?: HomeHowItWorksContent;
  testimonials?: HomeTestimonialsContent;
  faq?: HomeFaqContent;
  instagram?: HomeInstagramContent;
};

type ApiEnvelope = {
  success: boolean;
  data?: { section: BelowFoldSection; data: HomePageContent[BelowFoldSection] };
};

async function fetchSection(section: BelowFoldSection) {
  const response = await fetch(`/api/home/${section}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Failed to load ${section}`);
  }
  const json = (await response.json()) as ApiEnvelope;
  if (!json.success || !json.data) {
    throw new Error(`Invalid response for ${section}`);
  }
  return json.data.data;
}

/**
 * Loads home sections from partial APIs after the hero is already on screen.
 * Fetches in parallel, reveals in document order as each section arrives.
 */
export function HomeBelowFold() {
  const [sections, setSections] = useState<SectionMap>({});
  const [failed, setFailed] = useState<Partial<Record<BelowFoldSection, true>>>(
    {},
  );

  useEffect(() => {
    let cancelled = false;

    BELOW_FOLD_SECTIONS.forEach((section) => {
      fetchSection(section)
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
      {sections.features ? (
        <Features content={sections.features} />
      ) : failed.features ? null : (
        <HomeSectionSkeleton section="features" />
      )}

      {sections.expertise ? (
        <Expertise content={sections.expertise} />
      ) : failed.expertise ? null : (
        <HomeSectionSkeleton section="expertise" />
      )}

      {sections.catalog ? (
        <Catalog content={sections.catalog} />
      ) : failed.catalog ? null : (
        <HomeSectionSkeleton section="catalog" />
      )}

      {sections.industries ? (
        <Industries content={sections.industries} />
      ) : failed.industries ? null : (
        <HomeSectionSkeleton section="industries" />
      )}

      {sections.sustainability ? (
        <Sustainability content={sections.sustainability} />
      ) : failed.sustainability ? null : (
        <HomeSectionSkeleton section="sustainability" />
      )}

      {sections.howItWorks ? (
        <HowItWorks content={sections.howItWorks} />
      ) : failed.howItWorks ? null : (
        <HomeSectionSkeleton section="howItWorks" />
      )}

      {sections.testimonials ? (
        <Testimonials content={sections.testimonials} />
      ) : failed.testimonials ? null : (
        <HomeSectionSkeleton section="testimonials" />
      )}

      {sections.faq ? (
        <FAQ content={sections.faq} />
      ) : failed.faq ? null : (
        <HomeSectionSkeleton section="faq" />
      )}

      {sections.instagram ? (
        <InstagramFeed content={sections.instagram} />
      ) : failed.instagram ? null : (
        <HomeSectionSkeleton section="instagram" />
      )}
    </>
  );
}
