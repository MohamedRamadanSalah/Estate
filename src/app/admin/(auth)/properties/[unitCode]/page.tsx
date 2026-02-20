import { notFound } from 'next/navigation';
import PropertyForm from '@/components/admin/PropertyForm';
import { prisma } from '@/lib/prisma';

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ unitCode: string }>;
}) {
  const { unitCode } = await params;
  const property = await prisma.property.findUnique({
    where: { unitCode: unitCode.toUpperCase() },
    include: { governorate: true, city: true, developer: true },
  });
  if (!property) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy">تعديل الوحدة</h1>
        <p className="text-gray-400 text-sm mt-1">كود الوحدة: <span className="font-mono font-bold text-navy">{property.unitCode}</span></p>
      </div>
      <PropertyForm property={property} />
    </div>
  );
}
