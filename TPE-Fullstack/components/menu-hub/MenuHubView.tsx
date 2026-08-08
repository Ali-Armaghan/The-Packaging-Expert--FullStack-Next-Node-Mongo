import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { IndustryIcon } from "@/components/layout/Header/IndustryIcons";
import { Button } from "@/components/ui/site-button";
import { Container } from "@/components/ui/Container";
import type { IndustryMegaMenuItem } from "@/constants/industriesMegaMenu";
import type { MenuHubContent } from "@/types/menuHub";
import { cn } from "@/lib/utils";

const INDUSTRY_ICONS = new Set<IndustryMegaMenuItem["icon"]>([
  "apparel",
  "bakery",
  "beer",
  "beverage",
  "candle",
  "candy",
  "cannabis",
  "chocolate",
  "coffee",
  "cosmetics",
  "ecommerce",
  "electronics",
  "food",
  "gift",
  "jewelry",
  "pets",
  "pharma",
  "presentation",
  "restaurant",
  "retail",
  "shipping",
  "soap",
  "toy",
  "tea",
  "window",
  "wine",
  "grid",
]);

function isIndustryIcon(
  value: string,
): value is IndustryMegaMenuItem["icon"] {
  return INDUSTRY_ICONS.has(value as IndustryMegaMenuItem["icon"]);
}

export function MenuHubView({ content }: { content: MenuHubContent }) {
  const { hero, intro, highlights, sections, ctaBand } = content;

  return (
    <div className="bg-white">
      <section className="relative isolate min-h-[58vh] overflow-hidden bg-[#1a1f2c] text-white sm:min-h-[62vh]">
        <div className="absolute inset-0">
          <Image
            src={hero.image}
            alt={hero.imageAlt || hero.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f2c]/95 via-[#1a1f2c]/75 to-[#1a1f2c]/35" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,_rgba(52,173,120,0.35),_transparent_50%)]" />
        </div>

        <Container className="relative flex min-h-[58vh] flex-col justify-end pb-14 pt-28 sm:min-h-[62vh] sm:pb-16 sm:pt-32">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6ee7b0]">
              {hero.eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              {hero.title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              {hero.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={hero.primaryCta.href} size="lg">
                {hero.primaryCta.label}
              </Button>
              <Button
                href={hero.secondaryCta.href}
                variant="outline"
                size="lg"
                className="border-white/35 bg-white/5 text-white hover:bg-white/15 hover:text-white"
              >
                {hero.secondaryCta.label}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                Why it matters
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1a1f2c] sm:text-4xl">
                {intro.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {intro.body}
              </p>
            </div>
            <div className="relative aspect-[5/4] overflow-hidden rounded-3xl bg-[#eef8f3] shadow-[0_20px_50px_-28px_rgba(26,31,44,0.45)] ring-1 ring-black/5">
              <Image
                src={intro.image}
                alt={intro.imageAlt || intro.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-[#d7ebe1] bg-gradient-to-b from-[#f4faf7] to-white py-14 sm:py-16">
        <Container>
          <ul className="grid gap-8 sm:grid-cols-3">
            {highlights.map((item, index) => (
              <li
                key={item.id}
                className="group"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-[3px] bg-white ring-1 ring-black/5">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#1a1f2c]">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="space-y-16">
          {sections.map((section) => (
            <div key={section.id}>
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight text-[#1a1f2c]">
                  {section.title}
                </h2>
                {section.description ? (
                  <p className="mt-2 text-base text-muted-foreground">
                    {section.description}
                  </p>
                ) : null}
              </div>

              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((menuItem) => (
                  <li key={menuItem.id}>
                    <Link
                      href={menuItem.href}
                      className={cn(
                        "group flex h-full flex-col overflow-hidden rounded-[3px]",
                        "border border-border/70 bg-white shadow-sm",
                        "transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg",
                      )}
                    >
                      <div className="relative aspect-[16/10] bg-[#eef8f3]">
                        {menuItem.image ? (
                          <Image
                            src={menuItem.image}
                            alt=""
                            fill
                            className="object-cover transition duration-500 group-hover:scale-[1.04]"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : menuItem.icon && isIndustryIcon(menuItem.icon) ? (
                          <div className="flex h-full items-center justify-center text-primary">
                            <span className="rounded-[3px] bg-white/80 p-4 shadow-sm ring-1 ring-primary/10">
                              <IndustryIcon
                                icon={menuItem.icon}
                                className="h-9 w-9"
                              />
                            </span>
                          </div>
                        ) : (
                          <div className="flex h-full items-center justify-center text-2xl font-bold text-primary/40">
                            {menuItem.title.slice(0, 1)}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-base font-semibold text-[#1a1f2c] transition-colors group-hover:text-primary">
                            {menuItem.title}
                          </h3>
                          <ArrowRightIcon className="mt-0.5 size-4 shrink-0 text-primary opacity-0 transition duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                        </div>
                        {menuItem.description ? (
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {menuItem.description}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Container>
      </section>

      <section className="pb-16 sm:pb-20">
        <Container>
          <div className="relative overflow-hidden rounded-[4px] bg-[#1a1f2c] text-white">
            <Image
              src={ctaBand.image}
              alt=""
              fill
              className="object-cover opacity-30"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f2c] via-[#1a1f2c]/85 to-transparent" />
            <div className="relative grid gap-6 px-6 py-12 sm:px-10 lg:grid-cols-[1fr_auto] lg:items-center lg:px-14 lg:py-14">
              <div className="max-w-xl">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {ctaBand.title}
                </h2>
                <p className="mt-3 text-white/75">{ctaBand.description}</p>
              </div>
              <Button href={ctaBand.buttonHref} size="lg">
                {ctaBand.buttonLabel}
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
