import Link from "next/link";
import { auth } from "@/auth";
import { getDefaultLandingPath } from "@/lib/auth/permissions";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default async function AdminUnauthorizedPage() {
  const session = await auth();
  const home = getDefaultLandingPath({
    role: session?.user?.role,
    permissions: session?.user?.permissions,
  });

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center">
      <Card className="w-full border-border/70 shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Access denied</CardTitle>
          <CardDescription className="text-pretty">
            You don&apos;t have permission to view this section. Ask a
            superadmin to update your sidebar access.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          <Link
            href={home}
            className={cn(buttonVariants({ size: "lg" }), "h-10 px-5")}
          >
            Go to available page
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
