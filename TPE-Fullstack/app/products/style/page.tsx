import { redirect } from "next/navigation";

/** Old styles hub URL — Styles now live at `/style`. */
export default function ProductsStyleRedirectPage() {
  redirect("/style");
}
