"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { getActiveSectionItems } from "@/lib/home/items";
import { cn } from "@/lib/utils";
import type {
  HomeHowItWorksContent,
  HomeProcessBenefit,
  HomeProcessStep,
} from "@/types/homePage";

function ProcessStepIcon({ icon }: Pick<HomeProcessStep, "icon">) {
  const className = "h-6 w-6";
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (icon) {
    case "choose":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "design":
      return (
        <svg {...common}>
          <path d="M12 20l7-7 2.5 2.5-7 7H12v-2.5z" />
          <path d="M16.5 10.5 19 4 5 8.5l5 2 1.5 5 5-5z" />
        </svg>
      );
    case "order":
      return (
        <svg {...common}>
          <path d="M3 4h2l2.4 11.2a2 2 0 002 1.6h8.3a2 2 0 002-1.55L21.5 8H7" />
          <circle cx="10" cy="20" r="1.25" />
          <circle cx="17" cy="20" r="1.25" />
        </svg>
      );
    case "delivery":
      return (
        <svg {...common}>
          <path d="M3 7h9v10H4a1 1 0 01-1-1V7z" />
          <path d="M12 10h4.5L20 14v3h-8v-7z" />
          <circle cx="7" cy="18.5" r="1.75" />
          <circle cx="17" cy="18.5" r="1.75" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8.5 12.5l2.5 2.5 4.5-5" />
        </svg>
      );
    case "upload":
      return (
        <svg {...common}>
          <path d="M12 16V5" />
          <path d="M8 9l4-4 4 4" />
          <path d="M5 19h14" />
        </svg>
      );
    case "eye":
      return (
        <svg {...common}>
          <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );
    case "refresh":
      return (
        <svg {...common}>
          <path d="M4 12a8 8 0 0113.5-5.5L20 9" />
          <path d="M20 4v5h-5" />
          <path d="M20 12a8 8 0 01-13.5 5.5L4 15" />
          <path d="M4 20v-5h5" />
        </svg>
      );
    case "package":
      return (
        <svg {...common}>
          <path d="M12 3 4.5 7.5v9L12 21l7.5-4.5v-9L12 3z" />
          <path d="M12 12l7.5-4.5M12 12v9M12 12 4.5 7.5" />
        </svg>
      );
    case "headset":
      return (
        <svg {...common}>
          <path d="M4 13a8 8 0 0116 0" />
          <rect x="2.5" y="12" width="3.5" height="6" rx="1.5" />
          <rect x="18" y="12" width="3.5" height="6" rx="1.5" />
          <path d="M15 19h2a2 2 0 002-2v-1" />
          <circle cx="19" cy="19.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "sliders":
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" />
          <circle cx="8" cy="7" r="1.75" fill="currentColor" stroke="none" />
          <circle cx="14" cy="12" r="1.75" fill="currentColor" stroke="none" />
          <circle cx="10" cy="17" r="1.75" fill="currentColor" stroke="none" />
        </svg>
      );
    case "clipboard":
      return (
        <svg {...common}>
          <rect x="6" y="5" width="12" height="16" rx="2" />
          <path d="M9 5V4a2 2 0 012-2h2a2 2 0 012 2v1" />
          <path d="M9 11h6M9 15h4" />
        </svg>
      );
  }
}

function BenefitIcon({ icon }: Pick<HomeProcessBenefit, "icon">) {
  const className = "h-6 w-6";
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (icon) {
    case "minimum":
      return (
        <svg {...common}>
          <path d="M5 19V9l7-5 7 5v10" />
          <path d="M9 19v-6h6v6" />
          <path d="M10 13h4" />
        </svg>
      );
    case "shipping":
      return (
        <svg {...common}>
          <path d="M3 7h9v10H4a1 1 0 01-1-1V7z" />
          <path d="M12 10h4.5L20 14v3h-8v-7z" />
          <circle cx="7" cy="18.5" r="1.75" />
          <circle cx="17" cy="18.5" r="1.75" />
        </svg>
      );
    case "costs":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v10" />
          <path d="M9.5 9.5c.5-1 1.5-1.5 2.5-1.5s2 .7 2 2-1 1.8-2.5 2.2-2.5.8-2.5 2.3 1.2 2 2.5 2 2-.6 2.5-1.5" />
        </svg>
      );
    case "support":
      return (
        <svg {...common}>
          <path d="M4 13a8 8 0 0116 0" />
          <rect x="2.5" y="12" width="3.5" height="6" rx="1.5" />
          <rect x="18" y="12" width="3.5" height="6" rx="1.5" />
          <path d="M15 19h2a2 2 0 002-2v-1" />
          <circle cx="19" cy="19.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

type HowItWorksProps = {
  content: HomeHowItWorksContent;
};

export function HowItWorks({ content }: HowItWorksProps) {
  const tabs = useMemo(
    () => getActiveSectionItems(content.tabs),
    [content.tabs],
  );
  const benefits = useMemo(
    () => getActiveSectionItems(content.benefits),
    [content.benefits],
  );
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "");
  const currentTab =
    tabs.find((tab) => tab.id === activeTab) ?? tabs[0] ?? null;

  useEffect(() => {
    if (!tabs.some((tab) => tab.id === activeTab) && tabs[0]) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" d="M8 14s1.5 2 4 2 4-2 4-2" />
              <circle cx="9" cy="10" r="1" fill="currentColor" />
              <circle cx="15" cy="10" r="1" fill="currentColor" />
            </svg>
          </div>
          <h2 className="section-heading">{content.title}</h2>
        </div>

        {tabs.length > 0 ? (
          <div className="mt-10 flex justify-center overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="inline-flex min-w-max flex-wrap justify-center gap-2 sm:gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors sm:px-5",
                    activeTab === tab.id
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {currentTab ? (
          <>
            <div className="mt-8 grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {currentTab.steps.map((step) => (
                <article
                  key={step.id}
                  className="flex h-full flex-col rounded-2xl bg-primary-light/60 p-5"
                >
                  <div className="mb-4 inline-flex text-primary">
                    <ProcessStepIcon icon={step.icon} />
                  </div>
                  <h3 className="text-base font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>

            {currentTab.image ? (
              <div className="relative mx-auto mt-10 aspect-[4/3] max-w-4xl overflow-hidden rounded-2xl bg-muted sm:aspect-[16/9] lg:aspect-[16/7]">
                <Image
                  src={currentTab.image}
                  alt={`${currentTab.label} packaging examples`}
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
              </div>
            ) : null}
          </>
        ) : null}

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="text-center">
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
                <BenefitIcon icon={benefit.icon} />
              </div>
              <h3 className="text-base font-bold text-foreground">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
