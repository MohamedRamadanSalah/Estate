import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileTabBar from '@/components/layout/MobileTabBar';
import ScrollProgress from '@/components/ui/ScrollProgress';
import CustomCursor from '@/components/ui/CustomCursor';
import ToastProvider from '@/components/ui/ToastProvider';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { prisma } from '@/lib/prisma';
import { Building2, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'المطورون العقاريون | عقارك',
  description: 'تعرف على أفضل المطورين العقاريين في مصر واستعرض مشاريعهم',
};

export const dynamic = 'force-dynamic';

export default async function DevelopersPage() {
  const developers = await prisma.developer.findMany({
    include: {
      _count: { select: { properties: true } },
    },
    orderBy: { nameAr: 'asc' },
  });

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <ScrollProgress />
      <CustomCursor />
      <ToastProvider />
      <Navbar />
      <main className="flex-1 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <AnimatedSection direction="up">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gold/10 to-copper/10 rounded-full text-gold text-sm font-semibold mb-4">
                <Building2 className="w-4 h-4" />
                شركاؤنا
              </span>
              <h1 className="text-3xl md:text-5xl font-bold font-playfair text-navy mb-3">
                المطورون العقاريون
              </h1>
              <p className="text-gray-500 max-w-lg mx-auto">
                نتعاون مع أفضل المطورين العقاريين في مصر لنقدم لك أرقى المشاريع
              </p>
            </div>
          </AnimatedSection>

          {developers.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Building2 className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500">لا يوجد مطورون حالياً.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {developers.map((dev, i) => (
                <AnimatedSection key={dev.id} direction="up" delay={i * 0.08}>
                  <Link href={`/developer/${dev.slug}`}>
                    <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gold/30 transition-all duration-300 text-center relative overflow-hidden">
                      {/* Gold shine on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-copper/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-navy/5 to-navy/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-gold/10 group-hover:to-copper/10 transition-colors">
                          <Building2 className="w-8 h-8 text-navy/60 group-hover:text-gold transition-colors" />
                        </div>

                        <h3 className="font-bold text-navy text-lg mb-1 group-hover:text-gold transition-colors font-playfair">
                          {dev.nameAr}
                        </h3>

                        <p className="text-sm text-gray-500 mb-4">
                          {dev._count.properties} وحدة عقارية
                        </p>

                        <span className="inline-flex items-center gap-1 text-xs text-gold font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                          عرض المشاريع
                          <ArrowLeft className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
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
