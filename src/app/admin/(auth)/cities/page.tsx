import CitiesManager from '@/components/admin/CitiesManager';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminCitiesPage() {
  const governorates = await prisma.governorate.findMany({
    include: { cities: { orderBy: { sortOrder: 'asc' } } },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-navy mb-8">إدارة المدن</h1>
      <CitiesManager governorates={governorates} />
    </div>
  );
}
