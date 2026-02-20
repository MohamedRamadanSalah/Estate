import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileTabBar from '@/components/layout/MobileTabBar';
import PropertiesList from '@/components/properties/PropertiesList';
import PropertiesFilter from '@/components/properties/PropertiesFilter';
import ScrollProgress from '@/components/ui/ScrollProgress';
import CustomCursor from '@/components/ui/CustomCursor';
import ToastProvider from '@/components/ui/ToastProvider';
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
    <div className="min-h-screen flex flex-col bg-cream">
      <ScrollProgress />
      <CustomCursor />
      <ToastProvider />
      <Navbar />
      <main className="flex-1 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-playfair text-navy mb-2">
              عقارات {governorate.nameAr}
            </h1>
            <p className="text-gray-500 text-sm">اكتشف أفضل العقارات والمشاريع في {governorate.nameAr}</p>
          </div>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <aside className="lg:w-72 shrink-0 lg:sticky lg:top-24 lg:self-start">
              <PropertiesFilter initialGovernorate={slug} cities={governorate.cities} />
            </aside>
            <div className="flex-1 min-w-0">
              <PropertiesList initialGovernorate={slug} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  );
}
