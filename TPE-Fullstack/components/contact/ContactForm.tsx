"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/site-button";
import { contactPageContent, contactTopics } from "@/constants/contact";
import { cn } from "@/lib/utils";

const fieldClassName =
  "w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary";

const labelClassName = "mb-1.5 block text-sm font-medium text-foreground";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      topic: String(formData.get("topic") ?? ""),
      company: String(formData.get("company") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
        details?: { fieldErrors?: Record<string, string[]> };
      };

      if (!response.ok || !data.success) {
        const fieldErrors = data.details?.fieldErrors;
        const firstFieldError = fieldErrors
          ? Object.values(fieldErrors).flat()[0]
          : undefined;

        throw new Error(
          firstFieldError || data.error || "Unable to send message. Please try again.",
        );
      }

      form.reset();
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to send message. Please try again.",
      );
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-primary/20 bg-primary-light/40 px-6 py-12 text-center sm:px-10">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
          <svg
            className="h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
        <h3 className="text-xl font-bold text-foreground">
          {contactPageContent.successTitle}
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {contactPageContent.successDescription}
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => {
            setStatus("idle");
            setErrorMessage(null);
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-8"
      noValidate
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {contactPageContent.formTitle}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {contactPageContent.formDescription}
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-first-name" className={labelClassName}>
            First name
          </label>
          <input
            id="contact-first-name"
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            placeholder="Jane"
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="contact-last-name" className={labelClassName}>
            Last name
          </label>
          <input
            id="contact-last-name"
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            placeholder="Doe"
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClassName}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="jane@company.com"
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className={labelClassName}>
            Phone{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+1 (555) 000-0000"
            className={fieldClassName}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-topic" className={labelClassName}>
            Topic
          </label>
          <select
            id="contact-topic"
            name="topic"
            required
            defaultValue=""
            className={cn(fieldClassName, "bg-white")}
          >
            <option value="" disabled>
              Select a topic
            </option>
            {contactTopics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-company" className={labelClassName}>
            Company{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            id="contact-company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Your company name"
            className={fieldClassName}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className={labelClassName}>
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            placeholder="Tell us about your packaging needs, quantities, timeline, or questions..."
            className={cn(fieldClassName, "resize-y min-h-[120px]")}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted-foreground">
          By submitting, you agree to be contacted about your inquiry.
        </p>
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending..." : "Send message"}
        </Button>
      </div>
    </form>
  );
}
