import { AdminProductContentItemEditor } from "@/components/admin/AdminProductContentItemEditor";

type PageProps = {
  params: Promise<{ tabId: string; sectionId: string; itemId: string }>;
};

export default async function AdminProductContentItemPage({ params }: PageProps) {
  const { tabId, sectionId, itemId } = await params;
  return (
    <AdminProductContentItemEditor
      tabId={tabId}
      sectionId={sectionId}
      itemId={itemId}
    />
  );
}
