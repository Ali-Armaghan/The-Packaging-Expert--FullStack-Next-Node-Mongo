"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import type { Home2QuoteContent } from "@/lib/home2/content";

type Home2QuoteSectionProps = {
  content: Home2QuoteContent;
};

type FormStatus = "idle" | "submitting" | "success" | "error";

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

function optionalNumber(value: FormDataEntryValue | null): number | undefined {
  const raw = String(value ?? "").trim();
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/**
 * Landscape quote section — horizontal process + wide multi-column form.
 */
export function Home2QuoteSection({ content }: Home2QuoteSectionProps) {
  const captcha = useMemo(() => {
    const a = 2 + Math.floor(Math.random() * 7);
    const b = 2 + Math.floor(Math.random() * 7);
    return { a, b, sum: a + b };
  }, []);

  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    const form = e.currentTarget;
    const data = new FormData(form);

    const captchaAnswer = Number(String(data.get("captcha") ?? "").trim());
    if (captchaAnswer !== captcha.sum) {
      setStatus("error");
      setErrorMessage("Captcha answer is incorrect. Please try again.");
      return;
    }

    const { firstName, lastName } = splitName(String(data.get("name") ?? ""));
    const unitRaw = String(data.get("unit") ?? "in");
    const unit =
      unitRaw === "cm" || unitRaw === "mm" || unitRaw === "in" ? unitRaw : "in";

    const extras = [
      data.get("zip") ? `Zip: ${data.get("zip")}` : null,
      data.get("material") ? `Material: ${data.get("material")}` : null,
      data.get("color") ? `Color: ${data.get("color")}` : null,
      data.get("printing") ? `Printing: ${data.get("printing")}` : null,
      data.get("coating") ? `Coating: ${data.get("coating")}` : null,
      data.get("thickness") ? `Thickness: ${data.get("thickness")}` : null,
      data.get("notes") ? String(data.get("notes")) : null,
    ]
      .filter(Boolean)
      .join("\n");

    const payload = {
      firstName,
      lastName,
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? "") || undefined,
      productType: String(data.get("productName") ?? ""),
      quantity: optionalNumber(data.get("quantity")),
      width: optionalNumber(data.get("width")),
      height: optionalNumber(data.get("height")),
      length: optionalNumber(data.get("length")),
      unit,
      notes: extras || undefined,
    };

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
        details?: { fieldErrors?: Record<string, string[]> };
      };

      if (!response.ok || !result.success) {
        const fieldErrors = result.details?.fieldErrors;
        const firstFieldError = fieldErrors
          ? Object.values(fieldErrors).flat()[0]
          : undefined;
        throw new Error(
          firstFieldError ||
            result.error ||
            "Unable to submit quote. Please try again.",
        );
      }

      form.reset();
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit quote. Please try again.",
      );
    }
  };

  return (
    <section className="home2-quote" aria-label="Order process and custom quote">
      <div className="home2-quote__shell">
        <header className="home2-quote__intro">
          <h2 className="home2-quote__process-title">{content.processTitle}</h2>

          <ol className="home2-quote__timeline">
            {content.steps.map((step, index) => (
              <li key={step.id} className="home2-quote__timeline-item">
                <span className="home2-quote__timeline-node" aria-hidden="true">
                  {index + 1}
                </span>
                <div className="home2-quote__timeline-copy">
                  <h3 className="home2-quote__timeline-title">{step.title}</h3>
                  <p className="home2-quote__timeline-text">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </header>

        <div className="home2-quote__panel">
          <div className="home2-quote__panel-head">
            <h3>{content.formTitle}</h3>
            <p>Share your specs — we’ll reply with a tailored quote.</p>
          </div>

          {status === "success" ? (
            <div className="home2-quote__success">
              <span className="home2-quote__success-icon" aria-hidden="true">
                ✓
              </span>
              <h3>{content.successTitle}</h3>
              <p>{content.successDescription}</p>
              <button
                type="button"
                className="home2-quote__submit"
                onClick={() => setStatus("idle")}
              >
                Send another request
              </button>
            </div>
          ) : (
            <form className="home2-quote__form" onSubmit={handleSubmit} noValidate>
              <div className="home2-quote__grid home2-quote__grid--4">
                <label className="home2-quote__field">
                  <span>Name *</span>
                  <input
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Full name"
                  />
                </label>
                <label className="home2-quote__field">
                  <span>Email *</span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                  />
                </label>
                <label className="home2-quote__field">
                  <span>Phone *</span>
                  <input
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="Phone number"
                  />
                </label>
                <label className="home2-quote__field">
                  <span>Product name *</span>
                  <input
                    name="productName"
                    type="text"
                    required
                    placeholder="e.g. Rigid gift box"
                  />
                </label>
              </div>

              <div className="home2-quote__grid home2-quote__grid--6">
                <label className="home2-quote__field">
                  <span>Width *</span>
                  <input
                    name="width"
                    type="number"
                    min="0"
                    step="any"
                    required
                    placeholder="0"
                    inputMode="decimal"
                  />
                </label>
                <label className="home2-quote__field">
                  <span>Height *</span>
                  <input
                    name="height"
                    type="number"
                    min="0"
                    step="any"
                    required
                    placeholder="0"
                    inputMode="decimal"
                  />
                </label>
                <label className="home2-quote__field">
                  <span>Length *</span>
                  <input
                    name="length"
                    type="number"
                    min="0"
                    step="any"
                    required
                    placeholder="0"
                    inputMode="decimal"
                  />
                </label>
                <label className="home2-quote__field">
                  <span>Unit *</span>
                  <span className="home2-quote__select">
                    <select name="unit" defaultValue="in" required>
                      {content.units.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </span>
                </label>
                <label className="home2-quote__field">
                  <span>Zip code</span>
                  <input
                    name="zip"
                    type="text"
                    autoComplete="postal-code"
                    placeholder="Postal code"
                  />
                </label>
                <label className="home2-quote__field">
                  <span>Quantity</span>
                  <input
                    name="quantity"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="500"
                    inputMode="numeric"
                  />
                </label>
              </div>

              <div className="home2-quote__grid home2-quote__grid--4">
                <label className="home2-quote__field">
                  <span>Material</span>
                  <span className="home2-quote__select">
                    <select name="material" defaultValue="">
                      <option value="" disabled>
                        Select material
                      </option>
                      {content.materials.map((opt) => (
                        <option key={opt.value} value={opt.label}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </span>
                </label>
                <label className="home2-quote__field">
                  <span>Color</span>
                  <span className="home2-quote__select">
                    <select name="color" defaultValue="">
                      <option value="" disabled>
                        Select color
                      </option>
                      {content.colors.map((opt) => (
                        <option key={opt.value} value={opt.label}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </span>
                </label>
                <label className="home2-quote__field">
                  <span>Printing</span>
                  <span className="home2-quote__select">
                    <select name="printing" defaultValue="">
                      <option value="" disabled>
                        Select printing
                      </option>
                      {content.printing.map((opt) => (
                        <option key={opt.value} value={opt.label}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </span>
                </label>
                <label className="home2-quote__field">
                  <span>Coating</span>
                  <span className="home2-quote__select">
                    <select name="coating" defaultValue="">
                      <option value="" disabled>
                        Select coating
                      </option>
                      {content.coatings.map((opt) => (
                        <option key={opt.value} value={opt.label}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </span>
                </label>
              </div>

              <div className="home2-quote__grid home2-quote__grid--split">
                <label className="home2-quote__field">
                  <span>Card thickness</span>
                  <span className="home2-quote__select">
                    <select name="thickness" defaultValue="">
                      <option value="" disabled>
                        Select thickness
                      </option>
                      {content.thicknesses.map((opt) => (
                        <option key={opt.value} value={opt.label}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </span>
                </label>
                <label className="home2-quote__field home2-quote__field--grow">
                  <span>Project details</span>
                  <textarea
                    name="notes"
                    rows={2}
                    placeholder="Artwork notes, deadline, special finishes…"
                  />
                </label>
              </div>

              <div className="home2-quote__footer">
                <label className="home2-quote__captcha">
                  <span>
                    {captcha.a} + {captcha.b} =
                  </span>
                  <input
                    name="captcha"
                    type="number"
                    required
                    inputMode="numeric"
                    placeholder="?"
                    aria-label="Captcha answer"
                  />
                </label>

                {errorMessage ? (
                  <p className="home2-quote__error" role="alert">
                    {errorMessage}
                  </p>
                ) : (
                  <p className="home2-quote__hint">
                    Typical reply within one business day.
                  </p>
                )}

                <button
                  type="submit"
                  className="home2-quote__submit"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "Submitting…" : content.submitLabel}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="home2-quote__queries">
          <div className="home2-quote__queries-copy">
            <h3 className="home2-quote__queries-title">{content.queriesTitle}</h3>
            <p className="home2-quote__queries-text">{content.queriesText}</p>
          </div>
          <ul className="home2-quote__topics">
            {content.topics.map((topic) => (
              <li key={topic.id}>
                <Link href="/contact" className="home2-quote__topic">
                  <span className="home2-quote__check" aria-hidden="true">
                    ✓
                  </span>
                  {topic.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
