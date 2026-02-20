import { redirect } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileTabBar from '@/components/layout/MobileTabBar';
import PropertiesList from '@/components/properties/PropertiesList';
import PropertiesFilter from '@/components/properties/PropertiesFilter';
import ScrollProgress from '@/components/ui/ScrollProgress';
import CustomCursor from '@/components/ui/CustomCursor';
import ToastProvider from '@/components/ui/ToastProvider';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const q = params.q;
  if (!q || !q.trim()) redirect('/properties');

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <ScrollProgress />
      <CustomCursor />
      <ToastProvider />
      <Navbar />
      <main className="flex-1 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-playfair text-navy mb-2 leading-tight break-words">
              نتائج البحث: &quot;{q}&quot;
            </h1>
            <p className="text-gray-500 text-sm">عرض الوحدات المطابقة للبحث</p>
          </div>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <aside className="lg:w-72 shrink-0 lg:sticky lg:top-24 lg:self-start">
              <PropertiesFilter />
            </aside>
            <div className="flex-1 min-w-0">
              <PropertiesList searchQuery={q} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  );
}
