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
    <>
      <Suspense fallback={<BlogHeader navItems={blogHeaderNavItems} />}>
        <BlogHeaderWithNav />
      </Suspense>
      {children}
      <BlogFooter />
    </>
  );
}
