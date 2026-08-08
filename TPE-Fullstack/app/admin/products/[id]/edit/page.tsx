import { AdminProductPageEditor } from "@/components/admin/AdminProductPageEditor";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductEditPage({ params }: PageProps) {
  const { id } = await params;
  return <AdminProductPageEditor productId={id} />;
}
