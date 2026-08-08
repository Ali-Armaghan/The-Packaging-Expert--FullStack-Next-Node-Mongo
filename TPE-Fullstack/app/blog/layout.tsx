import { Suspense } from "react";
import { BlogFooter } from "@/components/blog/BlogFooter";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogHeaderWithNav } from "@/components/blog/BlogHeaderWithNav";
import { blogHeaderNavItems } from "@/constants/blogHeader";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="route-enter flex min-h-0 flex-1 flex-col">
      <Suspense fallback={<BlogHeader navItems={blogHeaderNavItems} />}>
        <BlogHeaderWithNav />
      </Suspense>
      <div className="route-enter-delay flex-1">{children}</div>
      <BlogFooter />
    </div>
  );
}
