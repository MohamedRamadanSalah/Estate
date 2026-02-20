import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminPropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: 'desc' },
    include: { governorate: true, city: true, developer: true },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-navy">إدارة الوحدات</h1>
        <Link
          href="/admin/properties/new"
          className="px-6 py-2 bg-gold text-navy font-semibold rounded-lg hover:bg-copper"
        >
          إضافة وحدة جديدة
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {properties.length === 0 ? (
          <p className="p-8 text-center text-gray">لا توجد وحدات. اضغط &quot;إضافة وحدة جديدة&quot;</p>
        ) : (
          <table className="w-full">
            <thead className="bg-navy/5">
              <tr>
                <th className="text-right py-3 px-4">كود الوحدة</th>
                <th className="text-right py-3 px-4">المشروع</th>
                <th className="text-right py-3 px-4">الموقع</th>
                <th className="text-right py-3 px-4">السعر</th>
                <th className="text-right py-3 px-4">الحالة</th>
                <th className="text-right py-3 px-4">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="py-3 px-4 font-mono">{p.unitCode}</td>
                  <td className="py-3 px-4">{p.projectName}</td>
                  <td className="py-3 px-4">{p.governorate?.nameAr} - {p.city?.nameAr}</td>
                  <td className="py-3 px-4">{Number(p.totalPrice).toLocaleString('ar-EG')} ج.م</td>
                  <td className="py-3 px-4">{p.status}</td>
                  <td className="py-3 px-4">
                    <Link href={`/admin/properties/${p.unitCode}`} className="text-gold hover:underline ml-2">
                      تعديل
                    </Link>
                    <Link href={`/properties/${p.unitCode}`} target="_blank" className="text-gray hover:underline">
                      عرض
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
