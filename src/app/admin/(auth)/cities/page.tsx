import CitiesManager from '@/components/admin/CitiesManager';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminCitiesPage() {
  const governorates = await prisma.governorate.findMany({
    include: { cities: { orderBy: { sortOrder: 'asc' } } },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy">إدارة المدن</h1>
        <p className="text-gray-400 mt-1">إضافة وإدارة المدن في كل محافظة</p>
      </div>
      <CitiesManager governorates={governorates} />
    </div>
  );
}
