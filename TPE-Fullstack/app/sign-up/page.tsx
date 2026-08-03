import type { Metadata } from "next";
import Link from "next/link";
import { CustomerAuthShell } from "@/components/auth/CustomerAuthShell";
import { CustomerSignUpForm } from "@/components/auth/CustomerSignUpForm";

export const metadata: Metadata = {
  title: "Create an Account",
  description:
    "Create a Packaging Expert account to save quotes, reorder packaging, and track your projects.",
};

export default function SignUpPage() {
  return (
    <CustomerAuthShell
      title="Create your account"
      subtitle="Set up a free customer account to save quotes and speed up reorders."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-primary hover:text-primary-dark"
          >
            Sign in
          </Link>
        </>
      }
    >
      <CustomerSignUpForm />
    </CustomerAuthShell>
  );
}
