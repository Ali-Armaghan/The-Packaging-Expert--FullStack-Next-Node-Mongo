import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Products", value: "—", href: "/admin/products" },
  { label: "Quote requests", value: "—", href: "/admin/quotes" },
  { label: "Contact leads", value: "—", href: "/admin/leads" },
  { label: "Blog posts", value: "—", href: "/admin/blog" },
] as const;

const quickLinks = [
  {
    title: "Products",
    description: "Manage packaging catalog items and specs.",
    href: "/admin/products",
  },
  {
    title: "Quotes",
    description: "Review incoming custom packaging quote requests.",
    href: "/admin/quotes",
  },
  {
    title: "Contact leads",
    description: "Messages submitted from the Contact Us page.",
    href: "/admin/leads",
  },
  {
    title: "Categories",
    description: "Organize products by packaging type.",
    href: "/admin/categories",
  },
] as const;

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="secondary">Overview</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
            Overview of your Packing Expert admin workspace.
          </p>
        </div>
        <Link
          href="/admin/users"
          className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
        >
          Manage users
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <CardHeader className="pb-0">
                <CardDescription className="text-xs font-semibold uppercase tracking-wide">
                  {stat.label}
                </CardDescription>
                <CardTitle className="text-3xl font-bold tracking-tight">
                  {stat.value}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick links</CardTitle>
          <CardDescription>
            Jump into the areas you&apos;ll manage most often.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-border bg-card px-4 py-4 transition-colors hover:border-primary/40 hover:bg-accent/50"
              >
                <p className="text-sm font-semibold">{link.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {link.description}
                </p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
