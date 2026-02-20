import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/property/PropertyCard';
import SearchBar from '@/components/home/SearchBar';
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
    prisma.governorate.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-navy text-cream py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/10 to-transparent" />
          <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-5" />
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              اعثر على عقارك المثالي في مصر
            </h1>
            <p className="text-xl text-cream/80 mb-8 max-w-2xl mx-auto">
              شقق، فيلات، أرضي واستثمارات في أفضل المواقع - القاهرة، الجيزة، الإسكندرية والساحل الشمالي
            </p>
            <SearchBar />
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 bg-gold/10 border-y border-gold/20">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-navy">{stats.totalUnits.toLocaleString('ar-EG')}</p>
              <p className="text-gray">وحدة عقارية</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-navy">{stats.governorsCount}</p>
              <p className="text-gray">محافظة</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-navy">{stats.developersCount}</p>
              <p className="text-gray">مطور عقاري</p>
            </div>
          </div>
        </section>

        {/* Browse by Governorate */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-navy mb-8 text-center">تصفح حسب المحافظة</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {governorates.map((gov) => (
                <Link
                  key={gov.id}
                  href={`/governorate/${gov.slug}`}
                  className="group p-6 rounded-xl bg-white shadow-lg hover:shadow-xl hover:border-gold border-2 border-transparent transition-all"
                >
                  <p className="text-lg font-semibold text-navy group-hover:text-gold">{gov.nameAr}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="py-16 bg-cream">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-navy">أحدث الوحدات</h2>
              <Link
                href="/properties"
                className="text-gold font-semibold hover:text-copper"
              >
                عرض الكل ←
              </Link>
            </div>
            {featured.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featured.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray py-12">لا توجد وحدات حالياً. قريباً عقارات جديدة!</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
