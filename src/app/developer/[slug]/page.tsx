import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/property/PropertyCard';
import { prisma } from '@/lib/prisma';

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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-navy mb-6">وحدات {developer.nameAr}</h1>
          {developer.properties.length === 0 ? (
            <p className="text-gray py-12">لا توجد وحدات لهذا المطور.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {developer.properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
