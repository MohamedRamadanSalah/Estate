import { prisma } from '@/lib/prisma';
import { Users, Building2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDevelopersPage() {
  const developers = await prisma.developer.findMany({
    include: { _count: { select: { properties: true } } },
    orderBy: { nameAr: 'asc' },
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy">إدارة المطورين</h1>
        <p className="text-gray-400 text-sm mt-1">{developers.length} مطور عقاري</p>
      </div>

      {developers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">لا يوجد مطورين بعد</p>
          <p className="text-gray-400 text-sm mt-1">سيتم إنشاء المطورين تلقائياً عند إضافة وحدات</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {developers.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl hover:border-gold/20 transition-all duration-200 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-navy/5 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-gold/10 transition-colors">
                  <Building2 className="w-6 h-6 text-navy/40 group-hover:text-gold transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-navy text-lg truncate">{d.nameAr}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gold/10 text-gold text-xs font-semibold rounded-full">
                      {d._count.properties} وحدة
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
