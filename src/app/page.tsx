import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileTabBar from '@/components/layout/MobileTabBar';
import PropertyCard from '@/components/property/PropertyCard';
import Hero from '@/components/home/Hero';
import GovernoratesSection from '@/components/home/GovernoratesSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import ScrollProgress from '@/components/ui/ScrollProgress';
import CustomCursor from '@/components/ui/CustomCursor';
import ToastProvider from '@/components/ui/ToastProvider';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getFeaturedProperties() {
  return prisma.property.findMany({
    where: { status: 'متاحة للبيع' },
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      governorate: true,
      city: true,
      developer: true,
    },
  });
}

async function getStats() {
  const [totalUnits, governorsCount, developersCount] = await Promise.all([
    prisma.property.count(),
    prisma.governorate.count(),
    prisma.developer.count(),
  ]);
  return { totalUnits, governorsCount, developersCount };
}

export default async function HomePage() {
  const [featured, stats, governorates] = await Promise.all([
    getFeaturedProperties(),
    getStats(),
    prisma.governorate.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { properties: true } } },
    }),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <CustomCursor />
      <ToastProvider />
      <Navbar />
      <main className="flex-1">
        <Hero stats={stats} />
        <GovernoratesSection governorates={governorates} />
        <FeaturedSection properties={featured} />
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  );
}
