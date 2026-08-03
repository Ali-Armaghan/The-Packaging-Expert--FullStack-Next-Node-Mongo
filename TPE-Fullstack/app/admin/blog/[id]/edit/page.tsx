import { AdminBlogEditor } from "@/components/admin/AdminBlogEditor";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminBlogEditPage({ params }: PageProps) {
  const { id } = await params;
  return <AdminBlogEditor postId={id} />;
}
