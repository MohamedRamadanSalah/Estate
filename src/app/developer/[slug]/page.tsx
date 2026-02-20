import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileTabBar from '@/components/layout/MobileTabBar';
import PropertyCard from '@/components/property/PropertyCard';
import ScrollProgress from '@/components/ui/ScrollProgress';
import CustomCursor from '@/components/ui/CustomCursor';
import ToastProvider from '@/components/ui/ToastProvider';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { prisma } from '@/lib/prisma';
import { Building2 } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const developer = await prisma.developer.findUnique({ where: { slug } });
  if (!developer) return { title: 'عقارك' };
  return { title: `وحدات ${developer.nameAr} | عقارك` };
}

export default async function DeveloperPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const developer = await prisma.developer.findUnique({
    where: { slug },
    include: {
      properties: {
        include: { governorate: true, city: true, developer: true },
      },
    },
  });
  if (!developer) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <ScrollProgress />
      <CustomCursor />
      <ToastProvider />
      <Navbar />
      <main className="flex-1 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection direction="up">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-copper rounded-2xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-navy" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold font-playfair text-navy">
                  {developer.nameAr}
                </h1>
                <p className="text-gray-500 text-sm">
                  {developer.properties.length} وحدة عقارية
                </p>
              </div>
            </div>
          </AnimatedSection>

          {developer.properties.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Building2 className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500">لا توجد وحدات لهذا المطور حالياً.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {developer.properties.map((p, i) => (
                <AnimatedSection key={p.id} direction="up" delay={i * 0.1}>
                  <PropertyCard property={p} />
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  );
}
