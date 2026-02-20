import { notFound } from 'next/navigation';
import { cache } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PropertyDetail from '@/components/property/PropertyDetail';
import { prisma } from '@/lib/prisma';

const getProperty = cache(async (unitCode: string) => {
  return prisma.property.findUnique({
    where: { unitCode: unitCode.toUpperCase() },
    include: { governorate: true, city: true, developer: true },
  });
});

export async function generateMetadata({ params }: { params: Promise<{ unitCode: string }> }) {
  const { unitCode } = await params;
  const property = await getProperty(unitCode);
  if (!property) return { title: 'عقارك' };
  return {
    title: `${property.unitCode} - ${property.projectName} | عقارك`,
    description: property.marketingDescription?.substring(0, 160) || `${property.projectName} في ${property.city?.nameAr}`,
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ unitCode: string }> }) {
  const { unitCode } = await params;
  const property = await getProperty(unitCode);
  if (!property) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <PropertyDetail property={property} />
      </main>
      <Footer />
    </div>
  );
}
