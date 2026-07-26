import type { Metadata } from "next";
import { ContactAside, ContactForm } from "@/components/contact";
import { Container } from "@/components/ui/Container";
import { contactPageContent } from "@/constants/contact";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${siteConfig.name}. Call, email, or send a message about custom packaging, quotes, and design support.`,
};

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary-light/60 via-white to-muted">
        <div
          className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <Container className="relative py-12 sm:py-16 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            {contactPageContent.eyebrow}
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {contactPageContent.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {contactPageContent.description}
          </p>
        </Container>
      </section>

      <section className="bg-muted/40 py-10 sm:py-14 lg:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-12 xl:gap-16">
            <ContactAside />
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  );
}
