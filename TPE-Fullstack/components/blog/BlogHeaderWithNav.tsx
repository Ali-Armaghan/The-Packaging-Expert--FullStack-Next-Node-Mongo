import { getCachedPublicBlogHeaderNav } from "@/lib/blog/cache";
import { BlogHeader } from "./BlogHeader";

/** Server wrapper so layout can stream the header shell immediately. */
export async function BlogHeaderWithNav() {
  const navItems = await getCachedPublicBlogHeaderNav();
  return <BlogHeader navItems={navItems} />;
}
