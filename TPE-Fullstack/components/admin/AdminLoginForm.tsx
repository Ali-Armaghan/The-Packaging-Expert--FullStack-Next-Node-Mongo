"use client";

import { useEffect, useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const authError = searchParams.get("error");
    if (!authError) return;
    if (authError === "Configuration") {
      setError("Unable to complete sign-in. Please try again.");
    } else if (authError === "CredentialsSignin") {
      setError("Invalid email or password.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      try {
        const health = await fetch("/api/health/db", { cache: "no-store" });
        const healthData = (await health.json()) as { ok?: boolean };
        if (!healthData.ok) {
          setError(
            "Unable to reach the database. Please contact your administrator.",
          );
          return;
        }
      } catch {
        // ignore
      }

      if (result.error === "Configuration") {
        setError("Unable to complete sign-in. Please try again.");
        return;
      }

      setError("Invalid email or password.");
      return;
    }

    router.replace(callbackUrl.startsWith("/admin") ? callbackUrl : "/admin");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <Alert
          variant="destructive"
          className="border-destructive/20 bg-destructive/5 py-3"
        >
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="admin-email" className="text-sm font-medium">
          Email address
        </Label>
        <Input
          id="admin-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
          className="h-11 rounded-md bg-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-password" className="text-sm font-medium">
          Password
        </Label>
        <div className="relative">
          <Input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="h-11 rounded-md bg-white pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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

      <Button
        type="submit"
        disabled={loading}
        className="mt-1 h-11 w-full rounded-md text-sm font-semibold"
      >
        {loading ? (
          <>
            <Loader2Icon className="animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
