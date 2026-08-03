import { BlogFooter } from "@/components/blog/BlogFooter";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { getPublicBlogHeaderNav } from "@/lib/nav/queries";

export const dynamic = "force-dynamic";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = await getPublicBlogHeaderNav();

  return (
    <>
      <BlogHeader navItems={navItems} />
      {children}
      <BlogFooter />
    </>
  );
}
