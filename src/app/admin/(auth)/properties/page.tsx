import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Plus, ExternalLink, Edit3, ImageIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminPropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: 'desc' },
    include: { governorate: true, city: true, developer: true },
  });

  const statusBadge = (status: string) => {
    switch (status) {
      case 'متاحة للبيع':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'مباعة':
        return 'bg-red-100 text-red-700 border border-red-200';
      case 'محجوزة':
        return 'bg-amber-100 text-amber-700 border border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-navy">إدارة الوحدات</h1>
          <p className="text-gray-400 mt-1">{properties.length} وحدة عقارية</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-gold text-navy font-semibold rounded-xl hover:bg-copper transition-colors shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          إضافة وحدة جديدة
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {properties.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium mb-2">لا توجد وحدات</p>
            <p className="text-gray-400 text-sm">اضغط &quot;إضافة وحدة جديدة&quot; للبدء</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">الصورة</th>
                  <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">كود الوحدة</th>
                  <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">المشروع</th>
                  <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">الموقع</th>
                  <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">السعر</th>
                  <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">الحالة</th>
                  <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">الصور</th>
                  <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                        {p.images && p.images.length > 0 ? (
                          <Image
                            src={p.images[0]}
                            alt={p.projectName}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm bg-navy/5 text-navy px-2.5 py-1 rounded-lg font-medium">{p.unitCode}</span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-navy">{p.projectName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.developer?.nameAr}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-sm">{p.governorate?.nameAr} - {p.city?.nameAr}</td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-navy">{Number(p.totalPrice).toLocaleString('ar-EG')}</p>
                      <p className="text-xs text-gray-400">جنيه مصري</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {p.images && p.images.length > 0 ? (
                          <>
                            <div className="flex -space-x-2 rtl:space-x-reverse">
                              {p.images.slice(0, 3).map((img, i) => (
                                <div key={i} className="w-8 h-8 rounded-lg overflow-hidden border-2 border-white shadow-sm">
                                  <Image
                                    src={img}
                                    alt=""
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                  />
                                </div>
                              ))}
                            </div>
                            {p.images.length > 3 && (
                              <span className="text-xs text-gray-400 mr-1">+{p.images.length - 3}</span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-gray-400">لا صور</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/properties/${p.unitCode}`}
                          className="flex items-center gap-1 text-gold hover:text-copper transition-colors text-sm font-medium"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          تعديل
                        </Link>
                        <span className="text-gray-200">|</span>
                        <Link
                          href={`/properties/${p.unitCode}`}
                          target="_blank"
                          className="flex items-center gap-1 text-gray-400 hover:text-navy transition-colors text-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          عرض
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
