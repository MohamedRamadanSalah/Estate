import { redirect } from 'next/navigation';
import { getAdminFromCookie } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminFromCookie();
  if (!admin) redirect('/admin/login');

  return (
    <div className="min-h-screen flex bg-cream" dir="rtl">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
