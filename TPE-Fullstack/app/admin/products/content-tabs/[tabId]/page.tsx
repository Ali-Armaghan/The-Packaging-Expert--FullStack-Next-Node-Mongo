import { AdminProductContentTabWorkspace } from "@/components/admin/AdminProductContentTabWorkspace";

type PageProps = {
  params: Promise<{ tabId: string }>;
};

export default async function AdminProductContentTabPage({ params }: PageProps) {
  const { tabId } = await params;
  return <AdminProductContentTabWorkspace tabId={tabId} />;
}
