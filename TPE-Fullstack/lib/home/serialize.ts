import { buildDefaultHomePageContent } from "@/lib/home/defaults";
import type { HomePageContent, HomeSectionKey } from "@/types/homePage";

const PROCESS_STEP_ICONS = [
  "choose",
  "design",
  "order",
  "delivery",
  "check",
  "upload",
  "eye",
  "refresh",
  "package",
  "headset",
  "sliders",
  "clipboard",
] as const;

function buildProcessStepIconMap(
  defaults: ReturnType<typeof buildDefaultHomePageContent>,
) {
  const map = new Map<string, (typeof PROCESS_STEP_ICONS)[number]>();
  for (const tab of defaults.howItWorks.tabs) {
    for (const step of tab.steps) {
      map.set(step.id, step.icon);
    }
  }
  return map;
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asBool(value: unknown, fallback = true) {
  return typeof value === "boolean" ? value : fallback;
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return [] as string[];
  return value.map((item) => asString(item)).filter(Boolean);
}

function mapCard(item: Record<string, unknown>, index: number) {
  return {
    id: asString(item.id, `card-${index}`),
    title: asString(item.title),
    description: asString(item.description),
    image: asString(item.image),
    href: asString(item.href),
    sortOrder: asNumber(item.sortOrder, index),
    isActive: asBool(item.isActive, true),
  };
}

function mapCta(value: unknown) {
  const obj = (value && typeof value === "object" ? value : {}) as Record<
    string,
    unknown
  >;
  return {
    label: asString(obj.label),
    href: asString(obj.href),
  };
}

export function serializeHomePage(doc: Record<string, unknown>): HomePageContent {
  const defaults = buildDefaultHomePageContent();
  const processStepIconById = buildProcessStepIconMap(defaults);
  const hero = (doc.hero ?? {}) as Record<string, unknown>;
  const features = (doc.features ?? {}) as Record<string, unknown>;
  const expertise = (doc.expertise ?? {}) as Record<string, unknown>;
  const catalog = (doc.catalog ?? {}) as Record<string, unknown>;
  const industries = (doc.industries ?? {}) as Record<string, unknown>;
  const sustainability = (doc.sustainability ?? {}) as Record<string, unknown>;
  const howItWorks = (doc.howItWorks ?? {}) as Record<string, unknown>;
  const testimonials = (doc.testimonials ?? {}) as Record<string, unknown>;
  const faq = (doc.faq ?? {}) as Record<string, unknown>;
  const instagram = (doc.instagram ?? {}) as Record<string, unknown>;
  const ctaCard = (catalog.ctaCard ?? {}) as Record<string, unknown>;

  return {
    id: String(doc._id ?? ""),
    pageKey: "home",
    hero: {
      title: asString(hero.title, defaults.hero.title),
      subtitle: asString(hero.subtitle, defaults.hero.subtitle),
      primaryCta: { ...defaults.hero.primaryCta, ...mapCta(hero.primaryCta) },
      secondaryCta: {
        ...defaults.hero.secondaryCta,
        ...mapCta(hero.secondaryCta),
      },
      image: asString(hero.image, defaults.hero.image),
      imageAlt: asString(hero.imageAlt, defaults.hero.imageAlt),
      socialProofText: asString(
        hero.socialProofText,
        defaults.hero.socialProofText,
      ),
      ratingLabel: asString(hero.ratingLabel, defaults.hero.ratingLabel),
      brandLogos: asStringArray(hero.brandLogos).length
        ? asStringArray(hero.brandLogos)
        : defaults.hero.brandLogos,
    },
    features: {
      title: asString(features.title, defaults.features.title),
      highlights: asStringArray(features.highlights).length
        ? asStringArray(features.highlights)
        : defaults.features.highlights,
      subtitle: asString(features.subtitle, defaults.features.subtitle),
      items: Array.isArray(features.items)
        ? (features.items as Record<string, unknown>[]).map((item, index) => ({
            id: asString(item.id, `feature-${index}`),
            title: asString(item.title),
            description: asString(item.description),
            icon: (["headset", "journey", "ruler", "promise"].includes(
              asString(item.icon),
            )
              ? asString(item.icon)
              : "headset") as HomePageContent["features"]["items"][number]["icon"],
            sortOrder: asNumber(item.sortOrder, index),
            isActive: asBool(item.isActive, true),
          }))
        : defaults.features.items,
    },
    expertise: {
      title: asString(expertise.title, defaults.expertise.title),
      description: asString(expertise.description, defaults.expertise.description),
      image: asString(expertise.image, defaults.expertise.image),
      imageAlt: asString(expertise.imageAlt, defaults.expertise.imageAlt),
    },
    catalog: {
      title: asString(catalog.title, defaults.catalog.title),
      subtitle: asString(catalog.subtitle, defaults.catalog.subtitle),
      browseCta: {
        ...defaults.catalog.browseCta,
        ...mapCta(catalog.browseCta),
      },
      cards: Array.isArray(catalog.cards)
        ? (catalog.cards as Record<string, unknown>[]).map(mapCard)
        : defaults.catalog.cards,
      ctaCard: {
        titleLines: asStringArray(ctaCard.titleLines).length
          ? asStringArray(ctaCard.titleLines)
          : defaults.catalog.ctaCard.titleLines,
        buttonLabel: asString(
          ctaCard.buttonLabel,
          defaults.catalog.ctaCard.buttonLabel,
        ),
        buttonHref: asString(
          ctaCard.buttonHref,
          defaults.catalog.ctaCard.buttonHref,
        ),
      },
    },
    industries: {
      title: asString(industries.title, defaults.industries.title),
      subtitle: asString(industries.subtitle, defaults.industries.subtitle),
      cards: Array.isArray(industries.cards)
        ? (industries.cards as Record<string, unknown>[]).map(mapCard)
        : defaults.industries.cards,
    },
    sustainability: {
      cards: Array.isArray(sustainability.cards)
        ? (sustainability.cards as Record<string, unknown>[]).map(mapCard)
        : defaults.sustainability.cards,
    },
    howItWorks: {
      title: asString(howItWorks.title, defaults.howItWorks.title),
      tabs: Array.isArray(howItWorks.tabs)
        ? (howItWorks.tabs as Record<string, unknown>[]).map((tab, index) => ({
            id: asString(tab.id, `tab-${index}`),
            label: asString(tab.label),
            image: asString(tab.image),
            steps: Array.isArray(tab.steps)
              ? (tab.steps as Record<string, unknown>[]).map((step, sIndex) => ({
                  id: asString(step.id, `step-${sIndex}`),
                  title: asString(step.title),
                  description: asString(step.description),
                  icon: (() => {
                    const fromDefaults = processStepIconById.get(
                      asString(step.id, `step-${sIndex}`),
                    );
                    if (fromDefaults) return fromDefaults;
                    const raw = asString(step.icon);
                    return (
                      PROCESS_STEP_ICONS.includes(
                        raw as (typeof PROCESS_STEP_ICONS)[number],
                      )
                        ? raw
                        : "choose"
                    ) as HomePageContent["howItWorks"]["tabs"][number]["steps"][number]["icon"];
                  })(),
                }))
              : [],
            sortOrder: asNumber(tab.sortOrder, index),
            isActive: asBool(tab.isActive, true),
          }))
        : defaults.howItWorks.tabs,
      benefits: Array.isArray(howItWorks.benefits)
        ? (howItWorks.benefits as Record<string, unknown>[]).map(
            (item, index) => ({
              id: asString(item.id, `benefit-${index}`),
              title: asString(item.title),
              description: asString(item.description),
              icon: (["minimum", "shipping", "costs", "support"].includes(
                asString(item.icon),
              )
                ? asString(item.icon)
                : "minimum") as HomePageContent["howItWorks"]["benefits"][number]["icon"],
              sortOrder: asNumber(item.sortOrder, index),
              isActive: asBool(item.isActive, true),
            }),
          )
        : defaults.howItWorks.benefits,
    },
    testimonials: {
      title: asString(testimonials.title, defaults.testimonials.title),
      subtitle: asString(testimonials.subtitle, defaults.testimonials.subtitle),
      items: Array.isArray(testimonials.items)
        ? (testimonials.items as Record<string, unknown>[]).map(
            (item, index) => ({
              id: asString(item.id, `testimonial-${index}`),
              quote: asString(item.quote),
              name: asString(item.name),
              role: asString(item.role),
              avatar: asString(item.avatar),
              rating: Math.min(5, Math.max(1, asNumber(item.rating, 5))),
              sortOrder: asNumber(item.sortOrder, index),
              isActive: asBool(item.isActive, true),
            }),
          )
        : defaults.testimonials.items,
    },
    faq: {
      title: asString(faq.title, defaults.faq.title),
      items: Array.isArray(faq.items)
        ? (faq.items as Record<string, unknown>[]).map((item, index) => ({
            id: asString(item.id, `faq-${index}`),
            question: asString(item.question),
            answer: asString(item.answer),
            sortOrder: asNumber(item.sortOrder, index),
            isActive: asBool(item.isActive, true),
          }))
        : defaults.faq.items,
    },
    instagram: {
      title: asString(instagram.title, defaults.instagram.title),
      handle: asString(instagram.handle, defaults.instagram.handle),
      profileUrl: asString(instagram.profileUrl, defaults.instagram.profileUrl),
      posts: Array.isArray(instagram.posts)
        ? (instagram.posts as Record<string, unknown>[]).map((item, index) => ({
            id: asString(item.id, `post-${index}`),
            image: asString(item.image),
            alt: asString(item.alt),
            href: asString(item.href),
            sortOrder: asNumber(item.sortOrder, index),
            isActive: asBool(item.isActive, true),
          }))
        : defaults.instagram.posts,
    },
    updatedAt:
      doc.updatedAt instanceof Date
        ? doc.updatedAt.toISOString()
        : typeof doc.updatedAt === "string"
          ? doc.updatedAt
          : undefined,
  };
}

export type { HomeSectionKey };
