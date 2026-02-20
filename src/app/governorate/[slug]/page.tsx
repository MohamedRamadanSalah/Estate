import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PropertiesList from '@/components/properties/PropertiesList';
import PropertiesFilter from '@/components/properties/PropertiesFilter';
import { prisma } from '@/lib/prisma';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const gov = await prisma.governorate.findUnique({ where: { slug } });
  if (!gov) return { title: 'عقارك' };
  return { title: `عقارات ${gov.nameAr} | عقارك` };
}

export default async function GovernoratePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const governorate = await prisma.governorate.findUnique({
    where: { slug },
    include: { cities: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
  });
  if (!governorate) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-navy mb-6">عقارات {governorate.nameAr}</h1>
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-72 shrink-0">
              <PropertiesFilter initialGovernorate={slug} cities={governorate.cities} />
            </aside>
            <div className="flex-1">
              <PropertiesList initialGovernorate={slug} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
