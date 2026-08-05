import { AdminGroupByEditor } from "@/components/admin/AdminGroupByEditor";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminGroupByEditPage({ params }: PageProps) {
  const { id } = await params;
  return <AdminGroupByEditor groupId={id} />;
}
