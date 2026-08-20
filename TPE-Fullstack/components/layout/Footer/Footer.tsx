"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import {
  footerLinkGroups,
  paymentMethods,
  socialLinks,
  type PaymentMethodId,
} from "@/constants/footer";

function SocialIcon({ icon }: { icon: (typeof socialLinks)[number]["icon"] }) {
  const className = "h-5 w-5";

  switch (icon) {
    case "facebook":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
      );
    case "twitter":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.062 2.062 0 114.127 0 2.062 2.062 0 01-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
  }
}

function PaymentIcon({ id }: { id: PaymentMethodId }) {
  switch (id) {
    case "visa":
      return (
        <svg viewBox="0 0 48 32" className="h-5 w-8" aria-hidden="true">
          <rect width="48" height="32" rx="4" fill="#1A1F71" />
          <text
            x="24"
            y="20.5"
            textAnchor="middle"
            fill="#fff"
            fontSize="11"
            fontWeight="700"
            fontStyle="italic"
            fontFamily="Arial, Helvetica, sans-serif"
            letterSpacing="1"
          >
            VISA
          </text>
        </svg>
      );
    case "mastercard":
      return (
        <svg viewBox="0 0 48 32" className="h-5 w-8" aria-hidden="true">
          <rect width="48" height="32" rx="4" fill="#fff" />
          <circle cx="19.5" cy="16" r="7.2" fill="#EB001B" />
          <circle cx="28.5" cy="16" r="7.2" fill="#F79E1B" />
          <path
            fill="#FF5F00"
            d="M24 10.7a7.18 7.18 0 0 0-2.5 5.3A7.18 7.18 0 0 0 24 21.3a7.18 7.18 0 0 0 2.5-5.3A7.18 7.18 0 0 0 24 10.7z"
          />
        </svg>
      );
    case "amex":
      return (
        <svg viewBox="0 0 48 32" className="h-5 w-8" aria-hidden="true">
          <rect width="48" height="32" rx="4" fill="#2E77BC" />
          <text
            x="24"
            y="20.5"
            textAnchor="middle"
            fill="#fff"
            fontSize="9"
            fontWeight="700"
            fontFamily="Arial, Helvetica, sans-serif"
            letterSpacing="0.5"
          >
            AMEX
          </text>
        </svg>
      );
    case "paypal":
      return (
        <svg viewBox="0 0 48 32" className="h-5 w-8" aria-hidden="true">
          <rect width="48" height="32" rx="4" fill="#fff" />
          <path
            fill="#003087"
            d="M19.1 8.2h-5.2c-.35 0-.65.25-.7.6L11 22.4c-.03.2.12.38.33.38h2.55c.35 0 .65-.25.7-.6l.55-3.5c.05-.35.35-.6.7-.6h1.85c3.7 0 5.85-1.8 6.4-5.35.3-1.9-.05-3.2-.95-4.05-.85-.85-2.2-1.28-3.83-1.28zm.55 5.25c-.3 2-1.85 2-3.35 2h-.85l.6-3.75c.03-.2.2-.35.4-.35h.55c1 0 1.95 0 2.45.55.3.35.35.9.2 1.55z"
          />
          <path
            fill="#009CDE"
            d="M33.1 13.5h-2.4c-.2 0-.38.15-.4.35l-.1.55-.15-.25c-.55-.8-1.8-1.05-3-1.05-2.25 0-4.15 1.7-4.5 4.05-.2 1.2.05 2.3.7 3.15.6.8 1.5 1.1 2.5 1.1 1.8 0 2.8-1.15 2.8-1.15l-.1.55c-.03.2.12.4.33.4h2.2c.35 0 .65-.25.7-.6l1.15-6.85c.03-.2-.12-.35-.33-.35zm-3.4 4.7c-.2 1.15-1.15 1.95-2.3 1.95-.6 0-1.05-.2-1.35-.55-.3-.4-.4-.9-.3-1.45.2-1.15 1.15-1.95 2.3-1.95.6 0 1.05.2 1.35.55.3.35.4.9.3 1.45z"
          />
        </svg>
      );
    case "apple-pay":
      return (
        <svg viewBox="0 0 48 32" className="h-5 w-8" aria-hidden="true">
          <rect width="48" height="32" rx="4" fill="#fff" />
          <path
            fill="#111"
            d="M14.85 10.55c.4-.5.7-1.15.6-1.85-.65.05-1.4.4-1.85.95-.4.45-.8 1.2-.7 1.9.7.05 1.4-.4 1.95-.999zm.55.95c-1.05-.05-1.95.6-2.45.6s-1.25-.55-2.1-.55c-1.1 0-2.1.65-2.65 1.65-1.15 2-.3 4.9.8 6.5.55.8 1.15 1.65 1.95 1.6.8-.05 1.1-.5 2.05-.5s1.2.5 2.05.5c.85 0 1.4-.8 1.95-1.55.6-.9.85-1.75.85-1.8 0 0-1.65-.65-1.65-2.5 0-1.55 1.3-2.3 1.35-2.35-.75-1.1-1.9-1.2-2.15-1.2z"
          />
          <text
            x="32"
            y="20.5"
            textAnchor="middle"
            fill="#111"
            fontSize="10"
            fontWeight="600"
            fontFamily="Arial, Helvetica, sans-serif"
          >
            Pay
          </text>
        </svg>
      );
  }
}

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="bg-navy text-white">
      <Container>
        <div className="grid gap-8 border-b border-white/10 py-10 sm:py-12 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <Logo variant="light" />

          <div className="flex items-center justify-start gap-3 sm:gap-4 lg:justify-center">
            {socialLinks.map((social) => (
              <Link
                key={social.icon}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-primary hover:text-primary"
              >
                <SocialIcon icon={social.icon} />
              </Link>
            ))}
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-md lg:justify-self-end"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 sm:grid-cols-3 lg:grid-cols-5 lg:py-12">
          {footerLinkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-bold text-white">{group.title}</h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 sm:flex-row">
          <p className="text-center text-sm text-white/60 sm:text-left">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {paymentMethods.map((method) => (
              <span
                key={method.id}
                title={method.label}
                aria-label={method.label}
                className="inline-flex h-8 items-center justify-center overflow-hidden rounded-md border border-white/15 bg-white shadow-sm"
              >
                <PaymentIcon id={method.id} />
              </span>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
