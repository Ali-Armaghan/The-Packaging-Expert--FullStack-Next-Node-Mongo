import { AdminIndustriesManager } from "@/components/admin/AdminIndustriesManager";
import { AdminMenuGroupLinks } from "@/components/admin/AdminMenuGroupLinks";
import { Separator } from "@/components/ui/separator";

export default function AdminIndustriesPage() {
  return (
    <div className="space-y-10">
      <AdminMenuGroupLinks
        menuKey="industries"
        description="Link each Industries nav menu item to a Group By page. Users open that URL on click."
      />
      <Separator />
      <div>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">
          Industry content (CMS)
        </h2>
        <AdminIndustriesManager />
      </div>
    </div>
  );
}
