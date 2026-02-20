import { redirect } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PropertiesList from '@/components/properties/PropertiesList';
import PropertiesFilter from '@/components/properties/PropertiesFilter';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const q = params.q;
  if (!q || !q.trim()) redirect('/properties');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-5 md:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-navy mb-2 leading-tight break-words">
            نتائج البحث: &quot;{q}&quot;
          </h1>
          <p className="text-sm md:text-base text-gray mb-4 md:mb-6">عرض الوحدات المطابقة للبحث</p>
          <div className="flex flex-col lg:flex-row gap-5 md:gap-8">
            <aside className="lg:w-72 shrink-0">
              <PropertiesFilter />
            </aside>
            <div className="flex-1">
              <PropertiesList searchQuery={q} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
