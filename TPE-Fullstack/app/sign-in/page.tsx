import type { Metadata } from "next";
import Link from "next/link";
import { CustomerAuthShell } from "@/components/auth/CustomerAuthShell";
import { CustomerSignInForm } from "@/components/auth/CustomerSignInForm";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your Packaging Expert account to manage quotes, orders, and saved packaging projects.",
};

export default function SignInPage() {
  return (
    <CustomerAuthShell
      title="Welcome back"
      subtitle="Sign in to access your quotes, orders, and saved packaging projects."
      footer={
        <>
          New here?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-primary hover:text-primary-dark"
          >
            Create an account
          </Link>
        </>
      }
    >
      <CustomerSignInForm />
    </CustomerAuthShell>
  );
}
