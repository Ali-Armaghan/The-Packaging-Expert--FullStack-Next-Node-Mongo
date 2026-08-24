import { redirect } from "next/navigation";

/** /home2 now lives at the root — keep old URL working. */
export default function Home2RedirectPage() {
  redirect("/");
}
