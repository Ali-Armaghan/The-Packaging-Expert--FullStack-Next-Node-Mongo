import { AdminProductEditor } from "@/components/admin/AdminProductEditor";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductEditPage({ params }: PageProps) {
  const { id } = await params;
  return <AdminProductEditor mode="edit" productId={id} />;
}
