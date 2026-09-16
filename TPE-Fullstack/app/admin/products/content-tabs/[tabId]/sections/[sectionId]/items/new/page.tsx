import { AdminProductContentItemEditor } from "@/components/admin/AdminProductContentItemEditor";

type PageProps = {
  params: Promise<{ tabId: string; sectionId: string }>;
};

export default async function AdminProductContentNewItemPage({
  params,
}: PageProps) {
  const { tabId, sectionId } = await params;
  return <AdminProductContentItemEditor tabId={tabId} sectionId={sectionId} />;
}
