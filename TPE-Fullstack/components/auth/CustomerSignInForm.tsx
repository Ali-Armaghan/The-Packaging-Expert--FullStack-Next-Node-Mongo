"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/site-button";
import { cn } from "@/lib/utils";

const fieldClassName =
  "w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary";

const labelClassName = "mb-1.5 block text-sm font-medium text-foreground";

export function CustomerSignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    setLoading(true);
    // Auth wiring comes next — screen + validation only for now.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLoading(false);
    setError(
      "Sign-in is almost ready. Account authentication will be connected in the next step.",
    );
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5" noValidate>
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-950"
        >
          {error}
        </div>
      )}

      <div>
        <label htmlFor="customer-email" className={labelClassName}>
          Email address
        </label>
        <input
          id="customer-email"
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
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <label htmlFor="customer-password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <Link
            href="/sign-in#forgot"
            className="text-xs font-semibold text-primary hover:text-primary-dark"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            id="customer-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
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

      <label className="flex items-center gap-2.5 text-sm text-foreground">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="size-4 rounded border-border text-primary accent-primary"
        />
        Keep me signed in
      </label>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
