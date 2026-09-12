"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type FormEvent } from "react";
import type { Home2QuoteContent } from "@/lib/home2/content";

type Home2QuoteSectionProps = {
  content: Home2QuoteContent;
};

type FormStatus = "idle" | "saving" | "success" | "error";

type QuoteStepId = 1 | 2 | 3 | 4;

type FormValues = {
  name: string;
  email: string;
  phone: string;
  productName: string;
  width: string;
  height: string;
  length: string;
  unit: "in" | "cm" | "mm";
  zip: string;
  quantity: string;
  material: string;
  color: string;
  printing: string;
  coating: string;
  thickness: string;
  addOn: string;
  notes: string;
  captcha: string;
};

const INITIAL_VALUES: FormValues = {
  name: "",
  email: "",
  phone: "",
  productName: "",
  width: "",
  height: "",
  length: "",
  unit: "in",
  zip: "",
  quantity: "",
  material: "",
  color: "",
  printing: "",
  coating: "",
  thickness: "",
  addOn: "",
  notes: "",
  captcha: "",
};

const FORM_STEPS: {
  id: QuoteStepId;
  label: string;
  title: string;
  hint: string;
}[] = [
  {
    id: 1,
    label: "You",
    title: "Your details",
    hint: "We’ll use this to send your quote.",
  },
  {
    id: 2,
    label: "Size",
    title: "Product & size",
    hint: "Tell us the format and dimensions.",
  },
  {
    id: 3,
    label: "Specs",
    title: "Material & finish",
    hint: "Optional — skip anything you’re unsure about.",
  },
  {
    id: 4,
    label: "Notes",
    title: "Project details",
    hint: "Anything else we should know before quoting.",
  },
];

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

function optionalNumber(value: string): number | undefined {
  const raw = value.trim();
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

type QuoteApiResult = {
  success?: boolean;
  error?: string;
  details?: { fieldErrors?: Record<string, string[]> };
  data?: { id?: string };
};

async function saveQuote(
  quoteId: string | null,
  payload: Record<string, unknown>,
): Promise<string> {
  const response = await fetch(quoteId ? `/api/quotes/${quoteId}` : "/api/quotes", {
    method: quoteId ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as QuoteApiResult;
  if (!response.ok || !result.success) {
    const fieldErrors = result.details?.fieldErrors;
    const firstFieldError = fieldErrors
      ? Object.values(fieldErrors).flat()[0]
      : undefined;
    throw new Error(
      firstFieldError || result.error || "Unable to save. Please try again.",
    );
  }

  const id = result.data?.id ?? quoteId;
  if (!id) throw new Error("Unable to save. Please try again.");
  return id;
}

function buildStepPayload(
  step: QuoteStepId,
  values: FormValues,
  complete: boolean,
) {
  const { firstName, lastName } = splitName(values.name);
  const base = {
    firstName,
    lastName,
    email: values.email.trim(),
    phone: values.phone.trim() || undefined,
    step,
    complete,
  };

  if (step === 1 && !complete) return base;

  return {
    ...base,
    productType: values.productName.trim() || undefined,
    width: optionalNumber(values.width),
    height: optionalNumber(values.height),
    length: optionalNumber(values.length),
    unit: values.unit,
    zip: values.zip.trim() || undefined,
    quantity: optionalNumber(values.quantity),
    material: values.material || undefined,
    color: values.color || undefined,
    printing: values.printing || undefined,
    coating: values.coating || undefined,
    thickness: values.thickness || undefined,
    addOn: values.addOn || undefined,
    notes: values.notes.trim() || undefined,
  };
}

function validateStep(step: QuoteStepId, values: FormValues, captchaSum: number) {
  if (step === 1) {
    if (!values.name.trim()) return "Please enter your name.";
    if (!isValidEmail(values.email)) return "Enter a valid email address.";
    if (!values.phone.trim()) return "Please enter your phone number.";
    return null;
  }

  if (step === 2) {
    if (!values.productName.trim()) return "Please enter a product name.";
    if (!optionalNumber(values.width)) return "Please enter width.";
    if (!optionalNumber(values.height)) return "Please enter height.";
    if (!optionalNumber(values.length)) return "Please enter length.";
    return null;
  }

  if (step === 4) {
    const answer = Number(values.captcha.trim());
    if (answer !== captchaSum) return "Captcha answer is incorrect. Please try again.";
  }

  return null;
}

/**
 * Landscape quote section — process timeline + stepped quote form.
 */
export function Home2QuoteSection({ content }: Home2QuoteSectionProps) {
  const captcha = useMemo(() => {
    const a = 2 + Math.floor(Math.random() * 7);
    const b = 2 + Math.floor(Math.random() * 7);
    return { a, b, sum: a + b };
  }, []);

  const [step, setStep] = useState<QuoteStepId>(1);
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const quoteIdRef = useRef<string | null>(null);
  const saveChainRef = useRef(Promise.resolve());

  const activeMeta = FORM_STEPS[step - 1] ?? FORM_STEPS[0];
  const saving = status === "saving";

  const setField = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const enqueueSave = (payload: Record<string, unknown>) => {
    const run = saveChainRef.current.then(async () => {
      const id = await saveQuote(quoteIdRef.current, payload);
      quoteIdRef.current = id;
    });
    saveChainRef.current = run.catch(() => undefined);
    return run;
  };

  const handleContinue = async () => {
    if (saving) return;
    const error = validateStep(step, values, captcha.sum);
    if (error) {
      setStatus("error");
      setErrorMessage(error);
      return;
    }

    setErrorMessage(null);

    if (step === 4) {
      setStatus("saving");
      try {
        await enqueueSave(buildStepPayload(4, values, true));
        quoteIdRef.current = null;
        setValues(INITIAL_VALUES);
        setStep(1);
        setStatus("success");
      } catch (saveError) {
        setStatus("error");
        setErrorMessage(
          saveError instanceof Error
            ? saveError.message
            : "Unable to save. Please try again.",
        );
      }
      return;
    }

    const payload = buildStepPayload(step, values, false);
    setStep((step + 1) as QuoteStepId);
    setStatus("idle");
    void enqueueSave(payload).catch((saveError: unknown) => {
      setStatus("error");
      setErrorMessage(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save. Please try again.",
      );
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void handleContinue();
  };

  const handleBack = () => {
    if (saving || step === 1) return;
    setErrorMessage(null);
    setStatus("idle");
    setStep((prev) => (prev - 1) as QuoteStepId);
  };

  const resetForm = () => {
    quoteIdRef.current = null;
    saveChainRef.current = Promise.resolve();
    setValues(INITIAL_VALUES);
    setStep(1);
    setStatus("idle");
    setErrorMessage(null);
  };

  return (
    <section className="home2-quote" aria-label="Order process and custom quote">
      <div className="home2-quote__shell">
        <div className="home2-quote__layout">
          <aside className="home2-quote__aside">
            <header className="home2-quote__intro">
              <p className="home2-quote__eyebrow">
                <span className="home2-quote__eyebrow-dot" />
                How it works
              </p>
              <h2 className="home2-quote__process-title">{content.processTitle}</h2>
            </header>

            <ol className="home2-quote__timeline">
              {content.steps.map((item, index) => (
                <li key={item.id} className="home2-quote__timeline-item">
                  <span className="home2-quote__timeline-node" aria-hidden="true">
                    {index + 1}
                  </span>
                  <div className="home2-quote__timeline-copy">
                    <h3 className="home2-quote__timeline-title">{item.title}</h3>
                    <p className="home2-quote__timeline-text">{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </aside>

          <div className="home2-quote__panel">
            <div className="home2-quote__panel-head">
            <div>
              <h3>{content.formTitle}</h3>
              <p>Share your specs — we’ll reply with a tailored quote.</p>
            </div>
            <span className="home2-quote__panel-count">
              {step}/{FORM_STEPS.length}
            </span>
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
                onClick={resetForm}
              >
                Send another request
              </button>
            </div>
          ) : (
            <form className="home2-quote__form" onSubmit={handleSubmit} noValidate>
              <ol
                className="home2-quote__stepper"
                aria-label="Quote form steps"
                style={{
                  ["--quote-progress" as string]:
                    FORM_STEPS.length > 1
                      ? (step - 1) / (FORM_STEPS.length - 1)
                      : 0,
                }}
              >
                {FORM_STEPS.map((item) => {
                  const state =
                    item.id === step
                      ? "active"
                      : item.id < step
                        ? "done"
                        : "todo";
                  return (
                    <li key={item.id} className="home2-quote__stepper-item">
                      <button
                        type="button"
                        className={`home2-quote__stepper-btn home2-quote__stepper-btn--${state}`}
                        onClick={() => {
                          if (item.id < step) {
                            setErrorMessage(null);
                            setStatus("idle");
                            setStep(item.id);
                          }
                        }}
                        disabled={item.id > step || saving}
                        aria-current={item.id === step ? "step" : undefined}
                      >
                        <span className="home2-quote__stepper-num">
                          {state === "done" ? "✓" : item.id}
                        </span>
                        <span className="home2-quote__stepper-label">
                          {item.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div key={step} className="home2-quote__body">
              <div className="home2-quote__step-head">
                <h4 className="home2-quote__step-title">{activeMeta.title}</h4>
                <p className="home2-quote__step-hint">{activeMeta.hint}</p>
              </div>

              {step === 1 ? (
                <div className="home2-quote__grid home2-quote__grid--3">
                  <label className="home2-quote__field">
                    <span>Name *</span>
                    <input
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Full name"
                      value={values.name}
                      onChange={(e) => setField("name", e.target.value)}
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
                      value={values.email}
                      onChange={(e) => setField("email", e.target.value)}
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
                      value={values.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                    />
                  </label>
                </div>
              ) : null}

              {step === 2 ? (
                <>
                  <div className="home2-quote__grid">
                    <label className="home2-quote__field">
                      <span>Product name *</span>
                      <input
                        name="productName"
                        type="text"
                        required
                        placeholder="e.g. Rigid gift box"
                        value={values.productName}
                        onChange={(e) => setField("productName", e.target.value)}
                      />
                    </label>
                  </div>
                  <div className="home2-quote__grid home2-quote__grid--dims">
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
                        value={values.width}
                        onChange={(e) => setField("width", e.target.value)}
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
                        value={values.height}
                        onChange={(e) => setField("height", e.target.value)}
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
                        value={values.length}
                        onChange={(e) => setField("length", e.target.value)}
                      />
                    </label>
                    <label className="home2-quote__field">
                      <span>Unit *</span>
                      <span className="home2-quote__select">
                        <select
                          name="unit"
                          required
                          value={values.unit}
                          onChange={(e) =>
                            setField(
                              "unit",
                              e.target.value as FormValues["unit"],
                            )
                          }
                        >
                          {content.units.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </span>
                    </label>
                  </div>
                  <div className="home2-quote__grid home2-quote__grid--2">
                    <label className="home2-quote__field">
                      <span>Quantity</span>
                      <input
                        name="quantity"
                        type="number"
                        min="1"
                        step="1"
                        placeholder="500"
                        inputMode="numeric"
                        value={values.quantity}
                        onChange={(e) => setField("quantity", e.target.value)}
                      />
                    </label>
                    <label className="home2-quote__field">
                      <span>Zip code</span>
                      <input
                        name="zip"
                        type="text"
                        autoComplete="postal-code"
                        placeholder="Postal code"
                        value={values.zip}
                        onChange={(e) => setField("zip", e.target.value)}
                      />
                    </label>
                  </div>
                </>
              ) : null}

              {step === 3 ? (
                <div className="home2-quote__grid home2-quote__grid--3">
                  <label className="home2-quote__field">
                    <span>Material</span>
                    <span className="home2-quote__select">
                      <select
                        name="material"
                        value={values.material}
                        onChange={(e) => setField("material", e.target.value)}
                      >
                        <option value="">Select material</option>
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
                      <select
                        name="color"
                        value={values.color}
                        onChange={(e) => setField("color", e.target.value)}
                      >
                        <option value="">Select color</option>
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
                      <select
                        name="printing"
                        value={values.printing}
                        onChange={(e) => setField("printing", e.target.value)}
                      >
                        <option value="">Select printing</option>
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
                      <select
                        name="coating"
                        value={values.coating}
                        onChange={(e) => setField("coating", e.target.value)}
                      >
                        <option value="">Select coating</option>
                        {content.coatings.map((opt) => (
                          <option key={opt.value} value={opt.label}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </span>
                  </label>
                  <label className="home2-quote__field">
                    <span>Card thickness</span>
                    <span className="home2-quote__select">
                      <select
                        name="thickness"
                        value={values.thickness}
                        onChange={(e) => setField("thickness", e.target.value)}
                      >
                        <option value="">Select thickness</option>
                        {content.thicknesses.map((opt) => (
                          <option key={opt.value} value={opt.label}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </span>
                  </label>
                  <label className="home2-quote__field">
                    <span>Add-on</span>
                    <span className="home2-quote__select">
                      <select
                        name="addOn"
                        value={values.addOn}
                        onChange={(e) => setField("addOn", e.target.value)}
                      >
                        <option value="">None</option>
                        {content.addOns.map((opt) => (
                          <option key={opt.value} value={opt.label}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </span>
                  </label>
                </div>
              ) : null}

              {step === 4 ? (
                <div className="home2-quote__grid">
                  <label className="home2-quote__field">
                    <span>Project details</span>
                    <textarea
                      name="notes"
                      rows={5}
                      placeholder="Artwork notes, deadline, special finishes…"
                      value={values.notes}
                      onChange={(e) => setField("notes", e.target.value)}
                    />
                  </label>
                </div>
              ) : null}
              </div>

              <div className="home2-quote__footer">
                {step === 4 ? (
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
                      value={values.captcha}
                      onChange={(e) => setField("captcha", e.target.value)}
                    />
                  </label>
                ) : null}

                {errorMessage ? (
                  <p className="home2-quote__error" role="alert">
                    {errorMessage}
                  </p>
                ) : (
                  <p className="home2-quote__hint">
                    {step === 4
                      ? "Typical reply within one business day."
                      : "Continue to save this step and move ahead."}
                  </p>
                )}

                <div className="home2-quote__actions">
                  <button
                    type="button"
                    className="home2-quote__back"
                    onClick={handleBack}
                    disabled={step === 1 || saving}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="home2-quote__submit"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving…"
                      : step === 4
                        ? content.submitLabel
                        : "Continue"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
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
