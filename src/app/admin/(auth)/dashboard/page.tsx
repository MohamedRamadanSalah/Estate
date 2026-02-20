import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Building2, CheckCircle, XCircle, Clock, ArrowUpLeft, ImageIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [total, available, sold, reserved] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: 'متاحة للبيع' } }),
    prisma.property.count({ where: { status: 'مباعة' } }),
    prisma.property.count({ where: { status: 'محجوزة' } }),
  ]);

  const stats = [
    { label: 'إجمالي الوحدات', value: total, href: '/admin/properties', color: 'from-navy/90 to-navy', iconBg: 'bg-gold/20', iconColor: 'text-gold', icon: Building2 },
    { label: 'متاحة للبيع', value: available, href: '#', color: 'from-emerald-500 to-emerald-600', iconBg: 'bg-white/20', iconColor: 'text-white', icon: CheckCircle },
    { label: 'مباعة', value: sold, href: '#', color: 'from-red-500 to-red-600', iconBg: 'bg-white/20', iconColor: 'text-white', icon: XCircle },
    { label: 'محجوزة', value: reserved, href: '#', color: 'from-amber-500 to-amber-600', iconBg: 'bg-white/20', iconColor: 'text-white', icon: Clock },
  ];

  const recentProperties = await prisma.property.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { governorate: true, city: true },
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-navy">لوحة التحكم</h1>
        <p className="text-gray-400 mt-1">نظرة عامة على وحداتك العقارية</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.color} p-6 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group`}
            >
              {/* Decorative circle */}
              <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-white/5" />
              <div className="absolute -left-2 -bottom-2 w-16 h-16 rounded-full bg-white/5" />

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">{s.label}</p>
                  <p className="text-4xl font-bold tracking-tight">
                    {s.value.toLocaleString('ar-EG')}
                  </p>
                </div>
                <div className={`w-12 h-12 ${s.iconBg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${s.iconColor}`} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Properties Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-navy">أحدث الوحدات</h2>
            <p className="text-gray-400 text-sm mt-0.5">آخر ٥ وحدات تمت إضافتها</p>
          </div>
          <Link
            href="/admin/properties"
            className="flex items-center gap-1 text-sm text-gold hover:text-copper transition-colors font-medium"
          >
            عرض الكل
            <ArrowUpLeft className="w-4 h-4" />
          </Link>
        </div>

        {recentProperties.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">لا توجد وحدات بعد</p>
            <Link href="/admin/properties/new" className="text-gold hover:underline text-sm mt-1 inline-block">
              أضف وحدة جديدة
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">الصورة</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">كود الوحدة</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">المشروع</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">الموقع</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">الحالة</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentProperties.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                        {p.images && p.images.length > 0 ? (
                          <Image
                            src={p.images[0]}
                            alt={p.projectName}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-gray-300" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm bg-navy/5 text-navy px-2 py-1 rounded-lg">{p.unitCode}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-navy">{p.projectName}</td>
                    <td className="py-3 px-4 text-gray-500 text-sm">{p.governorate?.nameAr} - {p.city?.nameAr}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link href={`/admin/properties/${p.unitCode}`} className="text-gold hover:text-copper transition-colors text-sm font-medium">
                        تعديل
                      </Link>
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
