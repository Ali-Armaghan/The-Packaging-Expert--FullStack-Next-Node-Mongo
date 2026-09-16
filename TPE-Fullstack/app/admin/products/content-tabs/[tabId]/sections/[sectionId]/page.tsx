import { AdminProductContentSectionWorkspace } from "@/components/admin/AdminProductContentSectionWorkspace";

type PageProps = {
  params: Promise<{ tabId: string; sectionId: string }>;
};

export default async function AdminProductContentSectionPage({
  params,
}: PageProps) {
  const { tabId, sectionId } = await params;
  return (
    <AdminProductContentSectionWorkspace tabId={tabId} sectionId={sectionId} />
  );
}
