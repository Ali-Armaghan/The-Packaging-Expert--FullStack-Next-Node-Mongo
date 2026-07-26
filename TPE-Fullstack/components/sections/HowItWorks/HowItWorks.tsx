"use client";

import Image from "next/image";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import {
  processBenefits,
  processTabs,
  type ProcessBenefit,
  type ProcessStep,
} from "@/constants/process";
import { cn } from "@/lib/utils";

function ProcessStepIcon({ icon }: Pick<ProcessStep, "icon">) {
  const className = "h-6 w-6";

  switch (icon) {
    case "choose":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "design":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path strokeLinecap="round" d="M12 19l7-7 3 3-7 7h-3v-3z" />
          <path strokeLinecap="round" d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        </svg>
      );
    case "order":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h15l-1.5 9h-12L6 6z" />
          <circle cx="9" cy="20" r="1" fill="currentColor" />
          <circle cx="18" cy="20" r="1" fill="currentColor" />
        </svg>
      );
    case "delivery":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h4l3-4V8h-7v8z" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      );
  }
}

function BenefitIcon({ icon }: Pick<ProcessBenefit, "icon">) {
  const className = "h-6 w-6";

  switch (icon) {
    case "minimum":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path strokeLinecap="round" d="M4 7h16M4 12h10M4 17h6" />
        </svg>
      );
    case "shipping":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6H4v10h1M13 16h4l3-4V8h-7v8z" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      );
    case "costs":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M12 8v8M9 11h4a2 2 0 110 4H9" />
        </svg>
      );
    case "support":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState(processTabs[0].id);
  const currentTab = processTabs.find((tab) => tab.id === activeTab) ?? processTabs[0];

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
          <h2 className="section-heading">
            Let&apos;s find the best packaging for you
          </h2>
        </div>

        <div className="mt-10 flex justify-center overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="inline-flex min-w-max flex-wrap justify-center gap-2 sm:gap-3">
          {processTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors sm:px-5",
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
          </div>
        </div>

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

        <div className="relative mx-auto mt-10 aspect-[4/3] max-w-4xl overflow-hidden rounded-2xl bg-muted sm:aspect-[16/9] lg:aspect-[16/7]">
          <Image
            src={currentTab.image}
            alt={`${currentTab.label} packaging examples`}
            fill
            className="object-contain p-6"
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {processBenefits.map((benefit) => (
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
