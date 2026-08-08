import { redirect } from "next/navigation";

/** Old hub URL — Category now lives at `/category`. */
export default function ProductsHubRedirectPage() {
  redirect("/category");
}
