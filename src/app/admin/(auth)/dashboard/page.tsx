import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [total, available, sold, reserved] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: 'متاحة للبيع' } }),
    prisma.property.count({ where: { status: 'مباعة' } }),
    prisma.property.count({ where: { status: 'محجوزة' } }),
  ]);

  const stats = [
    { label: 'إجمالي الوحدات', value: total, href: '/admin/properties' },
    { label: 'متاحة للبيع', value: available, color: 'text-success' },
    { label: 'مباعة', value: sold },
    { label: 'محجوزة', value: reserved },
  ];

  const recentProperties = await prisma.property.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { governorate: true, city: true },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-navy mb-8">لوحة التحكم</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={(s as { href?: string }).href || '#'}
            className="bg-white rounded-xl shadow-lg p-6 hover:border-gold border-2 border-transparent transition-colors"
          >
            <p className="text-gray mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color || 'text-navy'}`}>
              {s.value.toLocaleString('ar-EG')}
            </p>
          </Link>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-navy mb-4">أحدث الوحدات</h2>
        {recentProperties.length === 0 ? (
          <p className="text-gray">لا توجد وحدات بعد.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-right py-3">كود الوحدة</th>
                <th className="text-right py-3">المشروع</th>
                <th className="text-right py-3">الموقع</th>
                <th className="text-right py-3">الحالة</th>
                <th className="text-right py-3">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {recentProperties.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="py-3 font-mono">{p.unitCode}</td>
                  <td className="py-3">{p.projectName}</td>
                  <td className="py-3">{p.governorate?.nameAr} - {p.city?.nameAr}</td>
                  <td className="py-3">{p.status}</td>
                  <td className="py-3">
                    <Link href={`/admin/properties/${p.unitCode}`} className="text-gold hover:underline">
                      تعديل
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
