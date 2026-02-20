import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminDevelopersPage() {
  const developers = await prisma.developer.findMany({
    include: { _count: { select: { properties: true } } },
    orderBy: { nameAr: 'asc' },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-navy mb-8">إدارة المطورين</h1>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-navy/5">
            <tr>
              <th className="text-right py-3 px-4">الاسم</th>
              <th className="text-right py-3 px-4">عدد الوحدات</th>
            </tr>
          </thead>
          <tbody>
            {developers.map((d) => (
              <tr key={d.id} className="border-b">
                <td className="py-3 px-4">{d.nameAr}</td>
                <td className="py-3 px-4">{d._count.properties}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
