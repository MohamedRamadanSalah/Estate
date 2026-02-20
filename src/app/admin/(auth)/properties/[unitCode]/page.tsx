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
    <div>
      <h1 className="text-3xl font-bold text-navy mb-8">تعديل الوحدة: {property.unitCode}</h1>
      <PropertyForm property={property} />
    </div>
  );
}
