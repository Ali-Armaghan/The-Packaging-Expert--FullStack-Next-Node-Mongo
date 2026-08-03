"use client";

import { useState, type FormEvent } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/site-button";
import { cn } from "@/lib/utils";

const fieldClassName =
  "w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary";

const labelClassName = "mb-1.5 block text-sm font-medium text-foreground";

export function CustomerSignUpForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!acceptTerms) {
      setError("Please accept the terms to create an account.");
      return;
    }

    setLoading(true);
    // Auth wiring comes next — screen + validation only for now.
    await new Promise((resolve) => setTimeout(resolve, 700));
    setLoading(false);
    setError(
      "Create account is almost ready. Registration will be connected in the next step.",
    );
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4" noValidate>
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-950"
        >
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="signup-first-name" className={labelClassName}>
            First name
          </label>
          <input
            id="signup-first-name"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Alex"
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="signup-last-name" className={labelClassName}>
            Last name
          </label>
          <input
            id="signup-last-name"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Morgan"
            className={fieldClassName}
          />
        </div>
      </div>

      <div>
        <label htmlFor="signup-email" className={labelClassName}>
          Work email
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className={fieldClassName}
        />
      </div>

      <div>
        <label htmlFor="signup-company" className={labelClassName}>
          Company <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <input
          id="signup-company"
          name="company"
          type="text"
          autoComplete="organization"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Your company name"
          className={fieldClassName}
        />
      </div>

      <div>
        <label htmlFor="signup-password" className={labelClassName}>
          Password
        </label>
        <div className="relative">
          <input
            id="signup-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className={cn(fieldClassName, "pr-11")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOffIcon className="size-4" />
            ) : (
              <EyeIcon className="size-4" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="signup-confirm" className={labelClassName}>
          Confirm password
        </label>
        <input
          id="signup-confirm"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter password"
          className={fieldClassName}
        />
      </div>

      <label className="flex items-start gap-2.5 text-sm leading-snug text-foreground">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded border-border text-primary accent-primary"
        />
        <span>
          I agree to the{" "}
          <a href="/terms" className="font-semibold text-primary hover:text-primary-dark">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="font-semibold text-primary hover:text-primary-dark">
            Privacy Policy
          </a>
          .
        </span>
      </label>

      <Button
        type="submit"
        size="lg"
        className="mt-1 w-full"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
