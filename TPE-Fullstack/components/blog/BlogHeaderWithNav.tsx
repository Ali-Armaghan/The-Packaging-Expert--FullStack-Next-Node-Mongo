import { getPublicBlogHeaderNav } from "@/lib/nav/queries";
import { BlogHeader } from "./BlogHeader";

/** Server wrapper so layout can stream the header shell immediately. */
export async function BlogHeaderWithNav() {
  const navItems = await getPublicBlogHeaderNav();
  return <BlogHeader navItems={navItems} />;
}
