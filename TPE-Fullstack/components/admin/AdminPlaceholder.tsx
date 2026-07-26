import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AdminPlaceholderProps = {
  title: string;
  description: string;
};

export function AdminPlaceholder({ title, description }: AdminPlaceholderProps) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">{title}</CardTitle>
        <CardDescription className="max-w-2xl text-pretty">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          This section is scaffolded. CRUD + Mongo wiring next.
        </p>
        <Link
          href="/admin"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          ← Back to dashboard
        </Link>
      </CardContent>
    </Card>
  );
}
